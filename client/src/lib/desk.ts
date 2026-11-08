const PROJECT_URL = "https://bklrfjnqbyyntlhmprkp.supabase.co";
const QUALIFIED = ["qualified", "outreach", "replied", "partnership", "product", "launch", "live"];
const PRODUCT_READY = ["product", "launch", "live"];

export type DeskCreator = {
  creatorId: string; name: string; handle: string; profileUrl: string; industry: string; subNiche: string | null;
  stage: string; qualificationScore: number; confidence: string; researchStatus: string; approvalStatus: string;
};
export type DeskEvidence = { id: number; creatorId: string; evidenceType: string; title: string; sourceUrl: string | null; summary: string; signal: string; confidence: string; capturedAt: string };
export type DeskScreening = { creatorId: string; audienceFit: number; buyingSignals: number; expertiseAuthority: number; partnershipReadiness: number; decision: string; rationale: string | null; screenedAt: string | null };
export type DeskDraft = { id: number; creatorId: string; channel: string; subject: string | null; body: string; personalizationSummary: string | null; status: string; approvedAt: string | null; sentAt: string | null; createdAt: string; updatedAt: string };
export type DeskFollowup = { id: number; creatorId: string; draftId: number | null; channel: string; dueAt: string; status: string; note: string | null; createdAt: string };
export type DeskBrief = { id: number; creatorId: string; hypothesisNumber: number; productName: string; audienceProblem: string; buyingSignal: string | null; transformation: string; format: string; outline: string; assetRequirements: string | null; visualDirection: string | null; launchNotes: string | null; status: string; productionReport: string | null; reviewNotes: string | null; reviewedAt: string | null; approvedAt: string | null; createdAt: string; updatedAt: string };
export type DeskPlan = { id: number; creatorId: string; productBriefId: number | null; campaignName: string; audienceSegment: string; positioning: string; offerAngle: string; voiceNotes: string | null; preLaunchStrategy: string; postLaunchStrategy: string; assetChecklist: string | null; status: string; reviewedAt: string | null; approvedAt: string | null; createdAt: string; updatedAt: string };
export type DeskItem = { id: number; creatorId: string; planId: number | null; productBriefId: number | null; phase: string; channel: string; contentType: string; title: string; objective: string; hook: string | null; body: string | null; callToAction: string | null; assetDirection: string | null; scheduledFor: string | null; status: string; createdAt: string; updatedAt: string };
export type DeskProduct = { id: number; creatorId: string; productBriefId: number | null; whopProductId: string | null; productName: string; status: string; currency: string; lastSyncedAt: string | null; createdAt: string; updatedAt: string };
export type DeskTerm = { id: number; creatorId: string; whopProductId: number; creatorSharePercent: number; shadowSharePercent: number; negotiated: boolean; effectiveAt: string; status: string; createdAt: string; updatedAt: string };
export type DeskTransaction = { id: number; whopPaymentId: string | null; creatorId: string; whopProductId: number | null; grossAmountCents: number; whopFeesCents: number; refundsCents: number; netAmountCents: number; creatorShareCents: number; shadowShareCents: number; currency: string; paymentStatus: string; paidAt: string | null; source: string; importedAt: string };

function runtime() {
  const env = import.meta.env as Record<string, string | undefined>;
  return {
    url: (env.VITE_SUPABASE_URL || PROJECT_URL).replace(/\/$/, ""),
    key: env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY || "",
  };
}

export function isDeskConfigured() {
  return Boolean(runtime().key);
}

async function rest<T>(path: string, init?: RequestInit): Promise<T> {
  const { url, key } = runtime();
  if (!key) throw new Error("Supabase publishable key is missing. Set VITE_SUPABASE_PUBLISHABLE_KEY and rebuild.");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json", Prefer: "return=representation" } : {}),
      ...init?.headers,
    },
  });
  const text = await response.text();
  if (!response.ok) {
    let detail = text;
    try { detail = JSON.parse(text).message || text; } catch { /* keep raw text */ }
    throw new Error(detail || `Supabase request failed (${response.status})`);
  }
  return (text ? JSON.parse(text) : undefined) as T;
}

const creator = (row: any): DeskCreator => ({ creatorId: row.creator_id, name: row.name, handle: row.handle, profileUrl: row.profile_url, industry: row.industry, subNiche: row.sub_niche, stage: row.stage, qualificationScore: row.qualification_score ?? 0, confidence: row.confidence, researchStatus: row.research_status, approvalStatus: row.approval_status });
const evidence = (row: any): DeskEvidence => ({ id: row.id, creatorId: row.creator_id, evidenceType: row.evidence_type, title: row.title, sourceUrl: row.source_url, summary: row.summary, signal: row.signal, confidence: row.confidence, capturedAt: row.captured_at });
const screening = (row: any): DeskScreening => ({ creatorId: row.creator_id, audienceFit: row.audience_fit, buyingSignals: row.buying_signals, expertiseAuthority: row.expertise_authority, partnershipReadiness: row.partnership_readiness, decision: row.decision, rationale: row.rationale, screenedAt: row.screened_at });
const draft = (row: any): DeskDraft => ({ id: row.id, creatorId: row.creator_id, channel: row.channel, subject: row.subject, body: row.body, personalizationSummary: row.personalization_summary, status: row.status, approvedAt: row.approved_at, sentAt: row.sent_at, createdAt: row.created_at, updatedAt: row.updated_at });
const followup = (row: any): DeskFollowup => ({ id: row.id, creatorId: row.creator_id, draftId: row.draft_id, channel: row.channel, dueAt: row.due_at, status: row.status, note: row.note, createdAt: row.created_at });
const brief = (row: any): DeskBrief => ({ id: row.id, creatorId: row.creator_id, hypothesisNumber: row.hypothesis_number, productName: row.product_name, audienceProblem: row.audience_problem, buyingSignal: row.buying_signal, transformation: row.transformation, format: row.format, outline: row.outline, assetRequirements: row.asset_requirements, visualDirection: row.visual_direction, launchNotes: row.launch_notes, status: row.status, productionReport: row.production_report, reviewNotes: row.review_notes, reviewedAt: row.reviewed_at, approvedAt: row.approved_at, createdAt: row.created_at, updatedAt: row.updated_at });
const plan = (row: any): DeskPlan => ({ id: row.id, creatorId: row.creator_id, productBriefId: row.product_brief_id, campaignName: row.campaign_name, audienceSegment: row.audience_segment, positioning: row.positioning, offerAngle: row.offer_angle, voiceNotes: row.voice_notes, preLaunchStrategy: row.pre_launch_strategy, postLaunchStrategy: row.post_launch_strategy, assetChecklist: row.asset_checklist, status: row.status, reviewedAt: row.reviewed_at, approvedAt: row.approved_at, createdAt: row.created_at, updatedAt: row.updated_at });
const item = (row: any): DeskItem => ({ id: row.id, creatorId: row.creator_id, planId: row.plan_id, productBriefId: row.product_brief_id, phase: row.phase, channel: row.channel, contentType: row.content_type, title: row.title, objective: row.objective, hook: row.hook, body: row.body, callToAction: row.call_to_action, assetDirection: row.asset_direction, scheduledFor: row.scheduled_for, status: row.status, createdAt: row.created_at, updatedAt: row.updated_at });
const product = (row: any): DeskProduct => ({ id: row.id, creatorId: row.creator_id, productBriefId: row.product_brief_id, whopProductId: row.whop_product_id, productName: row.product_name, status: row.status, currency: row.currency, lastSyncedAt: row.last_synced_at, createdAt: row.created_at, updatedAt: row.updated_at });
const term = (row: any): DeskTerm => ({ id: row.id, creatorId: row.creator_id, whopProductId: row.whop_product_id, creatorSharePercent: Number(row.creator_share_percent), shadowSharePercent: Number(row.shadow_share_percent), negotiated: row.negotiated, effectiveAt: row.effective_at, status: row.status, createdAt: row.created_at, updatedAt: row.updated_at });
const transaction = (row: any): DeskTransaction => ({ id: row.id, whopPaymentId: row.whop_payment_id, creatorId: row.creator_id, whopProductId: row.whop_product_id, grossAmountCents: row.gross_amount_cents, whopFeesCents: row.whop_fees_cents, refundsCents: row.refunds_cents, netAmountCents: row.net_amount_cents, creatorShareCents: row.creator_share_cents, shadowShareCents: row.shadow_share_cents, currency: row.currency, paymentStatus: row.payment_status, paidAt: row.paid_at, source: row.source, importedAt: row.imported_at });

async function oneCreator(creatorId: string) {
  const rows = await rest<any[]>(`shadowos_creators?select=*&creator_id=eq.${encodeURIComponent(creatorId)}&limit=1`);
  return rows[0] ? creator(rows[0]) : undefined;
}

export async function listCreators() {
  return (await rest<any[]>("shadowos_creators?select=*&order=updated_at.desc&limit=250")).map(creator);
}
export async function listEvidence(creatorId: string) {
  return (await rest<any[]>(`shadowos_creator_evidence?select=*&creator_id=eq.${encodeURIComponent(creatorId)}&order=captured_at.desc&limit=100`)).map(evidence);
}
export async function getScreening(creatorId: string) {
  const rows = await rest<any[]>(`shadowos_creator_screenings?select=*&creator_id=eq.${encodeURIComponent(creatorId)}&limit=1`);
  return rows[0] ? screening(rows[0]) : null;
}
export async function listDrafts() {
  return (await rest<any[]>("shadowos_outreach_drafts?select=*&order=updated_at.desc&limit=250")).map(draft);
}
export async function listFollowups() {
  return (await rest<any[]>("shadowos_followups?select=*&order=due_at.asc&limit=250")).map(followup);
}
export async function listBriefs() {
  return (await rest<any[]>("shadowos_product_briefs?select=*&order=updated_at.desc&limit=500")).map(brief);
}
export async function listPlans() {
  return (await rest<any[]>("shadowos_marketing_plans?select=*&order=updated_at.desc&limit=250")).map(plan);
}
export async function listItems() {
  return (await rest<any[]>("shadowos_marketing_items?select=*&order=scheduled_for.asc.nullslast,updated_at.desc&limit=500")).map(item);
}
export async function listProducts() {
  return (await rest<any[]>("shadowos_whop_products?select=*&order=updated_at.desc&limit=250")).map(product);
}
export async function listTerms() {
  return (await rest<any[]>("shadowos_revenue_share_terms?select=*&order=updated_at.desc&limit=250")).map(term);
}
export async function listTransactions() {
  return (await rest<any[]>("shadowos_whop_transactions?select=*&order=paid_at.desc.nullslast,imported_at.desc&limit=500")).map(transaction);
}

export async function addEvidence(input: { creatorId: string; evidenceType: string; title: string; sourceUrl: string; summary: string; signal: string; confidence: string }) {
  const rows = await rest<any[]>("shadowos_creator_evidence", { method: "POST", body: JSON.stringify({ creator_id: input.creatorId, evidence_type: input.evidenceType, title: input.title, source_url: input.sourceUrl || null, summary: input.summary, signal: input.signal, confidence: input.confidence }) });
  return rows[0] ? evidence(rows[0]) : undefined;
}

export async function saveScreening(input: { creatorId: string; audienceFit: number; buyingSignals: number; expertiseAuthority: number; partnershipReadiness: number; decision: string; rationale: string | null; screenedAt: string }) {
  const rows = await rest<any[]>("shadowos_creator_screenings?on_conflict=creator_id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({ creator_id: input.creatorId, audience_fit: input.audienceFit, buying_signals: input.buyingSignals, expertise_authority: input.expertiseAuthority, partnership_readiness: input.partnershipReadiness, decision: input.decision, rationale: input.rationale, screened_at: input.screenedAt }),
  });
  const total = input.audienceFit + input.buyingSignals + input.expertiseAuthority + input.partnershipReadiness;
  const stage = input.decision === "qualified" ? "qualified" : input.decision === "hold" ? "screening" : input.decision === "reject" ? "archived" : "screening";
  await rest(`shadowos_creators?creator_id=eq.${encodeURIComponent(input.creatorId)}`, {
    method: "PATCH",
    body: JSON.stringify({ qualification_score: total, stage, research_status: "deep_research", confidence: total >= 70 ? "high" : total >= 45 ? "medium" : "low", approval_status: input.decision === "qualified" ? "needs_review" : "not_ready" }),
  });
  return rows[0] ? screening(rows[0]) : null;
}

export async function createDraft(input: { creatorId: string; channel: string; subject: string | null; body: string; personalizationSummary: string | null }) {
  const current = await oneCreator(input.creatorId);
  if (!current || !QUALIFIED.includes(current.stage)) throw new Error("Creator must be qualified before outreach drafting");
  const rows = await rest<any[]>("shadowos_outreach_drafts", { method: "POST", body: JSON.stringify({ creator_id: input.creatorId, channel: input.channel, subject: input.subject, body: input.body, personalization_summary: input.personalizationSummary, status: "draft" }) });
  const saved = rows[0] ? draft(rows[0]) : undefined;
  if (saved) await rest("shadowos_outreach_events", { method: "POST", body: JSON.stringify({ creator_id: input.creatorId, draft_id: saved.id, channel: input.channel, event_type: "draft_created", note: "Draft created in ShadowOS; no message sent." }) });
  return saved;
}

export async function updateDraftStatus(input: { id: number; status: string; note: string | null }) {
  const drafts = await listDrafts();
  const current = drafts.find(item => item.id === input.id);
  if (!current) throw new Error("Outreach draft not found");
  if (input.status === "sent" && current.status !== "approved") throw new Error("Only approved drafts can be marked sent");
  const now = new Date().toISOString();
  const rows = await rest<any[]>(`shadowos_outreach_drafts?id=eq.${input.id}`, { method: "PATCH", body: JSON.stringify({ status: input.status, approved_at: input.status === "approved" ? now : current.approvedAt, sent_at: input.status === "sent" ? now : current.sentAt }) });
  await rest("shadowos_outreach_events", { method: "POST", body: JSON.stringify({ creator_id: current.creatorId, draft_id: current.id, channel: current.channel, event_type: input.status === "needs_review" ? "submitted_for_review" : input.status, note: input.note }) });
  if (input.status === "sent") await rest(`shadowos_creators?creator_id=eq.${encodeURIComponent(current.creatorId)}`, { method: "PATCH", body: JSON.stringify({ stage: "outreach", approval_status: "approved" }) });
  if (input.status === "replied") await rest(`shadowos_creators?creator_id=eq.${encodeURIComponent(current.creatorId)}`, { method: "PATCH", body: JSON.stringify({ stage: "replied" }) });
  return rows[0] ? draft(rows[0]) : undefined;
}

export async function scheduleFollowup(input: { creatorId: string; draftId: number | null; channel: string; dueAt: string; note: string | null }) {
  const rows = await rest<any[]>("shadowos_followups", { method: "POST", body: JSON.stringify({ creator_id: input.creatorId, draft_id: input.draftId, channel: input.channel, due_at: input.dueAt, note: input.note, status: "scheduled" }) });
  await rest("shadowos_outreach_events", { method: "POST", body: JSON.stringify({ creator_id: input.creatorId, draft_id: input.draftId, channel: input.channel, event_type: "followup_due", note: `Follow-up scheduled for ${input.dueAt}.` }) });
  return rows[0] ? followup(rows[0]) : undefined;
}

export async function createBrief(input: { creatorId: string; hypothesisNumber: number; productName: string; audienceProblem: string; buyingSignal: string | null; transformation: string; format: string; outline: string; assetRequirements: string | null; visualDirection: string | null; launchNotes: string | null }) {
  const current = await oneCreator(input.creatorId);
  if (!current || !QUALIFIED.includes(current.stage)) throw new Error("Creator must be qualified before Product Operations can begin");
  const existing = (await listBriefs()).filter(item => item.creatorId === input.creatorId);
  if (existing.some(item => item.hypothesisNumber === input.hypothesisNumber)) throw new Error("That hypothesis slot is already used for this creator");
  const rows = await rest<any[]>("shadowos_product_briefs", { method: "POST", body: JSON.stringify({ creator_id: input.creatorId, hypothesis_number: input.hypothesisNumber, product_name: input.productName, audience_problem: input.audienceProblem, buying_signal: input.buyingSignal, transformation: input.transformation, format: input.format, outline: input.outline, asset_requirements: input.assetRequirements, visual_direction: input.visualDirection, launch_notes: input.launchNotes, status: "hypothesis" }) });
  return rows[0] ? brief(rows[0]) : undefined;
}

export async function updateBrief(input: { id: number; status?: string; productionReport?: string | null; reviewNotes?: string | null }) {
  const current = (await listBriefs()).find(item => item.id === input.id);
  if (!current) throw new Error("Product brief not found");
  if (input.status === "approved" && (!(current.productionReport || input.productionReport) || !input.reviewNotes?.trim())) throw new Error("A production report and review notes are required before approval");
  const status = input.status ?? current.status;
  const rows = await rest<any[]>(`shadowos_product_briefs?id=eq.${input.id}`, { method: "PATCH", body: JSON.stringify({ status, production_report: input.productionReport ?? current.productionReport, review_notes: input.reviewNotes ?? current.reviewNotes, reviewed_at: ["submitted_for_review", "revision_requested", "approved"].includes(status) ? new Date().toISOString() : current.reviewedAt, approved_at: status === "approved" ? new Date().toISOString() : current.approvedAt }) });
  if (status === "approved") await rest(`shadowos_creators?creator_id=eq.${encodeURIComponent(current.creatorId)}`, { method: "PATCH", body: JSON.stringify({ stage: "product" }) });
  return rows[0] ? brief(rows[0]) : undefined;
}

export async function createPlan(input: { creatorId: string; productBriefId: number | null; campaignName: string; audienceSegment: string; positioning: string; offerAngle: string; voiceNotes: string | null; preLaunchStrategy: string; postLaunchStrategy: string; assetChecklist: string | null }) {
  const current = await oneCreator(input.creatorId);
  if (!current || !PRODUCT_READY.includes(current.stage)) throw new Error("Creator must have an approved product before Marketing Operations can begin");
  if (input.productBriefId) {
    const match = (await listBriefs()).find(item => item.id === input.productBriefId && item.creatorId === input.creatorId);
    if (!match || match.status !== "approved") throw new Error("Marketing plans require an approved product brief");
  }
  const rows = await rest<any[]>("shadowos_marketing_plans", { method: "POST", body: JSON.stringify({ creator_id: input.creatorId, product_brief_id: input.productBriefId, campaign_name: input.campaignName, audience_segment: input.audienceSegment, positioning: input.positioning, offer_angle: input.offerAngle, voice_notes: input.voiceNotes, pre_launch_strategy: input.preLaunchStrategy, post_launch_strategy: input.postLaunchStrategy, asset_checklist: input.assetChecklist, status: "draft" }) });
  return rows[0] ? plan(rows[0]) : undefined;
}

export async function updatePlan(input: { id: number; status: string }) {
  const current = (await listPlans()).find(item => item.id === input.id);
  if (!current) throw new Error("Marketing plan not found");
  if (input.status === "active" && current.status !== "approved") throw new Error("Only approved marketing plans can become active");
  const rows = await rest<any[]>(`shadowos_marketing_plans?id=eq.${input.id}`, { method: "PATCH", body: JSON.stringify({ status: input.status, reviewed_at: input.status === "needs_review" || input.status === "approved" ? new Date().toISOString() : current.reviewedAt, approved_at: input.status === "approved" ? new Date().toISOString() : current.approvedAt }) });
  return rows[0] ? plan(rows[0]) : undefined;
}

export async function createItem(input: { creatorId: string; planId: number | null; productBriefId: number | null; phase: string; channel: string; contentType: string; title: string; objective: string; hook: string | null; body: string | null; callToAction: string | null; assetDirection: string | null; scheduledFor: string | null }) {
  const current = await oneCreator(input.creatorId);
  if (!current || !PRODUCT_READY.includes(current.stage)) throw new Error("Creator must have an approved product before content planning can begin");
  const rows = await rest<any[]>("shadowos_marketing_items", { method: "POST", body: JSON.stringify({ creator_id: input.creatorId, plan_id: input.planId, product_brief_id: input.productBriefId, phase: input.phase, channel: input.channel, content_type: input.contentType, title: input.title, objective: input.objective, hook: input.hook, body: input.body, call_to_action: input.callToAction, asset_direction: input.assetDirection, scheduled_for: input.scheduledFor, status: "draft" }) });
  return rows[0] ? item(rows[0]) : undefined;
}

export async function updateItem(input: { id: number; status: string }) {
  const current = (await listItems()).find(entry => entry.id === input.id);
  if (!current) throw new Error("Marketing item not found");
  if (["ready", "published"].includes(input.status) && current.status !== "approved") throw new Error("Marketing item must be approved before it can be ready or published");
  const rows = await rest<any[]>(`shadowos_marketing_items?id=eq.${input.id}`, { method: "PATCH", body: JSON.stringify({ status: input.status }) });
  return rows[0] ? item(rows[0]) : undefined;
}
