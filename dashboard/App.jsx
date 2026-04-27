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

function App() {
  return <div>NDEC Dashboard loading…</div>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
