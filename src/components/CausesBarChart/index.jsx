import React from "react";
import { causeDisplay } from "../../lib/causeLabels";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";



function CauseTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const raw = payload[0]?.payload?.cause;
  const count = payload[0].value;

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 10,
        minWidth: 280,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{label}</div>
      {raw && causeDisplay(raw) !== raw && (
        <div style={{ color: "#666", marginBottom: 6, fontSize: 12 }}>
          Original: {raw}
        </div>
      )}
      <div>
        Accidents: <b>{count}</b>
      </div>
      <div style={{ color: "#666", marginTop: 6 }}>
        Click a bar to filter by this cause.
      </div>
    </div>
  );
}

export default function CausesBarChart({ data, currentCause, dispatch, topN = 12 }) {
  // Top N for readability
  const sorted = [...data]
    .sort((a, b) => b.count - a.count)
    .slice(0, topN)
    .map((d) => ({
      ...d,
      causeLabel: causeDisplay(d.cause), // display only
    }));

  return (
    <div className="card">
      <h3>Most common causes (top {topN})</h3>

      <div style={{ width: "100%", height: 380 }}>
        <ResponsiveContainer>
          <BarChart
            data={sorted}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="causeLabel"
              width={280}
            />
            <Tooltip content={<CauseTooltip />} />
            <Bar
              dataKey="count"
              onClick={(bar) => {
                const cause = bar?.cause;
                if (!cause || cause.startsWith("OTHER")) return;
                dispatch({ type: "setCause", payload: cause });
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="muted">
        Active cause: <b>{currentCause === "all" ? "All" : causeDisplay(currentCause)}</b>{" "}
        <button
          className="linkBtn"
          onClick={() => dispatch({ type: "setCause", payload: "all" })}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
