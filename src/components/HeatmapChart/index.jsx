import React, { useMemo } from "react";

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function HeatmapChart({ matrix }) {
  const maxVal = useMemo(() => {
    let m = 0;
    for (const row of matrix) for (const v of row) m = Math.max(m, v);
    return m;
  }, [matrix]);

  return (
    <div className="card">
      <h3>Heatmap (day × hour)</h3>

      <div className="heatmap">
        <div className="heatmapHeader">
          <div />
          {Array.from({ length: 24 }, (_, h) => (
            <div key={h} className="heatmapTick">{h}</div>
          ))}
        </div>

        {matrix.map((row, dayIndex) => (
          <div key={dayIndex} className="heatmapRow">
            <div className="heatmapLabel">{DOW[dayIndex]}</div>
            {row.map((v, h) => {
              const t = maxVal === 0 ? 0 : v / maxVal; // 0..1
              return (
                <div
                  key={h}
                  className="heatCell"
                  title={`${DOW[dayIndex]} @ ${String(h).padStart(2, "0")}:00 → ${v}`}
                  style={{
                    background: `rgba(0, 0, 0, ${0.08 + 0.85 * t})`,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="muted">Hover for values. Darker = more accidents.</div>
    </div>
  );
}
