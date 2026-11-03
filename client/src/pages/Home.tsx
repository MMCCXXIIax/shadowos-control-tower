import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Activity, ArrowUpRight, Bell, CheckCircle2, CircleDashed, Clock3, Database, FileText, Filter, Instagram, Mail, Menu, MoreHorizontal, Search, ShieldCheck, Sparkles, Sprout, Target, UserRound, Wallet, X } from "lucide-react";

const priorityCreators = [
  ["Ornagarden Kick", "onagardenkick"], ["Quarter Acre Roots", "quarteracreroots"], ["Michelle", "everydaygardeningtips"], ["Tyler & Brian", "gardenerinlove"], ["Alison", "cookseyfarms"], ["Inna", "gardens_better_with_cats"], ["Timothy Hammond", "bigcitygardener"], ["Milan Turner", "atlgrow"], ["Meenakshi", "meditativegardening"], ["Helier", "garden_goddess_uk"], ["Jo Thompson", "jothompsongarden"], ["Katie Townsend", "katietownsendgardendesign"], ["Joanna Archer Garden Design", "joannaarchergardendesign"], ["Kamili Bell Hill", "plantblerd"], ["Kaylee Ellen", "kayleeellenofficial"], ["Ashley Anita", "lifewithashleyanita"], ["Amy", "thehobbyhomestead"], ["Gardening Indoors", "_gardeningindoors"], ["Gardenerd", "gardenerd1"], ["Cloud Gardener", "cloudgardeneruk"], ["Kath Irvine", "edible.backyard"], ["Carly", "thegardenspot"], ["Tony", "tonygrowsfood"], ["Beth", "filipinafarmstead"], ["Dominika", "17m2garden"], ["Divya Kanwar", "indiangreendreams"], ["Kia Jade", "kia_urbangardener"], ["Peter Vouthas", "urbancitygardener"], ["Jill Mc Sheehy", "thebeginnersgarden"], ["Adam Long", "itsanadamadventure"], ["Front Porch", "frontporchfarmer"],
].map(([name, handle], index) => ({
  id: `SO-${String(index + 1).padStart(4, "0")}`,
  name,
  handle,
  profileUrl: `https://www.instagram.com/${handle}/`,
  stage: "discovery",
  status: "unverified",
  confidence: "unknown",
  industry: "Gardening",
  subNiche: index % 3 === 0 ? "Urban food growing" : index % 3 === 1 ? "Homesteading & edible gardens" : "Garden design & education",
  score: 0,
}));

const stageMeta: Record<string, { label: string; tone: string }> = {
  discovery: { label: "Discovery", tone: "bg-[#f2ede5] text-[#66594c]" },
  screening: { label: "Screening", tone: "bg-[#e8f0eb] text-[#3c6549]" },
  qualified: { label: "Qualified", tone: "bg-[#dcece4] text-[#2f6545]" },
  outreach: { label: "Outreach", tone: "bg-[#fff0dc] text-[#8a5b25]" },
};

function Metric({ icon: Icon, label, value, detail, tone = "amber" }: { icon: typeof Activity; label: string; value: string; detail: string; tone?: "amber" | "sage" | "ink" }) {
  return <div className="metric-card"><div className={cn("metric-icon", tone === "sage" && "sage", tone === "ink" && "ink")}><Icon size={17} /></div><div><p className="eyebrow">{label}</p><p className="metric-value">{value}</p><p className="metric-detail">{detail}</p></div></div>;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(priorityCreators[0].id);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const selected = priorityCreators.find(c => c.id === selectedId) ?? priorityCreators[0];
  const visible = useMemo(() => priorityCreators.filter(c => {
    const matchesQuery = `${c.name} ${c.handle} ${c.id}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = activeFilter === "all" || c.stage === activeFilter;
    return matchesQuery && matchesFilter;
  }), [query, activeFilter]);

  return <div className="app-shell">
    <aside className={cn("sidebar", sidebarOpen && "open")}>
      <div className="brand-lockup"><div className="brand-mark">SO</div><div><div className="brand-name">ShadowOS</div><div className="brand-sub">Operating desk</div></div><button className="mobile-close" onClick={() => setSidebarOpen(false)}><X size={16}/></button></div>
      <div className="workspace-chip"><span className="online-dot"/> Control tower <span className="live-label">LIVE</span></div>
      <nav className="side-nav"><div className="nav-label">Workspace</div><button className="nav-item active"><Activity size={17}/> Overview <span className="nav-count">31</span></button><button className="nav-item"><UserRound size={17}/> Creators <span className="nav-count">31</span></button><button className="nav-item"><Target size={17}/> Approvals <span className="nav-count amber">0</span></button><button className="nav-item"><Mail size={17}/> Outreach <span className="nav-count">0</span></button><div className="nav-label spaced">Operations</div><button className="nav-item"><Sparkles size={17}/> Products</button><button className="nav-item"><Wallet size={17}/> Whop revenue</button><button className="nav-item"><FileText size={17}/> Reports</button></nav>
      <div className="side-footer"><div className="connector-row"><span className="connector-status connected"/><span>Supabase</span><small>connected</small></div><div className="connector-row"><span className="connector-status connected"/><span>Whop</span><small>connected</small></div><div className="connector-row"><span className="connector-status connected"/><span>Instagram</span><small>ready</small></div><div className="user-chip"><div className="avatar">RM</div><div><strong>Robert</strong><span>Owner</span></div><MoreHorizontal size={16} className="muted-icon"/></div></div>
    </aside>

    <main className="main-canvas">
      <header className="topbar"><button className="mobile-menu" onClick={() => setSidebarOpen(true)}><Menu size={20}/></button><div><p className="eyebrow">Wednesday · 03 Nov 2026</p><h1>Control tower</h1></div><div className="top-actions"><div className="search-top"><Search size={16}/><input placeholder="Search creators, IDs, handles..." value={query} onChange={e => setQuery(e.target.value)}/><kbd>⌘ K</kbd></div><button className="icon-button"><Bell size={18}/><span className="notification-dot"/></button><Button className="primary-button"><Sparkles size={15}/> New creator</Button></div></header>

      <div className="content-wrap">
        <section className="signal-banner"><div className="signal-icon"><ShieldCheck size={21}/></div><div><p className="eyebrow amber-text">Evidence before outreach</p><p className="signal-copy">31 priority creators imported from your shortlist. All are <strong>discovery-stage</strong> until independently verified.</p></div><Button variant="outline" size="sm" className="banner-action">Open research queue <ArrowUpRight size={14}/></Button></section>

        <section className="metrics-grid"><Metric icon={UserRound} label="Priority queue" value="31" detail="gardening creators"/><Metric icon={CircleDashed} label="Verified" value="0" detail="research not started" tone="sage"/><Metric icon={Clock3} label="Awaiting approval" value="0" detail="nothing to send"/><Metric icon={Database} label="System health" value="Ready" detail="6 connectors online" tone="ink"/></section>

        <div className="section-heading"><div><p className="eyebrow amber-text">Priority queue · gardening</p><h2>Creator pipeline</h2><p className="section-desc">Review the shortlist, then move each creator through evidence-led screening.</p></div><div className="heading-actions"><Button variant="outline" size="sm" className="filter-button"><Filter size={14}/> Filters <span className="filter-count">1</span></Button><Button size="sm" className="primary-button"><Sprout size={14}/> Start screening</Button></div></div>

        <div className="pipeline-strip"><button className={cn("pipeline-cell", activeFilter === "all" && "selected")} onClick={() => setActiveFilter("all")}><span className="pipeline-dot neutral"/>All creators <strong>31</strong></button><button className={cn("pipeline-cell", activeFilter === "discovery" && "selected")} onClick={() => setActiveFilter("discovery")}><span className="pipeline-dot discovery"/>Discovery <strong>31</strong></button><button className={cn("pipeline-cell", activeFilter === "screening" && "selected")} onClick={() => setActiveFilter("screening")}><span className="pipeline-dot screening"/>Screening <strong>0</strong></button><button className={cn("pipeline-cell", activeFilter === "qualified" && "selected")} onClick={() => setActiveFilter("qualified")}><span className="pipeline-dot qualified"/>Qualified <strong>0</strong></button><button className={cn("pipeline-cell", activeFilter === "outreach" && "selected")} onClick={() => setActiveFilter("outreach")}><span className="pipeline-dot outreach"/>Outreach <strong>0</strong></button></div>

        <div className="workspace-grid"><Card className="creator-table-card"><CardHeader className="table-header"><div><CardTitle>Priority creators <span className="count-pill">{visible.length}</span></CardTitle><p className="table-subtitle">Imported from Roberscreators.pdf · research date not set</p></div><div className="table-tools"><div className="inline-search"><Search size={15}/><input placeholder="Filter list" value={query} onChange={e => setQuery(e.target.value)}/></div><button className="icon-button small"><MoreHorizontal size={17}/></button></div></CardHeader><CardContent className="table-content"><div className="table-head"><span>Creator</span><span>Niche</span><span>Status</span><span>Score</span><span/></div><ScrollArea className="creator-scroll">{visible.map(c => <button key={c.id} className={cn("creator-row", selectedId === c.id && "selected")} onClick={() => setSelectedId(c.id)}><div className="creator-primary"><div className="creator-avatar">{c.name.split(" ").map(x => x[0]).join("").slice(0,2)}</div><div><strong>{c.name}</strong><span className="handle">@{c.handle}</span></div></div><div className="niche-cell"><span>{c.subNiche}</span><small>{c.id}</small></div><div><Badge className={stageMeta[c.stage].tone}>{stageMeta[c.stage].label}</Badge><small className="status-label">Profile unverified</small></div><div className="score-cell">—</div><ArrowUpRight size={15} className="row-arrow"/></button>)}</ScrollArea></CardContent></Card>

          <Card className="detail-card"><CardHeader className="detail-head"><div className="detail-id"><span className="eyebrow">Creator workspace</span><span className="mono-id">{selected.id}</span></div><button className="icon-button small"><MoreHorizontal size={17}/></button></CardHeader><CardContent className="detail-content"><div className="profile-hero"><div className="profile-avatar">{selected.name.split(" ").map(x => x[0]).join("").slice(0,2)}</div><div><h3>{selected.name}</h3><a href={selected.profileUrl} target="_blank" rel="noreferrer">@{selected.handle} <ArrowUpRight size={13}/></a></div></div><div className="detail-tags"><Badge className="bg-[#e8f0eb] text-[#3c6549]">Gardening</Badge><Badge variant="outline">Discovery</Badge><Badge variant="outline">Unverified</Badge></div><div className="detail-rule"/><div className="detail-section"><div className="detail-section-title"><ShieldCheck size={15}/> Evidence status</div><p>No public evidence has been captured yet. This record is intentionally unverified.</p><Button variant="outline" size="sm" className="full-button"><Search size={14}/> Open research brief</Button></div><div className="detail-section"><div className="detail-section-title"><Target size={15}/> Next action</div><div className="next-action"><div className="action-icon"><Sprout size={16}/></div><div><strong>Begin profile screening</strong><span>Verify account, niche, activity, and initial audience signals.</span></div></div></div><div className="detail-section"><div className="detail-section-title"><FileText size={15}/> Workspace folders</div><div className="folder-row"><span>01 · Creator intelligence</span><span>—</span></div><div className="folder-row"><span>02 · Audience evidence</span><span>—</span></div><div className="folder-row"><span>03 · Product strategy</span><span>—</span></div><div className="folder-row"><span>04 · Outreach</span><span>—</span></div></div><div className="detail-section muted-panel"><div className="detail-section-title"><Instagram size={15}/> Channel readiness</div><div className="channel-row"><span><Instagram size={14}/> Instagram</span><Badge variant="outline">Manual DM capture</Badge></div><div className="channel-row"><span><Mail size={14}/> Email</span><Badge variant="outline">Not drafted</Badge></div></div></CardContent><div className="detail-footer"><Button className="primary-button full-button"><Sprout size={15}/> Start screening</Button></div></Card>
        </div>
      </div>
    </main>
  </div>;
}
