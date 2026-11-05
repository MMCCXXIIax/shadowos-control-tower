import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { Activity, ArrowUpRight, BarChart3, Bell, CircleDashed, Clock3, Database, FileText, Filter, Instagram, Mail, Menu, MoreHorizontal, Package, Search, Send, ShieldCheck, Sparkles, Sprout, Target, UserRound, Wallet, Wifi, X } from "lucide-react";

type CreatorView = {
  creatorId: string;
  name: string;
  handle: string;
  profileUrl: string;
  industry: string;
  subNiche: string | null;
  stage: string;
  researchStatus: string;
  confidence: string;
  qualificationScore: number;
  approvalStatus: string;
};

const priorityCreators: CreatorView[] = [
  ["Ornagarden Kick", "onagardenkick"], ["Quarter Acre Roots", "quarteracreroots"], ["Michelle", "everydaygardeningtips"], ["Tyler & Brian", "gardenerinlove"], ["Alison", "cookseyfarms"], ["Inna", "gardens_better_with_cats"], ["Timothy Hammond", "bigcitygardener"], ["Milan Turner", "atlgrow"], ["Meenakshi", "meditativegardening"], ["Helier", "garden_goddess_uk"], ["Jo Thompson", "jothompsongarden"], ["Katie Townsend", "katietownsendgardendesign"], ["Joanna Archer Garden Design", "joannaarchergardendesign"], ["Kamili Bell Hill", "plantblerd"], ["Kaylee Ellen", "kayleeellenofficial"], ["Ashley Anita", "lifewithashleyanita"], ["Amy", "thehobbyhomestead"], ["Gardening Indoors", "_gardeningindoors"], ["Gardenerd", "gardenerd1"], ["Cloud Gardener", "cloudgardeneruk"], ["Kath Irvine", "edible.backyard"], ["Carly", "thegardenspot"], ["Tony", "tonygrowsfood"], ["Beth", "filipinafarmstead"], ["Dominika", "17m2garden"], ["Divya Kanwar", "indiangreendreams"], ["Kia Jade", "kia_urbangardener"], ["Peter Vouthas", "urbancitygardener"], ["Jill Mc Sheehy", "thebeginnersgarden"], ["Adam Long", "itsanadamadventure"], ["Front Porch", "frontporchfarmer"],
].map(([name, handle], index) => ({ creatorId: `SO-${String(index + 1).padStart(4, "0")}`, name, handle, profileUrl: `https://www.instagram.com/${handle}/`, industry: "Gardening", subNiche: index % 3 === 0 ? "Urban food growing" : index % 3 === 1 ? "Homesteading & edible gardens" : "Garden design & education", stage: "discovery", researchStatus: "unverified", confidence: "unknown", qualificationScore: 0, approvalStatus: "not_ready" }));

const stageMeta: Record<string, { label: string; tone: string }> = {
  discovery: { label: "Discovery", tone: "bg-[#f2ede5] text-[#66594c]" },
  screening: { label: "Screening", tone: "bg-[#e8f0eb] text-[#3c6549]" },
  qualified: { label: "Qualified", tone: "bg-[#dcece4] text-[#2f6545]" },
  outreach: { label: "Outreach", tone: "bg-[#fff0dc] text-[#8a5b25]" },
  replied: { label: "Replied", tone: "bg-[#e1edf5] text-[#41657b]" },
  partnership: { label: "Partnership", tone: "bg-[#ece5f4] text-[#685079]" },
  product: { label: "Product", tone: "bg-[#f2e7d8] text-[#8b622f]" },
  launch: { label: "Launch", tone: "bg-[#e4eee7] text-[#3b6c4b]" },
  live: { label: "Live", tone: "bg-[#dcece4] text-[#2f6545]" },
  archived: { label: "Archived", tone: "bg-[#edeae6] text-[#756e66]" },
};

function normalizeCreator(record: any): CreatorView {
  return { creatorId: record.creatorId ?? record.creator_id, name: record.name, handle: record.handle, profileUrl: record.profileUrl ?? record.profile_url, industry: record.industry, subNiche: record.subNiche ?? record.sub_niche ?? null, stage: record.stage, researchStatus: record.researchStatus ?? record.research_status, confidence: record.confidence, qualificationScore: record.qualificationScore ?? record.qualification_score ?? 0, approvalStatus: record.approvalStatus ?? record.approval_status };
}

function Metric({ icon: Icon, label, value, detail, tone = "amber" }: { icon: typeof Activity; label: string; value: string; detail: string; tone?: "amber" | "sage" | "ink" }) {
  return <div className="metric-card"><div className={cn("metric-icon", tone === "sage" && "sage", tone === "ink" && "ink")}><Icon size={17} /></div><div><p className="eyebrow">{label}</p><p className="metric-value">{value}</p><p className="metric-detail">{detail}</p></div></div>;
}

function statusLabel(record: CreatorView) {
  if (record.researchStatus === "audit_complete") return "Audit complete";
  if (record.researchStatus === "deep_research") return "Deep research";
  if (record.researchStatus === "profile_verified") return "Profile verified";
  return "Profile unverified";
}

type ViewKey = "overview" | "creators" | "approvals" | "outreach" | "products" | "revenue" | "reports";

type WorkspaceViewProps = {
  view: Exclude<ViewKey, "overview">;
  records: CreatorView[];
  counts: Record<string, number>;
  liveLabel: string;
  onOpenCreator: (creatorId: string) => void;
};

function WorkspaceView({ view, records, counts, liveLabel, onOpenCreator }: WorkspaceViewProps) {
  const qualified = records.filter(record => ["qualified", "outreach", "replied", "partnership", "product", "launch", "live"].includes(record.stage));
  const needsApproval = records.filter(record => record.approvalStatus === "needs_review");
  const title = { creators: "Creators", approvals: "Approvals", outreach: "Outreach", products: "Products", revenue: "Whop revenue", reports: "Reports" }[view];
  const description = {
    creators: "Every creator record, stage, and next action in one workspace.",
    approvals: "Human decisions before any external message or partnership action.",
    outreach: "Channel-ready drafts, send history, and follow-up control.",
    products: "Creator-specific product hypotheses and build stages.",
    revenue: "Whop attribution and revenue-share visibility by creator and product.",
    reports: "A concise operating view of pipeline health and blockers.",
  }[view];
  return <div className="content-wrap">
    <div className="section-heading view-heading"><div><p className="eyebrow amber-text">ShadowOS workspace</p><h2>{title}</h2><p className="section-desc">{description}</p></div><div className="heading-actions"><Badge className="view-source"><Wifi size={12}/> {liveLabel}</Badge><Button className="primary-button" onClick={() => records[0] && onOpenCreator(records[0].creatorId)}><Sparkles size={15}/> {view === "outreach" ? "Open creator workspace" : view === "products" ? "Open product workspace" : "Open queue"}</Button></div></div>
    {view === "creators" && <><div className="metrics-grid compact-metrics"><Metric icon={UserRound} label="All creators" value={String(records.length)} detail="in the live workspace"/><Metric icon={CircleDashed} label="Discovery" value={String(counts.discovery ?? 0)} detail="not yet screened" tone="sage"/><Metric icon={Target} label="Qualified" value={String(qualified.length)} detail="ready for a decision"/></div><Card className="workspace-panel"><CardHeader><CardTitle>Creator directory</CardTitle><p className="table-subtitle">Select a record to return to its evidence workspace.</p></CardHeader><CardContent className="directory-grid">{records.map(record => <button className="directory-card" key={record.creatorId} onClick={() => onOpenCreator(record.creatorId)}><div className="directory-avatar">{record.name.split(" ").map(x => x[0]).join("").slice(0,2)}</div><div><strong>{record.name}</strong><span>@{record.handle}</span><small>{record.creatorId} · {record.subNiche ?? "Niche not set"}</small></div><ArrowUpRight size={15}/></button>)}</CardContent></Card></>}
    {view === "approvals" && <Card className="workspace-panel"><CardHeader><CardTitle>Approval queue <span className="count-pill">{needsApproval.length}</span></CardTitle><p className="table-subtitle">Nothing is sent or published without an explicit approval state.</p></CardHeader><CardContent>{needsApproval.length ? needsApproval.map(record => <div className="queue-row" key={record.creatorId}><div><strong>{record.name}</strong><span>{record.creatorId} · qualification review</span></div><Badge variant="outline">Needs review</Badge></div>) : <div className="empty-state"><div className="empty-icon"><ShieldCheck size={22}/></div><h3>Approval queue is clear</h3><p>Screen a creator first. Qualified records will appear here before outreach or publishing.</p><Button variant="outline" onClick={() => records[0] && onOpenCreator(records[0].creatorId)}>Go to creator queue</Button></div>}</CardContent></Card>}
    {view === "outreach" && <><div className="metrics-grid compact-metrics"><Metric icon={Send} label="Drafts" value="0" detail="nothing ready to send"/><Metric icon={Instagram} label="Instagram" value="Manual" detail="DM capture required" tone="sage"/><Metric icon={Mail} label="Email" value="0" detail="no approved messages"/></div><Card className="workspace-panel"><CardHeader><CardTitle>Outreach control</CardTitle><p className="table-subtitle">Every message stays in draft until reviewed and approved.</p></CardHeader><CardContent><div className="channel-board"><div className="channel-board-row"><div className="channel-symbol instagram"><Instagram size={19}/></div><div><strong>Instagram outreach</strong><span>Manual send · reply capture · follow-up stage</span></div><Badge variant="outline">Not started</Badge></div><div className="channel-board-row"><div className="channel-symbol email"><Mail size={19}/></div><div><strong>Email outreach</strong><span>Drafting · approval · sent history · replies</span></div><Badge variant="outline">Not started</Badge></div></div><div className="empty-state small-empty"><div className="empty-icon"><Send size={20}/></div><h3>No approved outreach yet</h3><p>Research and qualify a creator before creating the first personalized message.</p></div></CardContent></Card></>}
    {view === "products" && <Card className="workspace-panel"><CardHeader><CardTitle>Product workshop</CardTitle><p className="table-subtitle">Product ideas remain isolated to the creator they belong to.</p></CardHeader><CardContent><div className="product-grid">{["Audience problem","Offer hypothesis","Delivery format","Launch readiness"].map((label, index) => <div className="product-slot" key={label}><span className="slot-index">0{index + 1}</span><p>{label}</p><strong>{index === 0 ? "Awaiting research" : "Not started"}</strong><small>Creator-specific workspace field</small></div>)}</div><div className="empty-state small-empty"><div className="empty-icon"><Package size={20}/></div><h3>No product hypotheses yet</h3><p>Once a creator passes qualification, this workspace will hold the four evidence-led product directions.</p></div></CardContent></Card>}
    {view === "revenue" && <><div className="metrics-grid compact-metrics"><Metric icon={Wallet} label="Tracked revenue" value="$0" detail="no live products yet" tone="sage"/><Metric icon={Package} label="Whop products" value="0" detail="attributed products"/><Metric icon={BarChart3} label="Creators live" value={String(records.filter(record => record.stage === "live").length)} detail="earning creators" tone="ink"/></div><Card className="workspace-panel"><CardHeader><CardTitle>Revenue ledger</CardTitle><p className="table-subtitle">The ledger will attribute Whop payments to creator, product, and revenue-share agreement.</p></CardHeader><CardContent><div className="empty-state"><div className="empty-icon"><Wallet size={22}/></div><h3>Whop attribution is ready for products</h3><p>No payment records are available yet. This view will remain read-only until a product is live.</p><span className="status-note">Attribution model will appear after the first live product.</span></div></CardContent></Card></>}
    {view === "reports" && <><div className="metrics-grid compact-metrics"><Metric icon={UserRound} label="Pipeline size" value={String(records.length)} detail="creator records"/><Metric icon={CircleDashed} label="Screened" value={String(records.filter(record => record.researchStatus !== "unverified").length)} detail="evidence captured" tone="sage"/><Metric icon={Clock3} label="Blockers" value={String(records.filter(record => record.researchStatus === "unverified").length)} detail="awaiting research"/><Metric icon={Database} label="Data source" value={liveLabel === "Supabase live" ? "Live" : "Fallback"} detail={liveLabel} tone="ink"/></div><Card className="workspace-panel"><CardHeader><CardTitle>Operating report</CardTitle><p className="table-subtitle">A current snapshot, intentionally separated from creator-specific evidence.</p></CardHeader><CardContent><div className="report-row"><span>Discovery queue</span><strong>{counts.discovery ?? 0} creators</strong><Badge variant="outline">Research next</Badge></div><div className="report-row"><span>Qualification decisions</span><strong>{qualified.length} creators</strong><Badge variant="outline">No approvals pending</Badge></div><div className="report-row"><span>Outreach activity</span><strong>0 messages</strong><Badge variant="outline">Protected</Badge></div><div className="report-row"><span>Revenue attribution</span><strong>0 products</strong><Badge variant="outline">Ready when live</Badge></div></CardContent></Card></>}
  </div>;
}

export default function Home() {
  const creatorsQuery = trpc.dashboard.creators.useQuery(undefined, { retry: 1, staleTime: 30_000 });
  const sourceQuery = trpc.dashboard.source.useQuery(undefined, { retry: 1, staleTime: 30_000 });
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("SO-0001");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewKey>("overview");
  const navigate = (view: ViewKey) => { setActiveView(view); setSidebarOpen(false); };
  const records = useMemo(() => creatorsQuery.data ? creatorsQuery.data.map(normalizeCreator) : [], [creatorsQuery.data]);
  const selected = records.find(c => c.creatorId === selectedId) ?? records[0];

  useEffect(() => { if (records.length && !records.some(c => c.creatorId === selectedId)) setSelectedId(records[0].creatorId); }, [records, selectedId]);

  const counts = useMemo(() => records.reduce<Record<string, number>>((acc, record) => { acc[record.stage] = (acc[record.stage] ?? 0) + 1; return acc; }, {}), [records]);
  const visible = useMemo(() => records.filter(c => { const matchesQuery = `${c.name} ${c.handle} ${c.creatorId}`.toLowerCase().includes(query.toLowerCase()); return matchesQuery && (activeFilter === "all" || c.stage === activeFilter); }), [records, query, activeFilter]);
  const verifiedCount = records.filter(c => c.researchStatus !== "unverified").length;
  const approvalCount = records.filter(c => c.approvalStatus === "needs_review").length;
  const liveLabel = sourceQuery.data?.label ?? (creatorsQuery.isLoading ? "Connecting" : "Local fallback");
  const meta = selected ? (stageMeta[selected.stage] ?? { label: selected.stage, tone: "bg-[#edeae6] text-[#756e66]" }) : stageMeta.discovery;

  return <div className="app-shell">
    <aside className={cn("sidebar", sidebarOpen && "open")}>
      <div className="brand-lockup"><div className="brand-mark">SO</div><div><div className="brand-name">ShadowOS</div><div className="brand-sub">Operating desk</div></div><button className="mobile-close" onClick={() => setSidebarOpen(false)}><X size={16}/></button></div>
      <div className="workspace-chip"><span className="online-dot"/> Control tower <span className="live-label">LIVE</span></div>
      <nav className="side-nav"><div className="nav-label">Workspace</div><button className={cn("nav-item", activeView === "overview" && "active")} onClick={() => navigate("overview")}><Activity size={17}/> Overview <span className="nav-count">{records.length}</span></button><button className={cn("nav-item", activeView === "creators" && "active")} onClick={() => navigate("creators")}><UserRound size={17}/> Creators <span className="nav-count">{records.length}</span></button><button className={cn("nav-item", activeView === "approvals" && "active")} onClick={() => navigate("approvals")}><Target size={17}/> Approvals <span className="nav-count amber">{approvalCount}</span></button><button className={cn("nav-item", activeView === "outreach" && "active")} onClick={() => navigate("outreach")}><Mail size={17}/> Outreach <span className="nav-count">0</span></button><div className="nav-label spaced">Operations</div><button className={cn("nav-item", activeView === "products" && "active")} onClick={() => navigate("products")}><Sparkles size={17}/> Products</button><button className={cn("nav-item", activeView === "revenue" && "active")} onClick={() => navigate("revenue")}><Wallet size={17}/> Whop revenue</button><button className={cn("nav-item", activeView === "reports" && "active")} onClick={() => navigate("reports")}><FileText size={17}/> Reports</button></nav>
      <div className="side-footer"><div className="connector-row"><span className="connector-status connected"/><span>Supabase</span><small>{liveLabel === "Supabase live" ? "live" : "ready"}</small></div><div className="connector-row"><span className="connector-status connected"/><span>Whop</span><small>connected</small></div><div className="connector-row"><span className="connector-status connected"/><span>Instagram</span><small>ready</small></div><div className="user-chip"><div className="avatar">RM</div><div><strong>Robert</strong><span>Owner</span></div><MoreHorizontal size={16} className="muted-icon"/></div></div>
    </aside>

    <main className="main-canvas">
      <header className="topbar"><button className="mobile-menu" onClick={() => setSidebarOpen(true)}><Menu size={20}/></button><div><p className="eyebrow">Wednesday · 04 Nov 2026</p><h1>{{"overview":"Control tower","creators":"Creators","approvals":"Approvals","outreach":"Outreach","products":"Products","revenue":"Whop revenue","reports":"Reports"}[activeView]}</h1></div><div className="top-actions"><div className="search-top"><Search size={16}/><input aria-label="Search creators" placeholder="Search creators, IDs, handles..." value={query} onChange={e => setQuery(e.target.value)}/><kbd>⌘ K</kbd></div><button className="icon-button" aria-label="Notifications"><Bell size={18}/><span className="notification-dot"/></button><Button className="primary-button" onClick={() => navigate("creators")}><Sparkles size={15}/> Open creators</Button></div></header>

      {activeView === "overview" ? <div className="content-wrap">
        <section className="signal-banner"><div className="signal-icon"><ShieldCheck size={21}/></div><div><p className="eyebrow amber-text">Evidence before outreach</p><p className="signal-copy">{records.length} priority creators are in the workspace. Records stay <strong>discovery-stage</strong> until independently verified.</p></div><div className="source-pill"><Wifi size={12}/> {liveLabel}</div><Button variant="outline" size="sm" className="banner-action" onClick={() => navigate("creators")}>Open research queue <ArrowUpRight size={14}/></Button></section>

        <section className="metrics-grid"><Metric icon={UserRound} label="Priority queue" value={String(records.length)} detail="gardening creators"/><Metric icon={CircleDashed} label="Verified" value={String(verifiedCount)} detail="research complete" tone="sage"/><Metric icon={Clock3} label="Awaiting approval" value={String(approvalCount)} detail="human review needed"/><Metric icon={Database} label="System health" value={liveLabel === "Supabase live" ? "Live" : "Ready"} detail="source status" tone="ink"/></section>

        <div className="section-heading"><div><p className="eyebrow amber-text">Priority queue · gardening</p><h2>Creator pipeline</h2><p className="section-desc">Review the shortlist, then move each creator through evidence-led screening.</p></div><div className="heading-actions"><Button variant="outline" size="sm" className="filter-button" onClick={() => setActiveFilter(activeFilter === "all" ? "discovery" : "all")}><Filter size={14}/> Filters <span className="filter-count">1</span></Button><Button size="sm" className="primary-button" onClick={() => navigate("creators")}><Sprout size={14}/> Start screening</Button></div></div>

        <div className="pipeline-strip"><button className={cn("pipeline-cell", activeFilter === "all" && "selected")} onClick={() => setActiveFilter("all")}><span className="pipeline-dot neutral"/>All creators <strong>{records.length}</strong></button><button className={cn("pipeline-cell", activeFilter === "discovery" && "selected")} onClick={() => setActiveFilter("discovery")}><span className="pipeline-dot discovery"/>Discovery <strong>{counts.discovery ?? 0}</strong></button><button className={cn("pipeline-cell", activeFilter === "screening" && "selected")} onClick={() => setActiveFilter("screening")}><span className="pipeline-dot screening"/>Screening <strong>{counts.screening ?? 0}</strong></button><button className={cn("pipeline-cell", activeFilter === "qualified" && "selected")} onClick={() => setActiveFilter("qualified")}><span className="pipeline-dot qualified"/>Qualified <strong>{counts.qualified ?? 0}</strong></button><button className={cn("pipeline-cell", activeFilter === "outreach" && "selected")} onClick={() => setActiveFilter("outreach")}><span className="pipeline-dot outreach"/>Outreach <strong>{counts.outreach ?? 0}</strong></button></div>

        <div className="workspace-grid"><Card className="creator-table-card"><CardHeader className="table-header"><div><CardTitle>Priority creators <span className="count-pill">{visible.length}</span></CardTitle><p className="table-subtitle">{liveLabel} · source updates remain visible here</p></div><div className="table-tools"><div className="inline-search"><Search size={15}/><input aria-label="Filter creator list" placeholder="Filter list" value={query} onChange={e => setQuery(e.target.value)}/></div><button className="icon-button small" aria-label="More list actions"><MoreHorizontal size={17}/></button></div></CardHeader><CardContent className="table-content"><div className="table-head"><span>Creator</span><span>Niche</span><span>Status</span><span>Score</span><span/></div><ScrollArea className="creator-scroll">{visible.map(c => { const rowMeta = stageMeta[c.stage] ?? { label: c.stage, tone: "bg-[#edeae6] text-[#756e66]" }; return <button key={c.creatorId} className={cn("creator-row", selected?.creatorId === c.creatorId && "selected")} onClick={() => setSelectedId(c.creatorId)}><div className="creator-primary"><div className="creator-avatar">{c.name.split(" ").map(x => x[0]).join("").slice(0,2)}</div><div><strong>{c.name}</strong><span className="handle">@{c.handle}</span></div></div><div className="niche-cell"><span>{c.subNiche ?? "Niche not set"}</span><small>{c.creatorId}</small></div><div><Badge className={rowMeta.tone}>{rowMeta.label}</Badge><small className="status-label">{statusLabel(c)}</small></div><div className="score-cell">{c.qualificationScore || "—"}</div><ArrowUpRight size={15} className="row-arrow"/></button>})}</ScrollArea></CardContent></Card>

          {selected && <Card className="detail-card"><CardHeader className="detail-head"><div className="detail-id"><span className="eyebrow">Creator workspace</span><span className="mono-id">{selected.creatorId}</span></div><button className="icon-button small" aria-label="More creator actions"><MoreHorizontal size={17}/></button></CardHeader><CardContent className="detail-content"><div className="profile-hero"><div className="profile-avatar">{selected.name.split(" ").map(x => x[0]).join("").slice(0,2)}</div><div><h3>{selected.name}</h3><a href={selected.profileUrl} target="_blank" rel="noreferrer">@{selected.handle} <ArrowUpRight size={13}/></a></div></div><div className="detail-tags"><Badge className="bg-[#e8f0eb] text-[#3c6549]">{selected.industry}</Badge><Badge className={meta.tone}>{meta.label}</Badge><Badge variant="outline">{statusLabel(selected)}</Badge></div><div className="detail-rule"/><div className="detail-section"><div className="detail-section-title"><ShieldCheck size={15}/> Evidence status</div><p>{selected.researchStatus === "unverified" ? "No public evidence has been captured yet. This record is intentionally unverified." : "Evidence has been captured for this creator and is ready for review."}</p><Button variant="outline" size="sm" className="full-button" onClick={() => navigate("creators")}><Search size={14}/> Open research brief</Button></div><div className="detail-section"><div className="detail-section-title"><Target size={15}/> Next action</div><div className="next-action"><div className="action-icon"><Sprout size={16}/></div><div><strong>{selected.researchStatus === "unverified" ? "Begin profile screening" : "Review qualification"}</strong><span>{selected.researchStatus === "unverified" ? "Verify account, niche, activity, and initial audience signals." : "Review the evidence and decide whether this creator can move forward."}</span></div></div></div><div className="detail-section"><div className="detail-section-title"><FileText size={15}/> Workspace folders</div><div className="folder-row"><span>01 · Creator intelligence</span><span>—</span></div><div className="folder-row"><span>02 · Audience evidence</span><span>—</span></div><div className="folder-row"><span>03 · Product strategy</span><span>—</span></div><div className="folder-row"><span>04 · Outreach</span><span>—</span></div></div><div className="detail-section muted-panel"><div className="detail-section-title"><Instagram size={15}/> Channel readiness</div><div className="channel-row"><span><Instagram size={14}/> Instagram</span><Badge variant="outline">Manual DM capture</Badge></div><div className="channel-row"><span><Mail size={14}/> Email</span><Badge variant="outline">Not drafted</Badge></div></div></CardContent><div className="detail-footer"><Button className="primary-button full-button"><Sprout size={15}/> Start screening</Button></div></Card>}
        </div>
      </div> : <WorkspaceView view={activeView as Exclude<ViewKey, "overview">} records={records} counts={counts} liveLabel={liveLabel} onOpenCreator={(creatorId) => { setSelectedId(creatorId); setActiveView("overview"); }} />}
    </main>
  </div>;
}
