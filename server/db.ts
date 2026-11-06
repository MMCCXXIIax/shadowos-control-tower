import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, creators, activity, InsertCreator, InsertActivity } from "../drizzle/schema";
import { ENV } from './_core/env';
import { CreatorRecord, ActivityRecord, EvidenceRecord, ScreeningRecord, FollowupRecord, OutreachDraftRecord, OutreachEventRecord, ProductBriefRecord, MarketingPlanRecord, MarketingItemRecord, getLiveCreator, getLiveScreening, insertLiveDraft, insertLiveEvent, insertLiveEvidence, insertLiveFollowup, insertLiveMarketingItem, insertLiveMarketingPlan, insertLiveProductBrief, isSupabaseConfigured, listLiveActivity, listLiveCreators, listLiveDrafts, listLiveEvidence, listLiveEvents, listLiveFollowups, listLiveMarketingItems, listLiveMarketingPlans, listLiveProductBriefs, patchLiveDraft, patchLiveMarketingItem, patchLiveMarketingPlan, patchLiveProductBrief, updateLiveCreator, upsertLiveScreening } from "./supabase";
import { WhopProductRecord, RevenueShareTermRecord, WhopTransactionRecord, insertWhopProduct, insertRevenueShareTerm, insertWhopTransaction, listWhopProducts, listRevenueShareTerms, listWhopTransactions } from "./whopRevenue";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb(); if (!db) throw new Error("Database is not available");
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  (['name','email','loginMethod'] as const).forEach(field => { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; } });
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

async function listLocalCreators(): Promise<CreatorRecord[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(creators).orderBy(desc(creators.updatedAt));
  return rows.map(row => ({ ...row, subNiche: row.subNiche, tags: row.tags ?? [] }));
}

async function getLocalCreator(creatorId: string): Promise<CreatorRecord | undefined> {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(creators).where(eq(creators.creatorId, creatorId)).limit(1);
  const row = result[0];
  return row ? { ...row, subNiche: row.subNiche, tags: row.tags ?? [] } : undefined;
}

async function listLocalActivity(creatorId: string): Promise<ActivityRecord[]> {
  const db = await getDb(); if (!db) return [];
  const rows = await db.select().from(activity).where(eq(activity.creatorId, creatorId)).orderBy(desc(activity.createdAt)).limit(50);
  return rows.map(row => ({ ...row }));
}

export async function listCreators() {
  if (isSupabaseConfigured()) {
    try { return await listLiveCreators(); }
    catch (error) { console.warn("[Supabase] Creator read failed; using local fallback", error instanceof Error ? error.message : "unknown error"); }
  }
  return listLocalCreators();
}

export async function getCreator(creatorId: string) {
  if (isSupabaseConfigured()) {
    try { return await getLiveCreator(creatorId); }
    catch (error) { console.warn("[Supabase] Creator read failed; using local fallback", error instanceof Error ? error.message : "unknown error"); }
  }
  return getLocalCreator(creatorId);
}

export async function listActivity(creatorId: string) {
  if (isSupabaseConfigured()) {
    try { return await listLiveActivity(creatorId); }
    catch (error) { console.warn("[Supabase] Activity read failed; using local fallback", error instanceof Error ? error.message : "unknown error"); }
  }
  return listLocalActivity(creatorId);
}

export async function getCreatorSource() {
  if (!isSupabaseConfigured()) return "Local fallback" as const;
  try {
    await listLiveCreators();
    return "Supabase live" as const;
  } catch (error) {
    console.warn("[Supabase] Source check failed", error instanceof Error ? error.message : "unknown error");
    return "Local fallback" as const;
  }
}

export async function listEvidence(creatorId: string) {
  if (isSupabaseConfigured()) {
    try { return await listLiveEvidence(creatorId); }
    catch (error) { console.warn("[Supabase] Evidence read failed", error instanceof Error ? error.message : "unknown error"); }
  }
  return [] as EvidenceRecord[];
}

export async function getScreening(creatorId: string) {
  if (isSupabaseConfigured()) {
    try { return await getLiveScreening(creatorId); }
    catch (error) { console.warn("[Supabase] Screening read failed", error instanceof Error ? error.message : "unknown error"); }
  }
  return undefined as ScreeningRecord | undefined;
}

export async function addEvidence(input: Omit<EvidenceRecord, "id" | "capturedAt">) {
  if (!isSupabaseConfigured()) throw new Error("Live Supabase is required to save evidence");
  return insertLiveEvidence(input);
}

export async function saveScreening(input: Omit<ScreeningRecord, "updatedAt">) {
  if (!isSupabaseConfigured()) throw new Error("Live Supabase is required to save screening");
  const screening = await upsertLiveScreening(input);
  const total = input.audienceFit + input.buyingSignals + input.expertiseAuthority + input.partnershipReadiness;
  const stage = input.decision === "qualified" ? "qualified" : input.decision === "hold" ? "screening" : input.decision === "reject" ? "archived" : "screening";
  await updateLiveCreator(input.creatorId, { qualification_score: total, stage, research_status: "deep_research", confidence: total >= 70 ? "high" : total >= 45 ? "medium" : "low", approval_status: input.decision === "qualified" ? "needs_review" : "not_ready" });
  return screening;
}

export async function listOutreachDrafts() {
  if (!isSupabaseConfigured()) return [] as OutreachDraftRecord[];
  try { return await listLiveDrafts(); }
  catch (error) { console.warn("[Supabase] Outreach draft read failed", error instanceof Error ? error.message : "unknown error"); return []; }
}

export async function listOutreachEvents(creatorId?: string) {
  if (!isSupabaseConfigured()) return [] as OutreachEventRecord[];
  try { return await listLiveEvents(creatorId); }
  catch (error) { console.warn("[Supabase] Outreach event read failed", error instanceof Error ? error.message : "unknown error"); return []; }
}

export async function listFollowups() {
  if (!isSupabaseConfigured()) return [] as FollowupRecord[];
  try { return await listLiveFollowups(); }
  catch (error) { console.warn("[Supabase] Follow-up read failed", error instanceof Error ? error.message : "unknown error"); return []; }
}

export async function createOutreachDraft(input: { creatorId: string; channel: "instagram" | "email"; subject: string | null; body: string; personalizationSummary: string | null }) {
  if (!isSupabaseConfigured()) throw new Error("Live Supabase is required to save outreach drafts");
  const creator = await getLiveCreator(input.creatorId);
  if (!creator || !["qualified", "outreach", "replied", "partnership", "product", "launch", "live"].includes(creator.stage)) throw new Error("Creator must be qualified before outreach drafting");
  const draft = await insertLiveDraft(input);
  if (draft) await insertLiveEvent({ creatorId: input.creatorId, draftId: draft.id, channel: input.channel, eventType: "draft_created", note: "Draft created in ShadowOS; no message sent." });
  return draft;
}

export async function updateOutreachDraftStatus(input: { id: number; status: "needs_review" | "approved" | "sent" | "replied" | "rejected" | "archived"; note: string | null }) {
  if (!isSupabaseConfigured()) throw new Error("Live Supabase is required to update outreach drafts");
  const drafts = await listLiveDrafts();
  const draft = drafts.find(item => item.id === input.id);
  if (!draft) throw new Error("Outreach draft not found");
  if (input.status === "sent" && draft.status !== "approved") throw new Error("Only approved drafts can be marked sent");
  const now = new Date().toISOString();
  const updated = await patchLiveDraft(input.id, { status: input.status, approved_at: input.status === "approved" ? now : draft.approvedAt, sent_at: input.status === "sent" ? now : draft.sentAt });
  if (updated) await insertLiveEvent({ creatorId: draft.creatorId, draftId: draft.id, channel: draft.channel, eventType: input.status === "needs_review" ? "submitted_for_review" : input.status, note: input.note });
  if (input.status === "sent") await updateLiveCreator(draft.creatorId, { stage: "outreach", approval_status: "approved" });
  if (input.status === "replied") await updateLiveCreator(draft.creatorId, { stage: "replied" });
  return updated;
}

export async function scheduleOutreachFollowup(input: { creatorId: string; draftId: number | null; channel: "instagram" | "email"; dueAt: string; note: string | null }) {
  if (!isSupabaseConfigured()) throw new Error("Live Supabase is required to schedule follow-ups");
  const followup = await insertLiveFollowup(input);
  if (followup) await insertLiveEvent({ creatorId: input.creatorId, draftId: input.draftId, channel: input.channel, eventType: "followup_due", note: `Follow-up scheduled for ${input.dueAt}.` });
  return followup;
}

export async function listProductBriefs(creatorId?: string) {
  if (!isSupabaseConfigured()) return [] as ProductBriefRecord[];
  try { return await listLiveProductBriefs(creatorId); }
  catch (error) { console.warn("[Supabase] Product brief read failed", error instanceof Error ? error.message : "unknown error"); return []; }
}

export async function createProductBrief(input: Omit<ProductBriefRecord, "id" | "status" | "productionReport" | "reviewNotes" | "reviewedAt" | "approvedAt" | "createdAt" | "updatedAt">) {
  if (!isSupabaseConfigured()) throw new Error("Live Supabase is required to save product briefs");
  const creator = await getLiveCreator(input.creatorId);
  if (!creator || !["qualified", "outreach", "replied", "partnership", "product", "launch", "live"].includes(creator.stage)) throw new Error("Creator must be qualified before Product Operations can begin");
  const existing = await listLiveProductBriefs(input.creatorId);
  if (existing.some(item => item.hypothesisNumber === input.hypothesisNumber)) throw new Error("That hypothesis slot is already used for this creator");
  return insertLiveProductBrief(input);
}

export async function updateProductBrief(input: { id: number; status?: "architected" | "handed_off" | "in_production" | "submitted_for_review" | "revision_requested" | "approved" | "archived"; productionReport?: string | null; reviewNotes?: string | null }) {
  if (!isSupabaseConfigured()) throw new Error("Live Supabase is required to update product briefs");
  const all = await listLiveProductBriefs();
  const current = all.find(item => item.id === input.id);
  if (!current) throw new Error("Product brief not found");
  if (input.status === "approved" && (!current.productionReport && !input.productionReport || !input.reviewNotes?.trim())) throw new Error("A production report and review notes are required before approval");
  const status = input.status ?? current.status;
  const patch = { status, production_report: input.productionReport ?? current.productionReport, review_notes: input.reviewNotes ?? current.reviewNotes, reviewed_at: ["submitted_for_review", "revision_requested", "approved"].includes(status) ? new Date().toISOString() : current.reviewedAt, approved_at: status === "approved" ? new Date().toISOString() : current.approvedAt };
  const updated = await patchLiveProductBrief(input.id, patch);
  if (status === "approved") await updateLiveCreator(current.creatorId, { stage: "product" });
  return updated;
}

export async function listMarketingPlans(creatorId?: string) { if (!isSupabaseConfigured()) return [] as MarketingPlanRecord[]; try { return await listLiveMarketingPlans(creatorId); } catch (error) { console.warn("[Supabase] Marketing plan read failed", error instanceof Error ? error.message : "unknown error"); return []; } }
export async function listMarketingItems(creatorId?: string) { if (!isSupabaseConfigured()) return [] as MarketingItemRecord[]; try { return await listLiveMarketingItems(creatorId); } catch (error) { console.warn("[Supabase] Marketing item read failed", error instanceof Error ? error.message : "unknown error"); return []; } }

export async function createMarketingPlan(input: Omit<MarketingPlanRecord, "id" | "status" | "reviewedAt" | "approvedAt" | "createdAt" | "updatedAt">) {
  if (!isSupabaseConfigured()) throw new Error("Live Supabase is required to save marketing plans");
  const creator = await getLiveCreator(input.creatorId);
  if (!creator || !["product", "launch", "live"].includes(creator.stage)) throw new Error("Creator must have an approved product before Marketing Operations can begin");
  if (input.productBriefId) { const briefs = await listLiveProductBriefs(input.creatorId); const brief = briefs.find(item => item.id === input.productBriefId); if (!brief || brief.status !== "approved") throw new Error("Marketing plans require an approved product brief"); }
  return insertLiveMarketingPlan(input);
}

export async function updateMarketingPlan(input: { id: number; status: "needs_review" | "approved" | "active" | "paused" | "archived"; }) {
  if (!isSupabaseConfigured()) throw new Error("Live Supabase is required to update marketing plans");
  const plans = await listLiveMarketingPlans(); const current = plans.find(plan => plan.id === input.id); if (!current) throw new Error("Marketing plan not found");
  if (input.status === "active" && current.status !== "approved") throw new Error("Only approved marketing plans can become active");
  return patchLiveMarketingPlan(input.id, { status: input.status, reviewed_at: input.status === "needs_review" || input.status === "approved" ? new Date().toISOString() : current.reviewedAt, approved_at: input.status === "approved" ? new Date().toISOString() : current.approvedAt });
}

export async function createMarketingItem(input: Omit<MarketingItemRecord, "id" | "status" | "createdAt" | "updatedAt">) {
  if (!isSupabaseConfigured()) throw new Error("Live Supabase is required to save marketing items");
  const creator = await getLiveCreator(input.creatorId); if (!creator || !["product", "launch", "live"].includes(creator.stage)) throw new Error("Creator must have an approved product before content planning can begin");
  if (input.planId) { const plans = await listLiveMarketingPlans(input.creatorId); if (!plans.some(plan => plan.id === input.planId)) throw new Error("Marketing plan does not belong to this creator"); }
  return insertLiveMarketingItem(input);
}

export async function updateMarketingItem(input: { id: number; status: "needs_review" | "approved" | "ready" | "published" | "archived" }) {
  if (!isSupabaseConfigured()) throw new Error("Live Supabase is required to update marketing items");
  const items = await listLiveMarketingItems(); const current = items.find(item => item.id === input.id); if (!current) throw new Error("Marketing item not found");
  if (["approved", "ready", "published"].includes(input.status) && current.status !== "approved" && input.status !== "approved") throw new Error("Marketing item must be approved before it can be ready or published");
  return patchLiveMarketingItem(input.id, { status: input.status });
}

export async function listRevenueProducts(creatorId?: string) { return listWhopProducts(creatorId); }
export async function listRevenueTerms(creatorId?: string) { return listRevenueShareTerms(creatorId); }
export async function listRevenueTransactions(creatorId?: string) { return listWhopTransactions(creatorId); }
export async function createRevenueProduct(input: Omit<WhopProductRecord, "id" | "status" | "lastSyncedAt" | "createdAt" | "updatedAt">) {
  const creator = await getLiveCreator(input.creatorId); if (!creator || !["product", "launch", "live"].includes(creator.stage)) throw new Error("Only product, launch, or live creators can receive a Whop product mapping");
  return insertWhopProduct(input);
}
export async function createRevenueTerm(input: Omit<RevenueShareTermRecord, "id" | "createdAt" | "updatedAt">) {
  if (input.creatorSharePercent + input.shadowSharePercent !== 100) throw new Error("Creator and ShadowOS shares must total 100%");
  const products = await listWhopProducts(input.creatorId); if (!products.some(product => product.id === input.whopProductId)) throw new Error("Revenue-share product does not belong to this creator");
  return insertRevenueShareTerm(input);
}
export async function createRevenueTransaction(input: Omit<WhopTransactionRecord, "id" | "importedAt">) {
  const products = await listWhopProducts(input.creatorId); if (input.whopProductId && !products.some(product => product.id === input.whopProductId)) throw new Error("Transaction product does not belong to this creator");
  if (input.grossAmountCents < 0 || input.whopFeesCents < 0 || input.refundsCents < 0) throw new Error("Revenue amounts cannot be negative");
  if (input.netAmountCents !== input.grossAmountCents - input.whopFeesCents - input.refundsCents) throw new Error("Net amount must equal gross minus Whop fees and refunds");
  if (input.creatorShareCents + input.shadowShareCents !== input.netAmountCents) throw new Error("Creator and ShadowOS amounts must equal net amount");
  return insertWhopTransaction(input);
}

export async function insertCreator(record: InsertCreator) { const db = await getDb(); if (!db) return; await db.insert(creators).values(record).onDuplicateKeyUpdate({ set: { updatedAt: new Date() } }); }
export async function insertActivity(record: InsertActivity) { const db = await getDb(); if (!db) return; await db.insert(activity).values(record); }
