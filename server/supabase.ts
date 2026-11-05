export type CreatorRecord = {
  id?: number;
  creatorId: string;
  name: string;
  handle: string;
  profileUrl: string;
  industry: string;
  subNiche: string | null;
  geography?: string | null;
  followerEvidence?: string | null;
  stage: string;
  qualificationScore: number;
  confidence: string;
  researchStatus: string;
  approvalStatus: string;
  tags?: string[] | string | null;
  notes?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type ActivityRecord = { id: number; creatorId: string; type: string; title: string; detail: string | null; createdAt: string | Date };
export type EvidenceRecord = { id: number; creatorId: string; evidenceType: string; title: string; sourceUrl: string | null; summary: string; signal: string; confidence: string; capturedAt: string };
export type ScreeningRecord = { creatorId: string; audienceFit: number; buyingSignals: number; expertiseAuthority: number; partnershipReadiness: number; decision: string; rationale: string | null; screenedAt: string | null; updatedAt: string };

type SupabaseCreatorRow = { creator_id: string; name: string; handle: string; profile_url: string; industry: string; sub_niche: string | null; geography: string | null; follower_evidence: string | null; stage: string; qualification_score: number; confidence: string; research_status: string; approval_status: string; tags: string[] | null; notes: string | null; created_at: string; updated_at: string };
type SupabaseActivityRow = { id: number; creator_id: string; type: string; title: string; detail: string | null; created_at: string };
type SupabaseEvidenceRow = { id: number; creator_id: string; evidence_type: string; title: string; source_url: string | null; summary: string; signal: string; confidence: string; captured_at: string };
type SupabaseScreeningRow = { creator_id: string; audience_fit: number; buying_signals: number; expertise_authority: number; partnership_readiness: number; decision: string; rationale: string | null; screened_at: string | null; updated_at: string };

function config() { return { url: process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "", key: process.env.SUPABASE_PUBLISHABLE_KEY ?? "" }; }
export function isSupabaseConfigured() { const { url, key } = config(); return Boolean(url && key); }

async function supabaseFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { url, key } = config();
  if (!url || !key) throw new Error("Supabase runtime configuration is missing");
  const response = await fetch(`${url}/rest/v1/${path}`, { ...init, headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: "application/json", ...(init?.body ? { "Content-Type": "application/json", Prefer: "return=representation" } : {}), ...init?.headers } });
  if (!response.ok) throw new Error(`Supabase request failed with status ${response.status}`);
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

function normalizeCreator(row: SupabaseCreatorRow): CreatorRecord { return { creatorId: row.creator_id, name: row.name, handle: row.handle, profileUrl: row.profile_url, industry: row.industry, subNiche: row.sub_niche, geography: row.geography, followerEvidence: row.follower_evidence, stage: row.stage, qualificationScore: row.qualification_score, confidence: row.confidence, researchStatus: row.research_status, approvalStatus: row.approval_status, tags: row.tags ?? [], notes: row.notes, createdAt: row.created_at, updatedAt: row.updated_at }; }
function normalizeActivity(row: SupabaseActivityRow): ActivityRecord { return { id: row.id, creatorId: row.creator_id, type: row.type, title: row.title, detail: row.detail, createdAt: row.created_at }; }
function normalizeEvidence(row: SupabaseEvidenceRow): EvidenceRecord { return { id: row.id, creatorId: row.creator_id, evidenceType: row.evidence_type, title: row.title, sourceUrl: row.source_url, summary: row.summary, signal: row.signal, confidence: row.confidence, capturedAt: row.captured_at }; }
function normalizeScreening(row: SupabaseScreeningRow): ScreeningRecord { return { creatorId: row.creator_id, audienceFit: row.audience_fit, buyingSignals: row.buying_signals, expertiseAuthority: row.expertise_authority, partnershipReadiness: row.partnership_readiness, decision: row.decision, rationale: row.rationale, screenedAt: row.screened_at, updatedAt: row.updated_at }; }

export async function listLiveCreators() { const rows = await supabaseFetch<SupabaseCreatorRow[]>("shadowos_creators?select=*&order=updated_at.desc&limit=250"); return rows.map(normalizeCreator); }
export async function getLiveCreator(creatorId: string) { const rows = await supabaseFetch<SupabaseCreatorRow[]>(`shadowos_creators?select=*&creator_id=eq.${encodeURIComponent(creatorId)}&limit=1`); return rows[0] ? normalizeCreator(rows[0]) : undefined; }
export async function listLiveActivity(creatorId: string) { const rows = await supabaseFetch<SupabaseActivityRow[]>(`shadowos_activity?select=*&creator_id=eq.${encodeURIComponent(creatorId)}&order=created_at.desc&limit=50`); return rows.map(normalizeActivity); }
export async function listLiveEvidence(creatorId: string) { const rows = await supabaseFetch<SupabaseEvidenceRow[]>(`shadowos_creator_evidence?select=*&creator_id=eq.${encodeURIComponent(creatorId)}&order=captured_at.desc&limit=100`); return rows.map(normalizeEvidence); }
export async function getLiveScreening(creatorId: string) { const rows = await supabaseFetch<SupabaseScreeningRow[]>(`shadowos_creator_screenings?select=*&creator_id=eq.${encodeURIComponent(creatorId)}&limit=1`); return rows[0] ? normalizeScreening(rows[0]) : undefined; }
export async function insertLiveEvidence(input: Omit<EvidenceRecord, "id" | "capturedAt">) { const rows = await supabaseFetch<SupabaseEvidenceRow[]>("shadowos_creator_evidence", { method: "POST", body: JSON.stringify({ creator_id: input.creatorId, evidence_type: input.evidenceType, title: input.title, source_url: input.sourceUrl, summary: input.summary, signal: input.signal, confidence: input.confidence }) }); return rows[0] ? normalizeEvidence(rows[0]) : undefined; }
export async function upsertLiveScreening(input: Omit<ScreeningRecord, "updatedAt">) { const rows = await supabaseFetch<SupabaseScreeningRow[]>("shadowos_creator_screenings?on_conflict=creator_id", { method: "POST", body: JSON.stringify({ creator_id: input.creatorId, audience_fit: input.audienceFit, buying_signals: input.buyingSignals, expertise_authority: input.expertiseAuthority, partnership_readiness: input.partnershipReadiness, decision: input.decision, rationale: input.rationale, screened_at: input.screenedAt }), headers: { Prefer: "resolution=merge-duplicates,return=representation" } }); return rows[0] ? normalizeScreening(rows[0]) : undefined; }
export async function updateLiveCreator(creatorId: string, patch: Record<string, unknown>) { const rows = await supabaseFetch<SupabaseCreatorRow[]>(`shadowos_creators?creator_id=eq.${encodeURIComponent(creatorId)}`, { method: "PATCH", body: JSON.stringify(patch) }); return rows[0] ? normalizeCreator(rows[0]) : undefined; }
