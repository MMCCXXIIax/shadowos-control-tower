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

export type ActivityRecord = {
  id: number;
  creatorId: string;
  type: string;
  title: string;
  detail: string | null;
  createdAt: string | Date;
};

type SupabaseCreatorRow = {
  creator_id: string;
  name: string;
  handle: string;
  profile_url: string;
  industry: string;
  sub_niche: string | null;
  geography: string | null;
  follower_evidence: string | null;
  stage: string;
  qualification_score: number;
  confidence: string;
  research_status: string;
  approval_status: string;
  tags: string[] | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type SupabaseActivityRow = {
  id: number;
  creator_id: string;
  type: string;
  title: string;
  detail: string | null;
  created_at: string;
};

function config() {
  return {
    url: process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "",
    key: process.env.SUPABASE_PUBLISHABLE_KEY ?? "",
  };
}

export function isSupabaseConfigured() {
  const { url, key } = config();
  return Boolean(url && key);
}

async function supabaseFetch<T>(path: string): Promise<T> {
  const { url, key } = config();
  if (!url || !key) throw new Error("Supabase runtime configuration is missing");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
    },
  });
  if (!response.ok) throw new Error(`Supabase request failed with status ${response.status}`);
  return response.json() as Promise<T>;
}

function normalizeCreator(row: SupabaseCreatorRow): CreatorRecord {
  return {
    creatorId: row.creator_id,
    name: row.name,
    handle: row.handle,
    profileUrl: row.profile_url,
    industry: row.industry,
    subNiche: row.sub_niche,
    geography: row.geography,
    followerEvidence: row.follower_evidence,
    stage: row.stage,
    qualificationScore: row.qualification_score,
    confidence: row.confidence,
    researchStatus: row.research_status,
    approvalStatus: row.approval_status,
    tags: row.tags ?? [],
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function normalizeActivity(row: SupabaseActivityRow): ActivityRecord {
  return {
    id: row.id,
    creatorId: row.creator_id,
    type: row.type,
    title: row.title,
    detail: row.detail,
    createdAt: row.created_at,
  };
}

export async function listLiveCreators() {
  const rows = await supabaseFetch<SupabaseCreatorRow[]>("shadowos_creators?select=*&order=updated_at.desc&limit=250");
  return rows.map(normalizeCreator);
}

export async function getLiveCreator(creatorId: string) {
  const rows = await supabaseFetch<SupabaseCreatorRow[]>(`shadowos_creators?select=*&creator_id=eq.${encodeURIComponent(creatorId)}&limit=1`);
  return rows[0] ? normalizeCreator(rows[0]) : undefined;
}

export async function listLiveActivity(creatorId: string) {
  const rows = await supabaseFetch<SupabaseActivityRow[]>(`shadowos_activity?select=*&creator_id=eq.${encodeURIComponent(creatorId)}&order=created_at.desc&limit=50`);
  return rows.map(normalizeActivity);
}
