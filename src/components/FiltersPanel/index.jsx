import React from "react";
import { causeDisplay } from "../../lib/causeLabels";


export default function FiltersPanel({
  filters,
  dispatch,
  causes = [],
  allRegions = [],
  allSeverities = ["light", "serious", "fatal", "unknown"],
}) {
  const minTo = filters.dateFrom || undefined; // "to" cannot be before "from"
  const maxFrom = filters.dateTo || undefined; // "from" cannot be after "to"
  return (
    <div className="card">
      <h3>Filters</h3>

      <div className="grid2">
        <label>
          From:
          <input
              type="date"
              value={filters.dateFrom}
              max={maxFrom}
              onChange={(e) => {
                const newFrom = e.target.value;
                // if the new "from" is after "to", move "to" as well
                const newTo =
                  filters.dateTo && newFrom && newFrom > filters.dateTo ? newFrom : filters.dateTo;

                dispatch({
                  type: "setDateRange",
                  payload: { dateFrom: newFrom, dateTo: newTo },
                });
              }}
            />
        </label>

        <label>
          To:
          <input
            type="date"
            value={filters.dateTo}
            min={minTo}
            onChange={(e) => {
              const newTo = e.target.value;
              // if the new "to" is before "from", move "from" as well
              const newFrom =
                filters.dateFrom && newTo && newTo < filters.dateFrom ? newTo : filters.dateFrom;

              dispatch({
                type: "setDateRange",
                payload: { dateFrom: newFrom, dateTo: newTo },
              });
            }}
          />
        </label>
      </div>

      <label>
        Region:
        <select value={filters.region} onChange={(e) => dispatch({ type: "setRegion", payload: e.target.value })}>
          <option value="all">All</option>
          {allRegions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </label>

      <label>
        Cause:
        <select
          value={filters.cause}
          onChange={(e) => dispatch({ type: "setCause", payload: e.target.value })}
        >
          <option value="all">All</option>
          {(causes ?? []).map((c) => (
            <option key={c} value={c} title={c}>
              {causeDisplay(c)}
            </option>
          ))}
        </select>
      </label>

      <div className="severities">
        <div className="muted">Severity:</div>
        {allSeverities.map((s) => (
          <label key={s} className="checkbox">
            <input
              type="checkbox"
              checked={filters.severities.has(s)}
              onChange={() => dispatch({ type: "toggleSeverity", payload: s })}
            />
            {s}
          </label>
        ))}
      </div>

      <button
        className="btn"
        onClick={() => {
          dispatch({ type: "setCause", payload: "all" });
          dispatch({ type: "setRegion", payload: "all" });
        }}
      >
        Clear cause and region
      </button>
    </div>
  );
}
