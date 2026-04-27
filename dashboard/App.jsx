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

// ─── SMALL UTILITIES ─────────────────────────────────────────────
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

// ─── KPI CARD ────────────────────────────────────────────
function KPICard({ label, value, sub, color, live, onClick, clickable, trend }) {
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
        {trend != null && <div style={{ fontSize: 10, color: '#9198a1' }}>vs prev. 7 days</div>}
      </div>
    </div>
  );
}

// ─── ENROLLMENT BARS ───────────────────────────────────────────
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

// ─── MAINE MAP ───────────────────────────────────────────────
const MAINE_PATH = `
  M 63,28 L 165,14 L 270,15
  L 289,43 L 283,79 L 265,109 L 269,144 L 287,158
  L 295,180 L 281,198 L 266,217 L 251,237
  L 236,252 L 219,268 L 203,280 L 191,294
  L 182,306 L 171,314 L 161,322 L 150,331
  L 139,341 L 127,353 L 112,367 L 98,378
  L 86,372 L 75,360 L 68,345 L 62,328
  L 55,310 L 51,292 L 51,274 L 56,257
  L 52,240 L 55,222 L 51,204 L 55,187
  L 51,170 L 55,152 L 57,134 L 54,117
  L 57,100 L 59,82 L 57,64 L 60,44 Z
`;

function MaineMap({ signups, onNodeClick, selectedId }) {
  const [hovered, setHovered] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const svgRef = useRef();

  const clusters = {};
  signups.forEach(s => {
    const key = `${Math.round(s.mapX / 6) * 6},${Math.round(s.mapY / 6) * 6}`;
    if (!clusters[key]) clusters[key] = [];
    clusters[key].push(s);
  });
  const nodes = Object.entries(clusters).map(([key, members]) => ({
    key, members,
    x: members.reduce((a, b) => a + b.mapX, 0) / members.length,
    y: members.reduce((a, b) => a + b.mapY, 0) / members.length,
    pctInternet: members.filter(m => m.onboarding.q2_internet_home).length / members.length,
    r: Math.max(5, Math.min(14, 4 + members.length * 0.8)),
    isSelected: members.some(m => m.id === selectedId),
  }));

  const CITY_LABELS = [
    { label: 'Portland', x: 132, y: 348 }, { label: 'Bangor', x: 198, y: 178 },
    { label: 'Augusta', x: 155, y: 258 }, { label: 'Presque Isle', x: 245, y: 48 },
    { label: 'Ellsworth', x: 226, y: 224 },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg ref={svgRef} viewBox="0 0 360 420" style={{ width: '100%', height: '100%', display: 'block' }} preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="glow"><feGaussianBlur stdDeviation="2.5" result="cb" /><feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="glows"><feGaussianBlur stdDeviation="4" result="cb" /><feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width="360" height="420" fill="#dce8f5" />
        <path d={MAINE_PATH} fill="#cdd9ea" stroke="#d0d7de" strokeWidth="1.5" />
        {CITY_LABELS.map(c => (
          <text key={c.label} x={c.x} y={c.y} fontSize="7" fill="#6b7280" textAnchor="middle"
            fontFamily="'Helvetica Neue',sans-serif" letterSpacing="0.5">{c.label}</text>
        ))}
        <text x="118" y="200" fontSize="22" fill="#000000" fillOpacity="0.05"
          fontFamily="'Helvetica Neue',sans-serif" fontWeight="700" letterSpacing="8">MAINE</text>
        {nodes.map(node => {
          const col = node.pctInternet > 0.5 ? '#58a6ff' : '#f59e0b';
          return (
            <g key={node.key} style={{ cursor: 'pointer' }}
              onClick={() => onNodeClick(node.members[0])}
              onMouseEnter={e => {
                setHovered(node);
                const r = svgRef.current.getBoundingClientRect();
                setTooltipPos({ x: node.x * (r.width / 360) + r.left, y: node.y * (r.height / 420) + r.top });
              }}
              onMouseLeave={() => setHovered(null)}>
              {node.members.some(m => m.isNew) && (
                <circle cx={node.x} cy={node.y} r={node.r + 6} fill="none" stroke="#3fb950"
                  strokeWidth="1.5" style={{ animation: 'ripple 1.5s ease-out infinite' }} opacity="0.7" />
              )}
              {node.isSelected && <circle cx={node.x} cy={node.y} r={node.r + 4} fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />}
              <circle cx={node.x} cy={node.y} r={node.r + 2} fill={col} opacity="0.18" filter="url(#glow)" />
              <circle cx={node.x} cy={node.y} r={node.r} fill={col} opacity={node.isSelected ? 1 : 0.85}
                filter={node.isSelected ? 'url(#glows)' : undefined} />
              {node.members.length > 1 && (
                <text x={node.x} y={node.y + 3.5} textAnchor="middle" fontSize={node.r > 9 ? 7 : 6}
                  fontWeight="700" fill="#f6f8fa" fontFamily="'Helvetica Neue',sans-serif">{node.members.length}</text>
              )}
            </g>
          );
        })}
        <text x="295" y="310" fontSize="7.5" fill="#000000" fillOpacity="0.12"
          fontFamily="'Helvetica Neue',sans-serif" fontStyle="italic" transform="rotate(-35,295,310)">Atlantic Ocean</text>
      </svg>

      {hovered && (
        <div style={{ position: 'fixed', left: tooltipPos.x + 12, top: tooltipPos.y - 10,
          background: '#f0f2f5', border: '1px solid #d0d7de', borderRadius: 6, padding: '8px 12px',
          fontSize: 12, color: '#1f2328', pointerEvents: 'none', zIndex: 100, whiteSpace: 'nowrap',
          boxShadow: '0 4px 16px #00000060' }}>
          <div style={{ fontWeight: 700 }}>{hovered.members[0].town}, {hovered.members[0].county} Co.</div>
          <div style={{ color: '#656d76', marginTop: 2 }}>{hovered.members.length} enrollment{hovered.members.length > 1 ? 's' : ''}</div>
          <div style={{ color: hovered.pctInternet > 0.5 ? '#58a6ff' : '#f59e0b', marginTop: 2, fontSize: 11 }}>
            {Math.round(hovered.pctInternet * 100)}% have home internet
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', bottom: 10, left: 10, background: '#ffffffdd',
        backdropFilter: 'blur(4px)', border: '1px solid #d0d7de', borderRadius: 6,
        padding: '8px 12px', fontSize: 11, color: '#656d76', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {[['#58a6ff', 'Has home internet'], ['#f59e0b', 'No home internet'], ['border:#3fb950', 'New signup']].map(([c, l]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', display: 'inline-block',
              background: c.startsWith('border') ? 'transparent' : c,
              border: c.startsWith('border') ? '1.5px solid #3fb950' : 'none' }} />
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DETAIL PANEL ────────────────────────────────────────────
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

function App() {
  return <div>NDEC Dashboard loading…</div>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
