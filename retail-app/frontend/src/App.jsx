import { useState, useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
);

// ─── Palette ───────────────────────────────────────────────────────────────
const P = {
  ink:     "#0D0F14",
  panel:   "#141720",
  border:  "#1E2330",
  accent:  "#E8A838",
  accent2: "#4FC3F7",
  accent3: "#81C784",
  accent4: "#F06292",
  accent5: "#CE93D8",
  muted:   "#6B7280",
  text:    "#E8EAF0",
  sub:     "#9CA3AF",
};

const CHART_COLORS = [
  P.accent, P.accent2, P.accent3, P.accent4, P.accent5,
  "#FFB74D","#4DB6AC","#FF8A65","#A5D6A7","#90CAF9"
];

const fmt = (n) =>
  n >= 1e7 ? `₹${(n / 1e7).toFixed(2)}Cr`
  : n >= 1e5 ? `₹${(n / 1e5).toFixed(2)}L`
  : `₹${Number(n).toLocaleString("en-IN")}`;

const chartDefaults = {
  plugins: { legend: { labels: { color: P.sub, font: { size: 12 } } } },
  scales: {
    x: { ticks: { color: P.sub }, grid: { color: P.border } },
    y: { ticks: { color: P.sub }, grid: { color: P.border } },
  },
};

// ─── KPI Card ───────────────────────────────────────────────────────────────
function KPICard({ label, value, icon, color }) {
  return (
    <div style={{
      background: P.panel, border: `1px solid ${P.border}`,
      borderRadius: 16, padding: "28px 24px",
      display: "flex", alignItems: "center", gap: 20,
      boxShadow: `0 0 0 0 ${color}22`,
      transition: "box-shadow .2s",
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 20px 2px ${color}33`}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: `${color}22`, display: "flex",
        alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0
      }}>{icon}</div>
      <div>
        <div style={{ color: P.sub, fontSize: 12, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
        <div style={{ color: P.text, fontSize: 22, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{value}</div>
      </div>
    </div>
  );
}

// ─── Chart Card ─────────────────────────────────────────────────────────────
function ChartCard({ title, children, span = 1 }) {
  return (
    <div style={{
      background: P.panel, border: `1px solid ${P.border}`,
      borderRadius: 16, padding: "24px",
      gridColumn: span === 2 ? "span 2" : undefined,
    }}>
      <div style={{ color: P.sub, fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>{title}</div>
      {children}
    </div>
  );
}

// ─── Upload Zone ─────────────────────────────────────────────────────────────
function UploadZone({ onUpload, loading }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.name.endsWith(".csv")) return alert("Please upload a CSV file.");
    onUpload(file);
  };

  return (
    <div style={{
      minHeight: "100vh", background: P.ink,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", padding: 24,
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 13, letterSpacing: ".2em", color: P.accent, fontWeight: 700, textTransform: "uppercase", marginBottom: 16 }}>
          ◈ Decision Support System
        </div>
        <h1 style={{
          color: P.text, fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          lineHeight: 1.1, margin: 0, marginBottom: 12,
        }}>
          Retail Store<br />
          <span style={{ color: P.accent }}>Analytics</span> Dashboard
        </h1>
        <p style={{ color: P.sub, fontSize: 16, maxWidth: 440, margin: "0 auto" }}>
          Upload your retail CSV and get instant insights — revenue trends, product performance, regional breakdowns, and more.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        style={{
          width: "100%", maxWidth: 480,
          border: `2px dashed ${dragging ? P.accent : P.border}`,
          borderRadius: 20, padding: "48px 32px",
          textAlign: "center", cursor: "pointer",
          background: dragging ? `${P.accent}08` : P.panel,
          transition: "all .2s",
        }}
      >
        <input ref={inputRef} type="file" accept=".csv" style={{ display: "none" }}
          onChange={e => handleFile(e.target.files[0])} />

        {loading ? (
          <div>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚙️</div>
            <div style={{ color: P.accent, fontWeight: 600, fontSize: 16 }}>Processing your data...</div>
            <div style={{ color: P.sub, fontSize: 13, marginTop: 8 }}>Cleaning & running analysis pipeline</div>
            <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 6 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: P.accent, animation: `pulse 1.2s ${i*0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
            <div style={{ color: P.text, fontWeight: 700, fontSize: 17, marginBottom: 8 }}>
              Drop your CSV file here
            </div>
            <div style={{ color: P.sub, fontSize: 14, marginBottom: 20 }}>
              or click to browse files
            </div>
            <div style={{
              display: "inline-block", background: P.accent,
              color: P.ink, fontWeight: 700, fontSize: 14,
              padding: "10px 28px", borderRadius: 10,
            }}>Upload CSV</div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 24, color: P.muted, fontSize: 12, textAlign: "center" }}>
        Required columns: Order_ID · Order_Date · Product_Name · Product_Line<br />
        Units_Sold · MRP · Discount_Applied · Region · Sales_Channel
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600&family=Syne:wght@700;800&family=IBM+Plex+Mono:wght@500;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1)} }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
function Dashboard({ data, onReset }) {
  const { kpis, sales_trend, top_products, product_lines, regions, channels, discount, profitability, row_count } = data;

  const mkLabels = obj => Object.keys(obj);
  const mkVals   = obj => Object.values(obj);

  const barOpts = (title) => ({
    ...chartDefaults,
    responsive: true,
    plugins: { ...chartDefaults.plugins, legend: { display: false } },
  });

  const lineData = {
    labels: mkLabels(sales_trend),
    datasets: [{
      label: "Revenue",
      data: mkVals(sales_trend),
      borderColor: P.accent,
      backgroundColor: `${P.accent}22`,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: P.accent,
      pointRadius: 4,
    }],
  };

  const topProdData = {
    labels: mkLabels(top_products),
    datasets: [{ data: mkVals(top_products), backgroundColor: CHART_COLORS }],
  };

  const regionData = {
    labels: mkLabels(regions),
    datasets: [{ data: mkVals(regions), backgroundColor: CHART_COLORS }],
  };

  const channelData = {
    labels: mkLabels(channels),
    datasets: [{ data: mkVals(channels), backgroundColor: CHART_COLORS, borderWidth: 0 }],
  };

  const prodLineData = {
    labels: mkLabels(product_lines),
    datasets: [{ data: mkVals(product_lines), backgroundColor: P.accent2 + "cc" }],
  };

  const profitData = {
    labels: mkLabels(profitability),
    datasets: [{ data: mkVals(profitability), backgroundColor: P.accent3 + "cc" }],
  };

  const discountData = {
    labels: mkLabels(discount),
    datasets: [{ data: mkVals(discount), backgroundColor: P.accent4 + "cc" }],
  };

  const pieOpts = {
    responsive: true,
    plugins: {
      legend: { position: "right", labels: { color: P.sub, font: { size: 12 }, padding: 16, boxWidth: 14 } },
    },
  };

  return (
    <div style={{ minHeight: "100vh", background: P.ink, fontFamily: "'DM Sans', sans-serif", color: P.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600&family=Syne:wght@700;800&family=IBM+Plex+Mono:wght@500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: ${P.ink}; }
        ::-webkit-scrollbar-thumb { background: ${P.border}; border-radius: 3px; }
      `}</style>

      {/* Top Nav */}
      <div style={{
        background: P.panel, borderBottom: `1px solid ${P.border}`,
        padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22 }}>◈</span>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: P.text }}>
              Retail Analytics
            </div>
            <div style={{ fontSize: 11, color: P.sub }}>
              {row_count.toLocaleString()} records processed
            </div>
          </div>
        </div>
        <button
          onClick={onReset}
          style={{
            background: "transparent", border: `1px solid ${P.border}`,
            color: P.sub, padding: "8px 18px", borderRadius: 8,
            cursor: "pointer", fontSize: 13, fontWeight: 600,
            transition: "all .15s",
          }}
          onMouseEnter={e => { e.target.style.borderColor = P.accent; e.target.style.color = P.accent; }}
          onMouseLeave={e => { e.target.style.borderColor = P.border; e.target.style.color = P.sub; }}
        >
          ↑ Upload New File
        </button>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        {/* Section: KPIs */}
        <div style={{ marginBottom: 12 }}>
          <SectionLabel>Key Performance Indicators</SectionLabel>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16, marginBottom: 40,
        }}>
          <KPICard label="Total Revenue" value={fmt(kpis["Total Revenue"])} icon="💰" color={P.accent} />
          <KPICard label="Total Profit" value={fmt(kpis["Total Profit"])} icon="📈" color={P.accent3} />
          <KPICard label="Units Sold" value={Number(kpis["Total Units Sold"]).toLocaleString("en-IN")} icon="📦" color={P.accent2} />
        </div>

        {/* Section: Trends & Channels */}
        <SectionLabel>Sales Performance</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
          <ChartCard title="Monthly Revenue Trend">
            <Line data={lineData} options={{
              ...chartDefaults, responsive: true,
              plugins: { ...chartDefaults.plugins, legend: { display: false } },
            }} height={90} />
          </ChartCard>
          <ChartCard title="Sales Channel Distribution">
            <Pie data={channelData} options={pieOpts} />
          </ChartCard>
        </div>

        {/* Section: Products */}
        <SectionLabel>Product Intelligence</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <ChartCard title="Top 10 Products by Units Sold">
            <Bar data={topProdData} options={{
              ...barOpts(), indexAxis: "y", responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                x: { ticks: { color: P.sub }, grid: { color: P.border } },
                y: { ticks: { color: P.sub, font: { size: 11 } }, grid: { display: false } },
              },
            }} />
          </ChartCard>
          <ChartCard title="Product Line Revenue">
            <Bar data={prodLineData} options={barOpts("Product Line Revenue")} />
          </ChartCard>
        </div>

        {/* Section: Regional & Discount */}
        <SectionLabel>Regional & Discount Analysis</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
          <ChartCard title="Revenue by Region">
            <Bar data={regionData} options={barOpts("Revenue by Region")} />
          </ChartCard>
          <ChartCard title="Profitability by Product Line">
            <Bar data={profitData} options={barOpts("Profitability")} />
          </ChartCard>
          <ChartCard title="Revenue by Discount Range">
            <Bar data={discountData} options={barOpts("Discount Effectiveness")} />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      color: P.sub, fontSize: 11, fontWeight: 700,
      letterSpacing: ".12em", textTransform: "uppercase",
      marginBottom: 14, marginTop: 8,
      paddingLeft: 8, borderLeft: `2px solid ${P.accent}`,
    }}>{children}</div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData]       = useState(null);
  const [error, setError]     = useState(null);

  const handleUpload = async (file) => {
    setLoading(true);
    setError(null);
    setData(null);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: form,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (data) return <Dashboard data={data} onReset={() => setData(null)} />;

  return (
    <div>
      <UploadZone onUpload={handleUpload} loading={loading} />
      {error && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "#2D1515", border: "1px solid #7f1d1d",
          color: "#FCA5A5", borderRadius: 12,
          padding: "14px 24px", fontSize: 14, maxWidth: 480, textAlign: "center",
          zIndex: 9999,
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
