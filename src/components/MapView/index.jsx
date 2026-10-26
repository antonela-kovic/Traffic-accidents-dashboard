import React, { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";

function computeCenter(points) {
  if (!points.length) return [43.508, 16.439];
  let sumLat = 0, sumLon = 0;
  for (const p of points) { sumLat += p.lat; sumLon += p.lon; }
  return [sumLat / points.length, sumLon / points.length];
}

export default function MapView({
  dataPoints,
  hotspots,
  mapMode,
  setMapMode,
  cellDeg,
  setCellDeg,
}) {
  const center = useMemo(() => {
    const base = mapMode === "hotspots" ? hotspots : dataPoints;
    return computeCenter(base);
  }, [dataPoints, hotspots, mapMode]);

  const maxScore = useMemo(() => {
    if (!hotspots?.length) return 0;
    return hotspots.reduce((m, h) => Math.max(m, h.score), 0);
  }, [hotspots]);

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
        <h3 style={{ margin: 0 }}>Map</h3>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <label style={{ margin: 0, display: "flex", gap: 6, alignItems: "center" }}>
            View:
            <select value={mapMode} onChange={(e) => setMapMode(e.target.value)}>
              <option value="points">Points</option>
              <option value="hotspots">Hotspots (grid)</option>
            </select>
          </label>

          {mapMode === "hotspots" && (
            <label style={{ margin: 0, display: "flex", gap: 6, alignItems: "center" }}>
              Cell (°):
              <input
                type="number"
                step="0.005"
                min="0.005"
                max="0.05"
                value={cellDeg}
                onChange={(e) => setCellDeg(Number(e.target.value))}
                style={{ width: 90 }}
              />
            </label>
          )}
        </div>
      </div>

      <div className="mapWrap">
        <MapContainer center={center} zoom={11} preferCanvas style={{ height: "420px", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {mapMode === "points" && dataPoints.map((d) => (
            <CircleMarker key={d.id} center={[d.lat, d.lon]} radius={3} pathOptions={{ weight: 0, fillOpacity: 0.5 }}>
              <Tooltip>
                <div style={{ minWidth: 180 }}>
                  <div><b>{d.dateKey}</b> {String(d.hour).padStart(2, "0")}:00</div>
                  <div>Severity: {d.severity}</div>
                  <div>Cause: {d.cause}</div>
                  <div>{d.region} / {d.city}</div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}

          {mapMode === "hotspots" && hotspots.map((h) => {
            const t = maxScore === 0 ? 0 : h.score / maxScore; // 0..1
            const radius = 6 + 22 * t; // higher score => larger circle
            return (
              <CircleMarker key={h.key} center={[h.lat, h.lon]} radius={radius} pathOptions={{ fillOpacity: 0.35 }}>
                <Tooltip>
                  <div style={{ minWidth: 180 }}>
                    <div><b>Hotspot</b> (grid {cellDeg})</div>
                    <div>Accidents: {h.count}</div>
                    <div>Risk score: {h.score}</div>
                    <div>Centre: {h.lat.toFixed(4)}, {h.lon.toFixed(4)}</div>
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      <div className="muted">
        {mapMode === "hotspots"
          ? "Hotspots are aggregated on a grid; the risk score is weighted by accident severity (light 1, serious 3, fatal 6)."
          : "One point per accident (rendered on a canvas for speed)."}
      </div>
    </div>
  );
}
