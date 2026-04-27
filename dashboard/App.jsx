// NDEC Dashboard — React App
const { useState, useEffect, useRef } = React;

const CAT_COLORS = {
  Safety: '#f85149',
  Devices: '#58a6ff',
  Internet: '#fbbf24',
  Apps: '#3fb950',
};

const STATUS_COLORS = {
  'Active': '#3fb950',
  'Pending Verification': '#fbbf24',
  'Approved': '#22d3ee',
  'Waitlisted': '#656d76',
};

const fmt     = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const fmtTime = (d) => d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
const timeAgo = (d) => {
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60)    return `${s}s ago`;
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

// Address with inline County: "Brunswick, Cumberland County, ME 04011"
const formatAddress      = (s) => `${s.town}, ${s.county} County, ${s.state} ${s.zip}`;
const formatAddressShort = (s) => `${s.town}, ${s.county} County, ${s.state}`;

// Period helpers — shared by KPI selector and CSV export
const PERIOD_DAYS  = { weekly: 7, monthly: 30, quarterly: 90, yearly: 365 };
const PERIOD_LABEL = { weekly: 'This Week', monthly: 'This Month', quarterly: 'This Quarter', yearly: 'This Year' };
const PERIOD_PREV  = { weekly: 'prev. 7 days', monthly: 'prev. 30 days', quarterly: 'prev. 90 days', yearly: 'prev. 365 days' };
const filterByPeriod = (signups, period) => {
  if (period === 'all') return signups;
  const ms = PERIOD_DAYS[period] * 86400000;
  return signups.filter(s => Date.now() - s.user_registered < ms);
};

// ─── SMALL UTILITIES ─────────────────────────────────────────────────────────
function Badge({ color, bg, children }) {
  return (
    <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
      background: bg, color, border: `1px solid ${color}40` }}>{children}</span>
  );
}

function Chip({ color, children }) {
  return (
    <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4,
      background: '#eaeef2', color: color || '#656d76', whiteSpace: 'nowrap' }}>{children}</span>
  );
}

function HBar({ label, value, max, color }) {
  const pct = max > 0 ? value / max * 100 : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
      <div style={{ width: 160, fontSize: 11, color: '#656d76', textAlign: 'right',
        flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
      <div style={{ flex: 1, height: 13, background: '#eaeef2', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
      </div>
      <div style={{ width: 28, fontSize: 11, color: '#1f2328', fontVariantNumeric: 'tabular-nums',
        textAlign: 'right', flexShrink: 0 }}>{value}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#9198a1', textTransform: 'uppercase',
        letterSpacing: 1, marginBottom: 8, paddingBottom: 5, borderBottom: '1px solid #eaeef2' }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>{children}</div>
    </div>
  );
}

function Row({ label, value, valueColor, mono }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
      <span style={{ fontSize: 11, color: '#656d76', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 12, color: valueColor || '#444c56', textAlign: 'right',
        fontFamily: mono ? 'monospace' : 'inherit' }}>{value}</span>
    </div>
  );
}

function FeedRow({ label, value, color, mono }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
      <span style={{ color: '#9198a1', flexShrink: 0 }}>{label}</span>
      <span style={{ color: color || '#656d76', textAlign: 'right',
        fontFamily: mono ? 'monospace' : 'inherit', wordBreak: 'break-all' }}>{value}</span>
    </div>
  );
}

// ─── KPI CARD ────────────────────────────────────────────────────────────────
function KPICard({ label, value, sub, color, live, onClick, clickable, trend, periodLabel }) {
  const prev = useRef(value);
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (value !== prev.current) { setFlash(true); setTimeout(() => setFlash(false), 600); }
    prev.current = value;
  }, [value]);
  return (
    <div onClick={onClick}
      style={{ background: flash ? '#e6f4ea' : '#ffffff', border: '1px solid #d0d7de',
        borderTop: `3px solid ${color}`, borderRadius: 8, padding: '18px 22px',
        flex: 1, minWidth: 0, position: 'relative', transition: 'background 0.4s',
        cursor: clickable ? 'pointer' : 'default' }}
      onMouseEnter={e => { if (clickable) e.currentTarget.style.background = '#f0f2f5'; }}
      onMouseLeave={e => { if (clickable) e.currentTarget.style.background = flash ? '#e6f4ea' : '#ffffff'; }}>
      {live && (
        <span style={{ position: 'absolute', top: 12, right: 14, fontSize: 10, fontWeight: 700,
          color: '#3fb950', letterSpacing: 1, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3fb950',
            display: 'inline-block', animation: 'pulse 1.4s ease infinite' }} />LIVE
        </span>
      )}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, lineHeight: 1 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#1f2328', fontVariantNumeric: 'tabular-nums' }}>
          {value.toLocaleString()}
        </div>
        {trend != null && (
          <div style={{ fontSize: 11, fontWeight: 600, color: trend >= 0 ? '#1a7f37' : '#cf222e',
            background: trend >= 0 ? '#dafbe1' : '#ffebe9', borderRadius: 4, padding: '2px 6px', whiteSpace: 'nowrap' }}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div style={{ fontSize: 13, color: '#656d76', marginTop: 6 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
        {sub && <div style={{ fontSize: 11, color }}>{sub}</div>}
        {trend != null && <div style={{ fontSize: 10, color: '#9198a1' }}>vs {periodLabel || 'prev. 7 days'}</div>}
      </div>
    </div>
  );
}

// ─── ENROLLMENT BARS ─────────────────────────────────────────────────────────
function EnrollmentBars({ signups, mode }) {
  const { CLASSES } = window.NDEC;
  const counts = {};
  CLASSES.forEach(c => { counts[c.id] = 0; });
  if (mode === 'enrolled') {
    signups.forEach(s => s.classesEnrolled.forEach(c => { counts[c.id] = (counts[c.id] || 0) + 1; }));
  } else {
    signups.forEach(s => s.classesRecommended.forEach(c => { counts[c.id] = (counts[c.id] || 0) + 1; }));
  }
  const rows = CLASSES.map(c => ({ ...c, count: counts[c.id] || 0 })).sort((a, b) => b.count - a.count);
  const max = Math.max(...rows.map(r => r.count), 1);
  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
        {Object.entries(CAT_COLORS).map(([cat, col]) => (
          <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#656d76' }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: col, display: 'inline-block' }} />
            {cat}
          </div>
        ))}
      </div>
      {rows.map(r => <HBar key={r.id} label={r.name} value={r.count} max={max} color={CAT_COLORS[r.category] || '#58a6ff'} />)}
    </div>
  );
}


// ─── USA MAP ─────────────────────────────────────────────────────────────────
// FIPS prefixes that are not US states (territories) — filtered out of USA view.
const NON_STATE_FIPS = new Set(['60','66','69','72','78']); // AS, GU, MP, PR, VI

const STATE_NAME_TO_ABBR = {
  Alabama:'AL',Alaska:'AK',Arizona:'AZ',Arkansas:'AR',California:'CA',Colorado:'CO',Connecticut:'CT',Delaware:'DE',
  'District of Columbia':'DC',Florida:'FL',Georgia:'GA',Hawaii:'HI',Idaho:'ID',Illinois:'IL',Indiana:'IN',Iowa:'IA',
  Kansas:'KS',Kentucky:'KY',Louisiana:'LA',Maine:'ME',Maryland:'MD',Massachusetts:'MA',Michigan:'MI',Minnesota:'MN',
  Mississippi:'MS',Missouri:'MO',Montana:'MT',Nebraska:'NE',Nevada:'NV','New Hampshire':'NH','New Jersey':'NJ',
  'New Mexico':'NM','New York':'NY','North Carolina':'NC','North Dakota':'ND',Ohio:'OH',Oklahoma:'OK',Oregon:'OR',
  Pennsylvania:'PA','Rhode Island':'RI','South Carolina':'SC','South Dakota':'SD',Tennessee:'TN',Texas:'TX',Utah:'UT',
  Vermont:'VT',Virginia:'VA',Washington:'WA','West Virginia':'WV',Wisconsin:'WI',Wyoming:'WY',
};
const STATE_FIPS_TO_NAME = {
  '01':'Alabama','02':'Alaska','04':'Arizona','05':'Arkansas','06':'California','08':'Colorado','09':'Connecticut',
  '10':'Delaware','11':'District of Columbia','12':'Florida','13':'Georgia','15':'Hawaii','16':'Idaho','17':'Illinois',
  '18':'Indiana','19':'Iowa','20':'Kansas','21':'Kentucky','22':'Louisiana','23':'Maine','24':'Maryland','25':'Massachusetts',
  '26':'Michigan','27':'Minnesota','28':'Mississippi','29':'Missouri','30':'Montana','31':'Nebraska','32':'Nevada',
  '33':'New Hampshire','34':'New Jersey','35':'New Mexico','36':'New York','37':'North Carolina','38':'North Dakota',
  '39':'Ohio','40':'Oklahoma','41':'Oregon','42':'Pennsylvania','44':'Rhode Island','45':'South Carolina','46':'South Dakota',
  '47':'Tennessee','48':'Texas','49':'Utah','50':'Vermont','51':'Virginia','53':'Washington','54':'West Virginia',
  '55':'Wisconsin','56':'Wyoming',
};

function useTopoData() {
  const [data, setData] = useState(null);
  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(r => r.json()),
      fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json').then(r => r.json()),
    ]).then(([statesTopo, countiesTopo]) => {
      if (!alive) return;
      const states   = window.topojson.feature(statesTopo,   statesTopo.objects.states);
      const counties = window.topojson.feature(countiesTopo, countiesTopo.objects.counties);
      states.features = states.features.filter(f => !NON_STATE_FIPS.has(String(f.id).padStart(2,'0').slice(0,2)));
      setData({ states, counties });
    }).catch(err => console.error('USAMap topojson load failed', err));
    return () => { alive = false; };
  }, []);
  return data;
}

function USAMap({ signups, onNodeClick, selectedId, mapView, setMapView }) {
  const topo = useTopoData();
  const [hovered, setHovered] = useState(null);
  const W = 360, H = 420;
  if (!topo) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#9198a1' }}>
        Loading map…
      </div>
    );
  }

  const isStateView  = mapView !== 'usa';
  const stateFips    = isStateView ? String(mapView).padStart(2,'0') : null;
  const stateFeature = isStateView ? topo.states.features.find(f => String(f.id).padStart(2,'0') === stateFips) : null;
  const stateAbbr    = stateFeature ? STATE_NAME_TO_ABBR[stateFeature.properties.name] : null;

  const projection = isStateView && stateFeature
    ? window.d3.geoMercator().fitExtent([[12,12],[W-12,H-12]], stateFeature)
    : window.d3.geoAlbersUsa().fitExtent([[6,6],[W-6,H-6]], topo.states);
  const pathGen = window.d3.geoPath(projection);

  const enrollByAbbr = {};
  signups.forEach(s => { enrollByAbbr[s.state] = (enrollByAbbr[s.state] || 0) + 1; });
  const maxByState = Math.max(...Object.values(enrollByAbbr), 1);

  const stateSignups = isStateView ? signups.filter(s => s.state === stateAbbr) : [];
  const projectedNodes = stateSignups.map(s => {
    const p = projection([s.lng, s.lat]);
    return p ? { signup: s, x: p[0], y: p[1] } : null;
  }).filter(Boolean);

  const stateCounties = isStateView
    ? topo.counties.features.filter(c => String(c.id).padStart(5,'0').slice(0,2) === stateFips)
    : [];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%', display: 'block' }} preserveAspectRatio="xMidYMid meet">
        <rect width={W} height={H} fill="#dce8f5" />
        {!isStateView && topo.states.features.map(f => {
          const abbr = STATE_NAME_TO_ABBR[f.properties.name];
          const count = enrollByAbbr[abbr] || 0;
          const intensity = count / maxByState;
          const fill = count > 0 ? `rgba(88, 166, 255, ${0.18 + intensity * 0.72})` : '#cdd9ea';
          return (
            <path key={f.id} d={pathGen(f)} fill={fill} stroke="#ffffff" strokeWidth="0.6"
              style={{ cursor: 'pointer' }}
              onClick={() => setMapView(String(f.id).padStart(2,'0'))}
              onMouseEnter={() => setHovered({ name: f.properties.name, count })}
              onMouseLeave={() => setHovered(null)} />
          );
        })}
        {isStateView && stateCounties.map(c => (
          <path key={c.id} d={pathGen(c)} fill="#cdd9ea" stroke="#ffffff" strokeWidth="0.4"
            onMouseEnter={() => setHovered({ name: `${c.properties.name} County`, count: null })}
            onMouseLeave={() => setHovered(null)} />
        ))}
        {isStateView && stateFeature && (
          <path d={pathGen(stateFeature)} fill="none" stroke="#94a3b8" strokeWidth="1" />
        )}
        {isStateView && projectedNodes.map(({ signup, x, y }) => {
          const col = signup.onboarding.q2_internet_home ? '#58a6ff' : '#f59e0b';
          const isSel = signup.id === selectedId;
          return (
            <g key={signup.id} style={{ cursor: 'pointer' }} onClick={() => onNodeClick(signup)}>
              <circle cx={x} cy={y} r={6} fill={col} opacity="0.22" />
              <circle cx={x} cy={y} r={isSel ? 5 : 3.5} fill={col} opacity={isSel ? 1 : 0.9}
                stroke={isSel ? '#ffffff' : 'none'} strokeWidth={isSel ? 1.2 : 0} />
            </g>
          );
        })}
      </svg>
      {hovered && (
        <div style={{ position: 'absolute', top: 8, left: isStateView ? 90 : 8, background: '#ffffffdd', backdropFilter: 'blur(4px)',
          border: '1px solid #d0d7de', borderRadius: 6, padding: '6px 10px', fontSize: 11, color: '#1f2328',
          pointerEvents: 'none' }}>
          <span style={{ fontWeight: 700 }}>{hovered.name}</span>
          {hovered.count != null && <span style={{ color: '#656d76', marginLeft: 6 }}>{hovered.count} enrollment{hovered.count === 1 ? '' : 's'}</span>}
        </div>
      )}
      {isStateView && (
        <button onClick={() => setMapView('usa')}
          style={{ position: 'absolute', top: 8, left: 8, padding: '4px 10px', fontSize: 11, fontWeight: 600,
            background: '#ffffffdd', border: '1px solid #d0d7de', borderRadius: 5, color: '#1f2328', cursor: 'pointer' }}>
          ← Back to USA
        </button>
      )}
    </div>
  );
}

// ─── DETAIL PANEL ────────────────────────────────────────────────────────────
function DetailPanel({ signup, onClose }) {
  if (!signup) return null;
  const { pg, sp } = { pg: signup.partnerGroup, sp: signup.sponsorship };
  const ob = signup.onboarding;
  return (
    <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 310, background: '#ffffff',
      borderLeft: '1px solid #d0d7de', overflowY: 'auto', zIndex: 50, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #d0d7de',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1f2328' }}>{signup.display_name}</div>
          <div style={{ fontSize: 11, color: '#656d76', marginTop: 2, fontFamily: 'monospace' }}>{signup.user_login}</div>
          <div style={{ fontSize: 11, color: '#58a6ff', marginTop: 1 }}>{signup.user_email}</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#656d76', cursor: 'pointer', fontSize: 18, padding: 0, lineHeight: 1 }}>✕</button>
      </div>

      <div style={{ padding: '14px 16px', flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          <Badge color={signup.isActive ? '#3fb950' : '#f85149'} bg={signup.isActive ? '#ddf4e0' : '#fce8e8'}>
            {signup.isActive ? '● Active' : '○ Inactive'}
          </Badge>
          {signup.isNew && <Badge color="#3fb950" bg="#1a2a1a">✦ New</Badge>}
          {sp && <Badge color={STATUS_COLORS[sp.status] || '#656d76'} bg="#f0f2f5">{sp.status}</Badge>}
        </div>

        <Section title="Account">
          <Row label="User Login" value={signup.user_login} mono />
          <Row label="Email" value={signup.user_email} valueColor="#58a6ff" />
          <Row label="Display Name" value={signup.display_name} />
          <Row label="Registered" value={fmt(signup.user_registered)} />
          <Row label="Last Login" value={fmtTime(signup.last_login)} />
        </Section>

        <Section title="Location">
          <Row label="Town / City" value={signup.town} />
          <Row label="County" value={`${signup.county} County`} />
          <Row label="State" value={signup.state} />
          <Row label="ZIP Code" value={signup.zip} mono />
        </Section>

        <Section title="Onboarding Answers">
          <Row label="ZIP Checked" value={ob.q1_zip} mono />
          <Row label="Partner Eligible" value={ob.q1_partner_check ? 'Yes' : 'No'} valueColor={ob.q1_partner_check ? '#22d3ee' : '#656d76'} />
          <Row label="Internet at Home" value={ob.q2_internet_home ? '✓ Yes' : '✗ No'} valueColor={ob.q2_internet_home ? '#3fb950' : '#f59e0b'} />
          {ob.q3_affordable_interest && <Row label="Affordable Interest" value={ob.q3_affordable_interest} />}
          <Row label="Main Goal" value={ob.main_goal} />
          <Row label="Device" value={ob.device_type} />
          <Row label="Experience" value={ob.experience_level} />
          {ob.household_size && <Row label="Household Size" value={ob.household_size} />}
        </Section>

        <Section title="Classes Recommended">
          {signup.classesRecommended.map(c => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '4px 8px', background: '#f0f2f5', borderRadius: 4 }}>
              <span style={{ fontSize: 12, color: '#444c56' }}>{c.name}</span>
              <span style={{ fontSize: 10, color: CAT_COLORS[c.category] || '#656d76', flexShrink: 0, marginLeft: 6 }}>{c.category}</span>
            </div>
          ))}
        </Section>

        <Section title="Classes Enrolled">
          {signup.classesEnrolled.length === 0
            ? <div style={{ fontSize: 12, color: '#9198a1' }}>No enrollments yet</div>
            : signup.classesEnrolled.map((c, i) => (
              <div key={i} style={{ padding: '6px 8px', background: '#f0f2f5', borderRadius: 4,
                border: `1px solid ${c.completed ? '#3fb95030' : '#eaeef2'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#1f2328', fontWeight: 500 }}>{c.name}</span>
                  {c.completed && <span style={{ fontSize: 10, color: '#3fb950' }}>✓ Done</span>}
                </div>
                <div style={{ fontSize: 11, color: '#656d76', marginTop: 3, display: 'flex', gap: 10 }}>
                  <span>{fmt(c.enrolledDate)}</span>
                  <span style={{ color: CAT_COLORS[c.category] }}>{c.format}</span>
                </div>
              </div>
            ))
          }
        </Section>

        {sp && (
          <Section title="Sponsorship">
            <Row label="Program" value={sp.programName} />
            <Row label="Sponsor Code" value={sp.sponsorCode} mono />
            <Row label="Status" value={sp.status} valueColor={STATUS_COLORS[sp.status]} />
            <Row label="Free Classes" value={sp.eligibleFree ? 'Yes' : 'No'} valueColor={sp.eligibleFree ? '#3fb950' : '#656d76'} />
            <Row label="Household Size" value={sp.householdSize} />
            {sp.verifiedDate && <Row label="Verified" value={fmt(sp.verifiedDate)} />}
            {sp.notes && <Row label="Notes" value={sp.notes} valueColor="#fbbf24" />}
          </Section>
        )}
      </div>
    </div>
  );
}

// ─── EXPORT CSV ──────────────────────────────────────────────────────────────
function exportCSV(signups, periodKey = 'all') {
  const rows = [
    ['ID','Display Name','User Login','Email','First Name','Last Name','Town','County','State','ZIP',
     'Registered','Last Login','Active',
     'Internet at Home','Affordable Interest','Goal','Device','Experience','Household Size',
     'Classes Recommended','Classes Enrolled','Enrollment Dates','Completed',
     'Partner Group','Sponsor Code','Sponsor Status','Free Classes','Sponsor Household','Verified Date','Notes'],
  ];
  signups.forEach(s => {
    const ob = s.onboarding; const sp = s.sponsorship;
    rows.push([
      s.id, s.display_name, s.user_login, s.user_email, s.first_name, s.last_name,
      s.town, s.county, s.state, s.zip,
      s.user_registered.toISOString(), s.last_login.toISOString(), s.isActive ? 'Yes' : 'No',
      ob.q2_internet_home ? 'Yes' : 'No', ob.q3_affordable_interest || '',
      ob.main_goal, ob.device_type, ob.experience_level, ob.household_size || '',
      s.classesRecommended.map(c => c.name).join('; '),
      s.classesEnrolled.map(c => c.name).join('; '),
      s.classesEnrolled.map(c => c.enrolledDate.toISOString().slice(0,10)).join('; '),
      `${s.classesEnrolled.filter(c => c.completed).length}/${s.classesEnrolled.length}`,
      sp?.programName || '', sp?.sponsorCode || '', sp?.status || '',
      sp?.eligibleFree ? 'Yes' : 'No', sp?.householdSize || '',
      sp?.verifiedDate ? sp.verifiedDate.toISOString().slice(0,10) : '', sp?.notes || '',
    ]);
  });
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: `NDEC_Enrollments_${periodKey}_${new Date().toISOString().slice(0,10)}.csv` });
  a.click(); URL.revokeObjectURL(url);
}

// ─── LIVE FEED ───────────────────────────────────────────────────────────────
function LiveFeed({ recentSignups, dashboardPeriod }) {
  const [expanded, setExpanded] = useState(null);
  const [exportPeriod, setExportPeriod] = useState(dashboardPeriod || 'all');
  useEffect(() => { setExportPeriod(dashboardPeriod || 'all'); }, [dashboardPeriod]);
  return (
    <div style={{ background: '#ffffff', border: '1px solid #d0d7de', borderRadius: 8,
      overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #d0d7de', fontSize: 12,
        fontWeight: 700, color: '#656d76', textTransform: 'uppercase', letterSpacing: 1,
        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3fb950',
          display: 'inline-block', animation: 'pulse 1.4s ease infinite' }} />
        Live Enrollment Feed
        <span style={{ marginLeft: 'auto', fontWeight: 400, fontSize: 11,
          textTransform: 'none', letterSpacing: 0, color: '#656d76' }}>
          {recentSignups.length} recent · click to expand
        </span>
        <select value={exportPeriod} onChange={e => setExportPeriod(e.target.value)}
          style={{ padding: '4px 8px', fontSize: 11, background: '#f6f8fa',
            border: '1px solid #d0d7de', borderRadius: 5, color: '#1f2328',
            textTransform: 'none', letterSpacing: 0, cursor: 'pointer' }}>
          <option value="all">All time</option>
          <option value="weekly">This week</option>
          <option value="monthly">This month</option>
          <option value="quarterly">This quarter</option>
          <option value="yearly">This year</option>
        </select>
        <button onClick={() => exportCSV(filterByPeriod(recentSignups, exportPeriod), exportPeriod)}
          style={{ padding: '4px 12px', fontSize: 11, fontWeight: 600, background: '#eaeef2',
            border: '1px solid #d0d7de', borderRadius: 5, color: '#1f2328', cursor: 'pointer',
            textTransform: 'none', letterSpacing: 0, transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#d0d7de'}
          onMouseLeave={e => e.currentTarget.style.background = '#eaeef2'}>
          ↓ Export CSV
        </button>
      </div>

      <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {recentSignups.map(s => (
          <div key={s.id} style={{ borderBottom: '1px solid #eaeef2' }}>
            <div onClick={() => setExpanded(expanded === s.id ? null : s.id)}
              style={{ padding: '10px 14px', cursor: 'pointer',
                background: s.isNew ? '#ddf4e0' : expanded === s.id ? '#f0f2f5' : 'transparent',
                transition: 'background 0.2s', display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', gap: 6 }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 13, color: '#1f2328', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 5 }}>
                  {s.isNew && <span style={{ width: 6, height: 6, borderRadius: '50%',
                    background: '#3fb950', display: 'inline-block', flexShrink: 0 }} />}
                  {s.display_name}
                  {s.partnerGroup && <span style={{ width: 7, height: 7, borderRadius: '50%',
                    background: s.partnerGroup.color, display: 'inline-block', flexShrink: 0, marginLeft: 2 }} />}
                </div>
                <div style={{ fontSize: 11, color: '#656d76', marginTop: 2, display: 'flex', gap: 10 }}>
                  <span style={{ fontFamily: 'monospace' }}>{s.user_login}</span>
                  <span>·</span><span>{formatAddressShort(s)}</span><span>·</span>
                  <span style={{ color: s.onboarding.q2_internet_home ? '#3fb950' : '#f59e0b' }}>
                    {s.onboarding.q2_internet_home ? '✓ Internet' : '✗ No internet'}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#9198a1', marginTop: 2,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.onboarding.main_goal}
                </div>
              </div>
              <div style={{ fontSize: 10, color: '#9198a1', flexShrink: 0, marginTop: 1, textAlign: 'right' }}>
                <div>{timeAgo(s.user_registered)}</div>
                {s.classesEnrolled[0] && (
                  <div style={{ color: '#656d76', marginTop: 2 }}>
                    {s.classesEnrolled.length} class{s.classesEnrolled.length !== 1 ? 'es' : ''} enrolled
                  </div>
                )}
              </div>
            </div>

            {expanded === s.id && (
              <div style={{ padding: '10px 14px', background: '#ebebf0',
                borderTop: '1px solid #eaeef2', fontSize: 11 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                  <div>
                    <FeedRow label="Login" value={s.user_login} mono />
                    <FeedRow label="Email" value={s.user_email} color="#58a6ff" />
                    <FeedRow label="Registered" value={fmt(s.user_registered)} />
                    <FeedRow label="Last Login" value={fmtTime(s.last_login)} />
                    <div style={{ height: 1, background: '#eaeef2', margin: '7px 0' }} />
                    <FeedRow label="Town" value={formatAddress(s)} />
                    <FeedRow label="County" value={`${s.county} County`} />
                    <FeedRow label="ZIP" value={s.zip} mono />
                  </div>
                  <div>
                    <FeedRow label="Internet at Home" value={s.onboarding.q2_internet_home ? '✓ Yes' : '✗ No'}
                      color={s.onboarding.q2_internet_home ? '#3fb950' : '#f59e0b'} />
                    <FeedRow label="Goal" value={s.onboarding.main_goal} />
                    <FeedRow label="Device" value={s.onboarding.device_type} />
                    <FeedRow label="Experience" value={s.onboarding.experience_level} />
                    {s.onboarding.household_size && <FeedRow label="Household" value={s.onboarding.household_size} />}
                    {s.onboarding.q3_affordable_interest && <FeedRow label="Affordable?" value="Interested" color="#fbbf24" />}
                  </div>
                </div>
                <div style={{ height: 1, background: '#eaeef2', margin: '8px 0' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                  <div>
                    <div style={{ color: '#9198a1', fontSize: 10, textTransform: 'uppercase',
                      letterSpacing: 0.5, marginBottom: 4 }}>Recommended</div>
                    {s.classesRecommended.map(c => (
                      <div key={c.id} style={{ color: '#656d76', paddingLeft: 8, marginBottom: 2 }}>· {c.name}</div>
                    ))}
                  </div>
                  <div>
                    <div style={{ color: '#9198a1', fontSize: 10, textTransform: 'uppercase',
                      letterSpacing: 0.5, marginBottom: 4 }}>Enrolled</div>
                    {s.classesEnrolled.length === 0
                      ? <div style={{ color: '#9198a1', paddingLeft: 8 }}>None yet</div>
                      : s.classesEnrolled.map((c, i) => (
                        <div key={i} style={{ paddingLeft: 8, marginBottom: 3 }}>
                          <span style={{ color: '#444c56' }}>· {c.name}</span>
                          <span style={{ color: '#9198a1', marginLeft: 6 }}>{fmt(c.enrolledDate)}</span>
                          <span style={{ color: CAT_COLORS[c.category], marginLeft: 5 }}>{c.format}</span>
                          {c.completed && <span style={{ color: '#3fb950', marginLeft: 4 }}>✓</span>}
                        </div>
                      ))
                    }
                  </div>
                </div>
                {s.sponsorship && <>
                  <div style={{ height: 1, background: '#eaeef2', margin: '8px 0' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                    <div>
                      <div style={{ color: '#9198a1', fontSize: 10, textTransform: 'uppercase',
                        letterSpacing: 0.5, marginBottom: 4 }}>Sponsorship</div>
                      <FeedRow label="Program" value={s.sponsorship.programName} />
                      <FeedRow label="Code" value={s.sponsorship.sponsorCode} mono />
                    </div>
                    <div style={{ paddingTop: 16 }}>
                      <FeedRow label="Status" value={s.sponsorship.status} color={STATUS_COLORS[s.sponsorship.status]} />
                      <FeedRow label="Free" value={s.sponsorship.eligibleFree ? 'Yes' : 'No'}
                        color={s.sponsorship.eligibleFree ? '#3fb950' : '#656d76'} />
                      {s.sponsorship.notes && <FeedRow label="Notes" value={s.sponsorship.notes} color="#fbbf24" />}
                    </div>
                  </div>
                </>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PARTNER CARD ────────────────────────────────────────────────────────────
function PartnerCard({ pg, count, pct }) {
  return (
    <div style={{ background: '#f0f2f5', border: '1px solid #eaeef2', borderLeft: `3px solid ${pg.color}`,
      borderRadius: 6, padding: '13px 15px', display: 'flex', flexDirection: 'column', gap: 7 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1f2328', lineHeight: 1.3, paddingRight: 8 }}>{pg.name}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: pg.color, flexShrink: 0 }}>{count}</div>
      </div>
      <div style={{ height: 4, background: '#d0d7de', borderRadius: 2 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: pg.color, borderRadius: 2, transition: 'width 0.6s' }} />
      </div>
      <div style={{ fontSize: 11, color: '#656d76' }}>{pct.toFixed(1)}% of partner enrollments</div>
    </div>
  );
}

// ─── ACTIVE PANEL ────────────────────────────────────────────────────────────
function ActivePanel({ signups, onClose }) {
  const [search, setSearch] = useState('');
  const WEEK = 7 * 86400000;
  const active = signups
    .filter(s => (Date.now() - s.last_login) < WEEK)
    .sort((a, b) => b.last_login - a.last_login);
  const filtered = active.filter(s => {
    const q = search.toLowerCase();
    return !q || `${s.display_name} ${s.user_login} ${s.town} ${s.county}`.toLowerCase().includes(q);
  });
  const th = { padding: '8px 14px', fontSize: 11, color: '#656d76', textAlign: 'left', fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #d0d7de', whiteSpace: 'nowrap' };
  const td = { padding: '9px 14px', fontSize: 12, color: '#444c56', borderBottom: '1px solid #eaeef2', verticalAlign: 'middle' };
  return (
    <div style={{ margin: '12px 24px 0', background: '#ffffff', border: '1px solid #3fb95030',
      borderRadius: 8, overflow: 'hidden', animation: 'slideDown 0.2s ease' }}>
      <div style={{ padding: '12px 18px', borderBottom: '1px solid #d0d7de',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3fb950',
            display: 'inline-block', animation: 'pulse 1.4s ease infinite' }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1f2328' }}>Active This Week</div>
          <span style={{ fontSize: 12, color: '#656d76' }}>{filtered.length} users</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
            style={{ background: '#f6f8fa', border: '1px solid #d0d7de', borderRadius: 6,
              color: '#1f2328', fontSize: 12, padding: '5px 11px', width: 180, outline: 'none' }} />
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#656d76', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>✕</button>
        </div>
      </div>
      <div style={{ maxHeight: 320, overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>
            {['Name','Login','Email','Town','County','Internet','Partner Group','Classes','Last Sign In'].map(h => (
              <th key={h} style={th}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}
                onMouseEnter={e => e.currentTarget.style.background = '#f0f2f5'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {s.isNew && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3fb950', display: 'inline-block', flexShrink: 0 }} />}
                    <span style={{ fontWeight: 500, color: '#1f2328' }}>{s.display_name}</span>
                  </div>
                </td>
                <td style={td}><span style={{ fontFamily: 'monospace', fontSize: 11 }}>{s.user_login}</span></td>
                <td style={td}><span style={{ color: '#58a6ff', fontSize: 11 }}>{s.user_email}</span></td>
                <td style={td}>{s.town}</td>
                <td style={td}>{s.county}</td>
                <td style={td}><span style={{ fontSize: 11, fontWeight: 600, color: s.onboarding.q2_internet_home ? '#3fb950' : '#f59e0b' }}>{s.onboarding.q2_internet_home ? '✓ Yes' : '✗ No'}</span></td>
                <td style={td}>{s.partnerGroup
                  ? <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.partnerGroup.color, display: 'inline-block', flexShrink: 0 }} />
                      <span style={{ fontSize: 11 }}>{s.partnerGroup.abbr}</span>
                    </span>
                  : <span style={{ color: '#9198a1', fontSize: 11 }}>—</span>}
                </td>
                <td style={td}>
                  <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    {s.classesEnrolled.map((c, i) => (
                      <span key={i} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4,
                        background: '#eaeef2', color: CAT_COLORS[c.category] || '#656d76', whiteSpace: 'nowrap' }}>{c.name}</span>
                    ))}
                    {s.classesEnrolled.length === 0 && <span style={{ fontSize: 11, color: '#9198a1' }}>—</span>}
                  </div>
                </td>
                <td style={td}>
                  <div style={{ fontSize: 11, color: '#1f2328' }}>{fmtTime(s.last_login)}</div>
                  <div style={{ fontSize: 10, color: '#9198a1', marginTop: 2 }}>{timeAgo(s.last_login)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── PARTNER PANEL ───────────────────────────────────────────────────────────
function PartnerPanel({ signups, onClose }) {
  const { PARTNER_GROUPS } = window.NDEC;
  const pgStats = PARTNER_GROUPS.map(pg => {
    const members = signups.filter(s => s.partnerGroup?.id === pg.id);
    const withInternet = members.filter(s => s.onboarding.q2_internet_home).length;
    const freeEligible = members.filter(s => s.sponsorship?.eligibleFree).length;
    const active       = members.filter(s => s.isActive).length;
    const classCount   = members.reduce((a, s) => a + s.classesEnrolled.length, 0);
    const topGoals = {};
    members.forEach(s => { topGoals[s.onboarding.main_goal] = (topGoals[s.onboarding.main_goal] || 0) + 1; });
    const topGoal = Object.entries(topGoals).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
    return { pg, count: members.length, withInternet, freeEligible, active, classCount, topGoal };
  });
  const total = pgStats.reduce((a, s) => a + s.count, 0) || 1;
  const th = { padding: '9px 16px', fontSize: 11, color: '#656d76', textAlign: 'left', fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #d0d7de', whiteSpace: 'nowrap' };
  const td = { padding: '10px 16px', borderBottom: '1px solid #eaeef2' };
  return (
    <div style={{ margin: '12px 24px 0', background: '#ffffff', border: '1px solid #a78bfa30',
      borderRadius: 8, overflow: 'hidden', animation: 'slideDown 0.2s ease' }}>
      <div style={{ padding: '12px 18px', borderBottom: '1px solid #d0d7de',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1f2328' }}>Partner Group Breakdown</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#656d76', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>✕</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>
            {['Partner Group','Enrollments','Share','Active','Home Internet','Free Eligible','Classes Enrolled','Top Goal'].map(h => (
              <th key={h} style={th}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {pgStats.map(({ pg, count, withInternet, freeEligible, active, classCount, topGoal }) => (
              <tr key={pg.id}
                onMouseEnter={e => e.currentTarget.style.background = '#f0f2f5'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: pg.color, display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1f2328' }}>{pg.name}</span>
                  </div>
                </td>
                <td style={td}><span style={{ fontSize: 18, fontWeight: 700, color: pg.color }}>{count}</span></td>
                <td style={{ ...td, minWidth: 120 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: '#eaeef2', borderRadius: 3 }}>
                      <div style={{ width: `${(count / total) * 100}%`, height: '100%', background: pg.color, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 11, color: '#656d76', flexShrink: 0 }}>{((count / total) * 100).toFixed(1)}%</span>
                  </div>
                </td>
                <td style={td}><span style={{ fontSize: 12, color: '#3fb950' }}>{active}</span><span style={{ fontSize: 11, color: '#9198a1' }}> / {count}</span></td>
                <td style={td}><span style={{ fontSize: 12, color: '#58a6ff' }}>{withInternet}</span><span style={{ fontSize: 11, color: '#9198a1' }}> ({count > 0 ? Math.round(withInternet / count * 100) : 0}%)</span></td>
                <td style={td}><span style={{ fontSize: 12, color: '#34d399' }}>{freeEligible}</span><span style={{ fontSize: 11, color: '#9198a1' }}> ({count > 0 ? Math.round(freeEligible / count * 100) : 0}%)</span></td>
                <td style={td}><span style={{ fontSize: 12, color: '#1f2328' }}>{classCount}</span><span style={{ fontSize: 11, color: '#9198a1' }}> ({count > 0 ? (classCount / count).toFixed(1) : 0} avg)</span></td>
                <td style={td}><span style={{ fontSize: 11, color: '#656d76' }}>{topGoal}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
function App() {
  const { generateSignups, makeNewSignup } = window.NDEC;
  const [signups, setSignups] = useState(() => generateSignups(148));
  const [selected, setSelected] = useState(null);
  const [classPanel, setClassPanel]     = useState(false);
  const [partnerPanel, setPartnerPanel] = useState(false);
  const [activePanel, setActivePanel]   = useState(false);
  const [period, setPeriod]             = useState('weekly');
  const [mapView, setMapView]           = useState('usa');
  const timerRef = useRef(null);

  useEffect(() => {
    function scheduleNext() {
      const delay = 30000 + Math.random() * 30000;
      return setTimeout(() => {
        setSignups(prev => [makeNewSignup(prev.length), ...prev]);
        timerRef.current = scheduleNext();
      }, delay);
    }
    timerRef.current = scheduleNext();
    return () => clearTimeout(timerRef.current);
  }, []);

  const totalEnrollments      = signups.length;
  const totalClassEnrollments = signups.reduce((a, s) => a + s.classesEnrolled.length, 0);
  const partnerEnrollments    = signups.filter(s => s.partnerGroup).length;
  const periodMs              = PERIOD_DAYS[period] * 86400000;
  const activeInPeriod        = signups.filter(s => Date.now() - s.last_login < periodMs).length;

  return (
    <div style={{ minHeight: '100vh', background: '#f6f8fa', color: '#1f2328',
      fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes ripple   { 0%{r:12;opacity:0.7} 100%{r:22;opacity:0} }
        @keyframes slideDown{ from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#ffffff}
        ::-webkit-scrollbar-thumb{background:#d0d7de;border-radius:3px}
      `}</style>

      {/* Header */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid #d0d7de', padding: '0 24px',
        display: 'flex', alignItems: 'center', height: 54, gap: 14, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 6,
            background: 'linear-gradient(135deg,#3b82f6,#22d3ee)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 900, color: '#fff' }}>N</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1f2328', lineHeight: 1 }}>NDEC</div>
            <div style={{ fontSize: 10, color: '#656d76', lineHeight: 1, marginTop: 2 }}>Digital Literacy Portal</div>
          </div>
        </div>
        <div style={{ width: 1, height: 26, background: '#d0d7de' }} />
        <div style={{ fontSize: 13, color: '#656d76' }}>Enrollment Dashboard</div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', background: '#f6f8fa', border: '1px solid #d0d7de',
            borderRadius: 6, overflow: 'hidden' }}>
            {[['weekly','Week'],['monthly','Month'],['quarterly','Quarter'],['yearly','Year']].map(([id,lbl]) => (
              <button key={id} onClick={() => setPeriod(id)}
                style={{ padding: '5px 12px', fontSize: 11,
                  background: period === id ? '#eaeef2' : 'transparent',
                  color: period === id ? '#1f2328' : '#656d76',
                  border: 'none', borderRight: '1px solid #d0d7de',
                  fontWeight: period === id ? 600 : 400, cursor: 'pointer' }}>{lbl}</button>
            ))}
          </div>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3fb950',
            display: 'inline-block', animation: 'pulse 1.4s ease infinite' }} />
          <span style={{ fontSize: 12, color: '#656d76' }}>Live · {timeAgo(new Date())}</span>
        </div>
      </header>

      {/* KPIs */}
      <div style={{ padding: '14px 24px 0', display: 'flex', gap: 12, flexShrink: 0 }}>
        <KPICard label="Total Enrollments" value={totalEnrollments} color="#58a6ff" live
          sub={`+${signups.filter(s => s.isNew).length} new today`} trend={5} periodLabel={PERIOD_PREV[period]} />
        <KPICard label="Class Enrollments" value={totalClassEnrollments} color="#22d3ee"
          sub={classPanel ? '▲ Hide breakdown' : '▼ View breakdown'}
          onClick={() => setClassPanel(p => !p)} clickable trend={12} periodLabel={PERIOD_PREV[period]} />
        <KPICard label="Partner Group Enrollments" value={partnerEnrollments} color="#a78bfa"
          sub={partnerPanel ? '▲ Hide breakdown' : '▼ View breakdown'}
          onClick={() => setPartnerPanel(p => !p)} clickable trend={3} periodLabel={PERIOD_PREV[period]} />
        <KPICard label={`Active ${PERIOD_LABEL[period]}`} value={activeInPeriod} color="#3fb950"
          sub={activePanel ? '▲ Hide users' : '▼ View users'}
          onClick={() => setActivePanel(p => !p)} clickable trend={-2} periodLabel={PERIOD_PREV[period]} />
      </div>

      {/* Expandable panels */}
      {classPanel && (
        <div style={{ margin: '12px 24px 0', background: '#ffffff', border: '1px solid #22d3ee30',
          borderRadius: 8, overflow: 'hidden', animation: 'slideDown 0.2s ease' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid #d0d7de',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1f2328' }}>Class Enrollment Overview</div>
            <button onClick={() => setClassPanel(false)} style={{ background: 'none', border: 'none', color: '#656d76', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>✕</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
            <div style={{ padding: '16px 20px', borderRight: '1px solid #d0d7de' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#656d76', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Enrolled by Class</div>
              <EnrollmentBars signups={signups} mode="enrolled" />
            </div>
            <div style={{ padding: '16px 20px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#656d76', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Recommended by Class</div>
              <EnrollmentBars signups={signups} mode="recommended" />
            </div>
          </div>
        </div>
      )}
      {partnerPanel && <PartnerPanel signups={signups} onClose={() => setPartnerPanel(false)} />}
      {activePanel  && <ActivePanel  signups={signups} onClose={() => setActivePanel(false)} />}

      {/* Main grid: map + live feed */}
      <div style={{ display: 'flex', gap: 0, padding: '14px 24px 24px',
        overflow: 'hidden', height: 'calc(100vh - 190px)' }}>
        <div style={{ flex: '0 0 370px', background: '#ffffff', border: '1px solid #d0d7de',
          borderRadius: 8, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #d0d7de', flexShrink: 0,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1f2328', display: 'flex', alignItems: 'center', gap: 6 }}>
              {mapView === 'usa'
                ? 'United States Enrollment Map'
                : <>
                    <span onClick={() => setMapView('usa')} style={{ cursor: 'pointer', color: '#58a6ff' }}>United States</span>
                    <span style={{ color: '#9198a1' }}>›</span>
                    <span>{STATE_FIPS_TO_NAME[String(mapView).padStart(2, '0')] || mapView}</span>
                  </>}
            </div>
            <div style={{ fontSize: 11, color: '#656d76' }}>{signups.length} records</div>
          </div>
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <USAMap signups={signups} onNodeClick={setSelected} selectedId={selected?.id}
              mapView={mapView} setMapView={setMapView} />
            {selected && <DetailPanel signup={selected} onClose={() => setSelected(null)} />}
          </div>
        </div>

        <div style={{ flex: 1, marginLeft: 12 }}>
          <LiveFeed dashboardPeriod={period} recentSignups={[...signups].sort((a, b) => a.user_registered - b.user_registered).slice(-50).reverse()} />
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
