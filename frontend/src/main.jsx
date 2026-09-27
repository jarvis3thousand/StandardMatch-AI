import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  LayoutDashboard, FileText, Sparkles, ShieldCheck, Search, Upload,
  CheckCircle2, Clock3, AlertTriangle, ChevronRight, Download,
  MoreHorizontal, Bell, Settings, Database, ArrowUpRight, X
} from 'lucide-react';
import './styles.css';

const recommendations = [
  {
    code: 'IS 3025 (Part 1)',
    title: 'Methods of Sampling and Test (Physical and Chemical) for Water and Wastewater',
    confidence: 94,
    status: 'Current',
    domain: 'Water testing',
    reason: 'Matches the tender requirement for sampling and laboratory testing of water quality.',
    evidence: 'Requirement 03 • Water sample testing and reporting',
    clause: 'Evidence mapped to the extracted testing requirement.',
    verified: true
  },
  {
    code: 'IS 10500:2012',
    title: 'Drinking Water — Specification',
    confidence: 91,
    status: 'Current',
    domain: 'Drinking water',
    reason: 'Relevant where the tender specifies potable/drinking water quality parameters.',
    evidence: 'Requirement 02 • Potable water quality parameters',
    clause: 'Evidence mapped to the potable-water specification requirement.',
    verified: false
  },
  {
    code: 'IS 1622:2001',
    title: 'Methods of Sampling and Microbiological Examination of Water',
    confidence: 87,
    status: 'Current',
    domain: 'Microbiology',
    reason: 'Potentially applicable to microbiological sampling and examination.',
    evidence: 'Requirement 04 • Microbiological examination',
    clause: 'Alternative evidence path for microbiological testing.',
    verified: false
  }
];

const requirements = [
  ['REQ-01', 'Water quality testing', 'Technical', 'High'],
  ['REQ-02', 'Potable water parameters', 'Specification', 'High'],
  ['REQ-03', 'Sampling and laboratory test method', 'Testing', 'High'],
  ['REQ-04', 'Microbiological examination', 'Testing', 'Medium']
];

function App() {
  const [page, setPage] = useState('dashboard');
  const [selected, setSelected] = useState(null);
  const [verified, setVerified] = useState({});
  const [uploaded, setUploaded] = useState(false);
  const [query, setQuery] = useState('');
  const [showDemo, setShowDemo] = useState(false);

  const filtered = useMemo(() => recommendations.filter(r =>
    `${r.code} ${r.title} ${r.domain}`.toLowerCase().includes(query.toLowerCase())
  ), [query]);

  const verify = (code) => setVerified(v => ({...v, [code]: true}));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Sparkles size={20}/></div>
          <div><b>StandardMatch</b><span>AI Recommendation Engine</span></div>
        </div>

        <div className="nav-label">WORKSPACE</div>
        <Nav icon={<LayoutDashboard size={18}/>} label="Dashboard" active={page==='dashboard'} onClick={()=>setPage('dashboard')}/>
        <Nav icon={<FileText size={18}/>} label="Tender Analysis" active={page==='analysis'} onClick={()=>setPage('analysis')}/>
        <Nav icon={<Database size={18}/>} label="Standards Library" active={page==='library'} onClick={()=>setPage('library')}/>
        <Nav icon={<ShieldCheck size={18}/>} label="Verification Queue" active={page==='verify'} onClick={()=>setPage('verify')}/>

        <div className="sidebar-bottom">
          <Nav icon={<Settings size={18}/>} label="Settings" />
          <div className="user-card">
            <div className="avatar">TO</div>
            <div><b>Technical Officer</b><span>Procurement Cell</span></div>
            <MoreHorizontal size={16}/>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="crumb">Workspace <ChevronRight size={14}/> {page === 'dashboard' ? 'Dashboard' : page === 'analysis' ? 'Tender Analysis' : page === 'verify' ? 'Verification Queue' : 'Standards Library'}</div>
          <div className="top-actions"><button className="icon-btn"><Bell size={18}/><i/></button><div className="top-avatar">TO</div></div>
        </header>

        {page === 'dashboard' && (
          <Dashboard onOpen={()=>setPage('analysis')} onDemo={()=>setShowDemo(true)} />
        )}

        {page === 'analysis' && (
          <Analysis
            uploaded={uploaded}
            setUploaded={setUploaded}
            selected={selected}
            setSelected={setSelected}
            filtered={filtered}
            query={query}
            setQuery={setQuery}
            verified={verified}
            verify={verify}
          />
        )}

        {page === 'verify' && (
          <Verification verified={verified} verify={verify} setPage={setPage}/>
        )}

        {page === 'library' && <Library/>}
      </main>

      {showDemo && (
        <div className="modal-backdrop" onClick={()=>setShowDemo(false)}>
          <div className="modal demo-modal" onClick={e=>e.stopPropagation()}>
            <button className="close" onClick={()=>setShowDemo(false)}><X size={18}/></button>
            <div className="eyebrow">30-SECOND JUDGE WALKTHROUGH</div><h2>How the demo works</h2>
            <div className="demo-flow"><div><b>1</b><strong>Upload</strong><span>Tender PDF</span></div><ChevronRight/><div><b>2</b><strong>Extract</strong><span>Requirements</span></div><ChevronRight/><div><b>3</b><strong>Match</strong><span>IS Codes + evidence</span></div><ChevronRight/><div><b>4</b><strong>Verify</strong><span>Officer approval</span></div></div>
            <div className="evidence-box"><div className="evidence-head"><ShieldCheck size={18}/> Why this matters</div><p>The system does not silently decide the standard. It shows the requirement, recommended code, confidence, and evidence so the officer can verify the result.</p></div>
            <div className="modal-footer"><button className="secondary" onClick={()=>setShowDemo(false)}>Close</button><button className="primary" onClick={()=>{setShowDemo(false);setPage('analysis')}}>Start live demo <ArrowUpRight size={16}/></button></div>
          </div>
        </div>
      )}

      {selected && (
        <div className="modal-backdrop" onClick={()=>setSelected(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <button className="close" onClick={()=>setSelected(null)}><X size={18}/></button>
            <div className="eyebrow">EVIDENCE VIEW</div>
            <h2>{selected.code}</h2>
            <p className="modal-title">{selected.title}</p>
            <div className="evidence-box">
              <div className="evidence-head"><ShieldCheck size={18}/> Recommendation evidence</div>
              <p>{selected.reason}</p>
              <div className="evidence-line"><span>Mapped source</span><b>{selected.evidence}</b></div>
              <div className="evidence-line"><span>Clause mapping</span><b>{selected.clause}</b></div>
            </div>
            <div className="modal-grid">
              <div><small>Confidence</small><strong>{selected.confidence}%</strong></div>
              <div><small>Status</small><strong className="green">{selected.status}</strong></div>
              <div><small>Domain</small><strong>{selected.domain}</strong></div>
            </div>
            <div className="modal-footer">
              <button className="secondary" onClick={()=>setSelected(null)}>Close</button>
              <button className="primary" onClick={()=>{verify(selected.code);setSelected(null)}}><CheckCircle2 size={16}/> Verify recommendation</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Nav({icon,label,active,onClick}) {
  return <button className={`nav-item ${active?'active':''}`} onClick={onClick}>{icon}<span>{label}</span>{active && <ArrowUpRight size={14}/>}</button>
}

function Dashboard({onOpen,onDemo}) {
  return <section className="content">
    <div className="hero hero-enhanced">
      <div className="hero-copy"><div className="eyebrow">AI-POWERED PROCUREMENT INTELLIGENCE</div>
        <h1>From tender document to<br/><em>verified IS Standards.</em></h1>
        <p>StandardMatch reads a tender, extracts technical requirements, finds relevant Indian Standards, explains the evidence, and keeps the final decision with the technical officer.</p>
        <div className="hero-actions"><button className="primary large" onClick={onOpen}><Upload size={18}/> Try with sample tender</button><button className="hero-link" onClick={onDemo}><Sparkles size={16}/> See how it works</button></div>
        <div className="trust-row"><span><CheckCircle2 size={14}/> Evidence-backed</span><span><ShieldCheck size={14}/> Human verified</span><span><Clock3 size={14}/> Faster review</span></div>
      </div>
      <div className="hero-graphic"><div className="workflow-mini"><div className="mini-step"><b>1</b><span><strong>Tender PDF</strong><small>18 pages</small></span></div><ChevronRight/><div className="mini-step"><b>2</b><span><strong>4 requirements</strong><small>AI extracted</small></span></div><ChevronRight/><div className="mini-step active"><b>3</b><span><strong>94% match</strong><small>IS 3025</small></span></div><ChevronRight/><div className="mini-step"><b>4</b><span><strong>Officer</strong><small>verifies</small></span></div></div></div>
    </div>

    <div className="section-head explainer-head"><div><div className="eyebrow">IN ONE GLANCE</div><h2>How StandardMatch works</h2><p>A simple four-step journey from unstructured tender text to an auditable recommendation.</p></div><button className="text-btn" onClick={onOpen}>Open live demo <ArrowUpRight size={15}/></button></div>
    <div className="how-grid">
      <HowStep n="01" icon={<Upload/>} title="Upload tender" text="Add the tender PDF. The prototype starts with a sample document for instant demonstration."/>
      <HowStep n="02" icon={<FileText/>} title="Extract requirements" text="AI converts tender language into clear, reviewable technical requirements."/>
      <HowStep n="03" icon={<Sparkles/>} title="Match standards" text="Relevant IS Codes are ranked with a confidence score and evidence mapping."/>
      <HowStep n="04" icon={<ShieldCheck/>} title="Officer verifies" text="A technical officer checks the evidence before a recommendation becomes final."/>
    </div>

    <div className="stats">
      <Stat icon={<FileText/>} label="Tenders analyzed" value="128" change="Demo metric"/>
      <Stat icon={<Sparkles/>} label="Recommendations" value="642" change="AI-ranked matches"/>
      <Stat icon={<ShieldCheck/>} label="Verified by officers" value="517" change="Human-in-the-loop"/>
      <Stat icon={<Clock3/>} label="Avg. review time" value="6m 42s" change="Prototype metric"/>
    </div>

    <div className="section-head"><div><h2>Recent analyses</h2><p>Examples showing what the workspace produces.</p></div><button className="text-btn" onClick={onOpen}>View analysis <ChevronRight size={16}/></button></div>
    <div className="table-card">
      <div className="table-row table-head"><span>TENDER</span><span>DOMAIN</span><span>RECOMMENDATIONS</span><span>STATUS</span><span></span></div>
      {[['Water Treatment Plant — Phase II','Water & Environment','12','Verified'],['Electrical Equipment Procurement','Electrical','8','In review'],['Hospital Equipment Supply','Medical','19','Verified']].map((x,i)=><div className="table-row" key={i}><div className="tender-cell"><div className="file-icon"><FileText size={17}/></div><div><b>{x[0]}</b><small>PDF • sample workspace</small></div></div><span>{x[1]}</span><span>{x[2]} IS Codes</span><span><Status text={x[3]}/></span><ChevronRight size={17}/></div>)}
    </div>
  </section>
}

function HowStep({n,icon,title,text}) {
  return <div className="how-card"><div className="how-top"><span className="how-number">{n}</span><div className="how-icon">{icon}</div></div><h3>{title}</h3><p>{text}</p></div>
}

function Stat({icon,label,value,change}) {
  return <div className="stat-card"><div className="stat-icon">{icon}</div><small>{label}</small><strong>{value}</strong><span>{change}</span></div>
}

function Analysis({uploaded,setUploaded,selected,setSelected,filtered,query,setQuery,verified,verify}) {
  return <section className="content">
    <div className="page-title"><div><div className="eyebrow">TENDER ANALYSIS</div><h1>Requirement → Standard matching</h1><p>Review what the AI extracted and why each standard was recommended.</p></div><button className="secondary"><Download size={17}/> Export report</button></div>
    <div className="judge-note"><div className="judge-note-icon"><Sparkles size={17}/></div><div><b>What you are seeing</b><span>Left = what the tender asks for • Right = what AI found • Evidence = why it matched • Verify = final human approval</span></div></div>

    {!uploaded ? <div className="upload-zone" onClick={()=>setUploaded(true)}>
      <div className="upload-icon"><Upload size={25}/></div>
      <h2>Drop tender PDF here</h2><p>or click to browse • PDF up to 25 MB</p>
      <div className="upload-note"><ShieldCheck size={15}/> Your file is processed inside the analysis workspace</div>
    </div> :
    <div className="analysis-workspace">
      <div className="file-banner"><div className="file-icon large-file"><FileText/></div><div><b>Water_Treatment_Plant_Phase_II.pdf</b><span>2.8 MB • 18 pages • Processed in 14.2s</span></div><Status text="Extraction complete"/><button className="icon-btn"><MoreHorizontal/></button></div>

      <div className="analysis-grid">
        <div>
          <div className="panel">
            <div className="panel-head"><div><h2>Extracted requirements</h2><p>AI identified 4 technical requirements from the tender.</p></div><span className="count">4</span></div>
            {requirements.map(r=><div className="requirement" key={r[0]}><div className="req-id">{r[0]}</div><div><b>{r[1]}</b><span>{r[2]}</span></div><Priority p={r[3]}/></div>)}
          </div>
          <div className="panel workflow"><div className="panel-head"><div><h2>Processing pipeline</h2><p>Evidence-first matching workflow.</p></div></div>
            {['PDF / OCR extraction','Requirement extraction','Semantic standards search','AI ranking + evidence','Officer verification'].map((s,i)=><div className="step" key={s}><div className={`step-dot ${i<4?'done':''}`}>{i<4?<CheckCircle2 size={15}/>:<Clock3 size={15}/>}</div><span>{s}</span>{i<4 && <small>Complete</small>}</div>)}
          </div>
        </div>

        <div className="panel recommendations">
          <div className="panel-head"><div><h2>Recommended IS Codes</h2><p>Ranked by requirement relevance and evidence strength.</p></div><div className="search"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search code..."/></div></div>
          {filtered.map(r=><div className="recommendation" key={r.code}>
            <div className="rec-top"><div><span className="code">{r.code}</span><Status text={r.status}/></div><span className="confidence">{r.confidence}% match</span></div>
            <h3>{r.title}</h3><p>{r.reason}</p>
            <div className="evidence"><ShieldCheck size={15}/><span>{r.evidence}</span><button onClick={()=>setSelected(r)}>View evidence</button></div>
            <div className="rec-bottom"><span>Domain: {r.domain}</span><button className={verified[r.code]?'verified-btn':'verify-btn'} onClick={()=>verify(r.code)}>{verified[r.code]?<><CheckCircle2 size={15}/> Verified</>:<><CheckCircle2 size={15}/> Verify</>}</button></div>
          </div>)}
        </div>
      </div>
    </div>}
  </section>
}

function Verification({verified,verify,setPage}) {
  const pending = recommendations.filter(r=>!verified[r.code]);
  return <section className="content">
    <div className="page-title"><div><div className="eyebrow">HUMAN-IN-THE-LOOP</div><h1>Verification queue</h1><p>Final approval stays with the technical officer.</p></div><div className="queue-pill"><Clock3 size={16}/>{pending.length} pending</div></div>
    <div className="panel">
      <div className="panel-head"><div><h2>Recommendations awaiting review</h2><p>Open evidence before marking a recommendation as verified.</p></div></div>
      {recommendations.map(r=><div className="verify-row" key={r.code}><div className="rec-code"><span className="code">{r.code}</span><b>{r.title}</b><small>{r.evidence}</small></div><span className="confidence">{r.confidence}%</span>{verified[r.code]?<Status text="Verified"/>:<button className="primary small" onClick={()=>verify(r.code)}><CheckCircle2 size={15}/> Approve</button>}</div>)}
    </div>
    <div className="report-card"><div><div className="eyebrow">TENDER-READY OUTPUT</div><h2>Generate verified standards report</h2><p>Only officer-approved recommendations are included in the final report.</p></div><button className="primary" onClick={()=>alert('Prototype: report generation endpoint is ready to connect.')}>Generate report <Download size={16}/></button></div>
  </section>
}

function Library() {
  return <section className="content">
    <div className="page-title"><div><div className="eyebrow">KNOWLEDGE BASE</div><h1>Indian Standards Library</h1><p>Structured metadata used by the recommendation engine.</p></div><button className="primary"><Database size={17}/> Add source</button></div>
    <div className="stats"><Stat icon={<Database/>} label="Indexed standards" value="8,420" change="Metadata records"/><Stat icon={<CheckCircle2/>} label="Current status" value="7,936" change="94.3% of index"/><Stat icon={<Clock3/>} label="Needs review" value="484" change="Revision/status check"/></div>
    <div className="panel library-list">
      {recommendations.map(r=><div className="library-row" key={r.code}><div><span className="code">{r.code}</span><b>{r.title}</b><small>{r.domain}</small></div><Status text={r.status}/><button className="secondary small">View metadata</button></div>)}
    </div>
  </section>
}

function Status({text}) { const green=['Current','Verified','Extraction complete'].includes(text); return <span className={`status ${green?'green':''}`}><i/>{text}</span> }
function Priority({p}) { return <span className={`priority ${p.toLowerCase()}`}>{p}</span> }

createRoot(document.getElementById('root')).render(<App/>);
