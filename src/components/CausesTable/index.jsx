import React, { useMemo, useState } from "react";
import { causeDisplay } from "../../lib/causeLabels";

function pct(n, total) {
  if (!total) return "0%";
  return ((n / total) * 100).toFixed(1) + "%";
}

export default function CausesTable({ data, totalCount, currentCause, dispatch }) {
  const [q, setQ] = useState("");
  const [topN, setTopN] = useState(20);

  const rows = useMemo(() => {
    const query = q.trim().toUpperCase();

    let arr = [...data].sort((a, b) => b.count - a.count);

    if (query) {
      arr = arr.filter((d) => (d.cause ?? "").toString().toUpperCase().includes(query));
    }

    return arr.slice(0, topN).map((d, idx) => ({
      rank: idx + 1,
      ...d,
    }));
  }, [data, q, topN]);

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
        <h3 style={{ margin: 0 }}>All causes</h3>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ display: "flex", gap: 6, alignItems: "center", margin: 0 }}>
            Search:
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder='e.g. "YIELD", "SIGNAL", "SPEED"'
              style={{ width: 220 }}
            />
          </label>

          <label style={{ display: "flex", gap: 6, alignItems: "center", margin: 0 }}>
            Top:
            <select value={topN} onChange={(e) => setTopN(Number(e.target.value))}>
              {[10, 20, 30, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>

          <button
            className="linkBtn"
            onClick={() => {
              setQ("");
              setTopN(20);
              dispatch({ type: "setCause", payload: "all" });
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="muted" style={{ marginTop: 8 }}>
        Active cause: <b>{currentCause === "all" ? "All" : causeDisplay(currentCause)}</b>
      </div>

      <div style={{ marginTop: 10, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>#</th>
              <th style={thStyleLeft}>Cause</th>
              <th style={thStyle}>Count</th>
              <th style={thStyle}>Share</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => {
              const active = currentCause !== "all" && currentCause === r.cause;
              return (
                <tr
                  key={r.cause}
                  style={{
                    background: active ? "rgba(0,0,0,0.04)" : "transparent",
                    borderTop: "1px solid #eee",
                  }}
                >
                  <td style={tdCenter}>{r.rank}</td>

                  <td style={tdLeft} title={r.cause}>
                    <div style={{ fontWeight: 600, lineHeight: 1.25 }} title={r.cause}>
                        {causeDisplay(r.cause)}
                   </div>

                  </td>

                  <td style={tdCenter}>{r.count}</td>
                  <td style={tdCenter}>{pct(r.count, totalCount)}</td>

                  <td style={tdCenter}>
                    <button
                      className="btn"
                      style={{ padding: "6px 10px" }}
                      onClick={() => dispatch({ type: "setCause", payload: r.cause })}
                    >
                      Filter
                    </button>
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 12, color: "#666" }}>
                  No causes match the search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="muted" style={{ marginTop: 10 }}>
        Tip: search for a keyword (e.g. YIELD, SIGNAL, SPEED) instead of scrolling through all categories.
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "center",
  padding: "10px 8px",
  borderBottom: "1px solid #ddd",
  whiteSpace: "nowrap",
};

const thStyleLeft = { ...thStyle, textAlign: "left" };

const tdCenter = {
  textAlign: "center",
  padding: "10px 8px",
  verticalAlign: "top",
  whiteSpace: "nowrap",
};

const tdLeft = {
  textAlign: "left",
  padding: "10px 8px",
  verticalAlign: "top",
  minWidth: 420,
};
