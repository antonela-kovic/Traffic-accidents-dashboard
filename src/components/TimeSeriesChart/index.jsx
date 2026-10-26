import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Brush
} from "recharts";

export default function TimeSeriesChart({ series, dispatch }) {
  return (
    <div className="card">
      <h3>Accidents over time</h3>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={series} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" minTickGap={20} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" dot={false} />
            <Brush
              dataKey="date"
              height={30}
              travellerWidth={10}
              onChange={(range) => {
                if (!range || range.startIndex == null || range.endIndex == null) return;
                const start = series[range.startIndex]?.date;
                const end = series[range.endIndex]?.date;
                if (start && end) dispatch({ type: "setDateRange", payload: { dateFrom: start, dateTo: end } });
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="muted">Tip: drag the handles below the chart to filter all views by date.</div>
    </div>
  );
}
