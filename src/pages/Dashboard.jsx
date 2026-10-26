import React, { useEffect, useMemo, useReducer, useState } from "react";
import { loadAccidentsFromCsvPublic } from "../lib/dataLoaders";
import { initialFilters, filtersReducer } from "../state/filtersReducer";
import { applyFilters, computeMinMaxDateKeys, uniqueValues } from "../state/selectors";
import { groupByDate, heatmapDayHour, groupByCauseWithOther, computeKpis, gridHotspots } from "../lib/aggregations";
import { downloadCsv } from "../lib/exportCsv";

import FiltersPanel from "../components/FiltersPanel";
import KPIHeader from "../components/KPIHeader";
import MapView from "../components/MapView";
import TimeSeriesChart from "../components/TimeSeriesChart";
import HeatmapChart from "../components/HeatmapChart";
import CausesBarChart from "../components/CausesBarChart";
import CausesTable from "../components/CausesTable";

export default function Dashboard() {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, dispatch] = useReducer(filtersReducer, initialFilters);

  const [mapMode, setMapMode] = useState("points"); // "points" | "hotspots"
  const [cellDeg, setCellDeg] = useState(0.01); // grid cell size in degrees

  useEffect(() => {
    (async () => {
      setLoading(true);
      const rows = await loadAccidentsFromCsvPublic("/data/accidents.csv");
      setAllData(rows);

      const { minDateKey, maxDateKey } = computeMinMaxDateKeys(rows);
      dispatch({ type: "initFromData", payload: { minDateKey, maxDateKey } });

      setLoading(false);
    })();
  }, []);

  const allCauses = useMemo(() => uniqueValues(allData, "cause"), [allData]);
  const allRegions = useMemo(() => uniqueValues(allData, "region"), [allData]);

  const filtered = useMemo(() => applyFilters(allData, filters), [allData, filters]);
  const hotspots = useMemo(() => {
    if (mapMode !== "hotspots") return [];
    return gridHotspots(filtered, cellDeg).slice(0, 300); // limit the number of circles for rendering speed
  }, [filtered, mapMode, cellDeg]);

  const series = useMemo(() => groupByDate(filtered), [filtered]);
  const heat = useMemo(() => heatmapDayHour(filtered), [filtered]);
  const causes = useMemo(() => groupByCauseWithOther(filtered, 12), [filtered]);
  const allCauseCounts = useMemo(() => groupByCauseWithOther(filtered, Infinity), [filtered]);
  const kpis = useMemo(() => computeKpis(filtered), [filtered]);

  if (loading) return <div className="page"><h2>Loading…</h2></div>;

  return (
    <div className="page">
      <h1>Traffic Accidents and Risk Zones</h1>
      <div style={{ marginBottom: 12, display: "flex", gap: 10 }}>
        <button className="btn" onClick={() => downloadCsv(filtered, "accidents_filtered.csv")}>
          Export CSV (current filter)
        </button>
      </div>
      <KPIHeader kpis={kpis} />

      <div className="layout">
        <div className="left">
          <FiltersPanel
            filters={filters}
            dispatch={dispatch}
            causes={allCauses}
            allRegions={allRegions}
          />
          <MapView
            dataPoints={filtered}
            hotspots={hotspots}
            mapMode={mapMode}
            setMapMode={setMapMode}
            cellDeg={cellDeg}
            setCellDeg={setCellDeg}
          />
        </div>

        <div className="right">
          <TimeSeriesChart series={series} dispatch={dispatch} />
          <HeatmapChart matrix={heat} />
          <CausesBarChart data={causes} currentCause={filters.cause} dispatch={dispatch} />
          <CausesTable data={allCauseCounts} totalCount={filtered.length} currentCause={filters.cause} dispatch={dispatch} />
        </div>
      </div>
    </div>
  );
}
