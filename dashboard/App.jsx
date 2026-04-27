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

function App() {
  return <div>NDEC Dashboard loading…</div>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
