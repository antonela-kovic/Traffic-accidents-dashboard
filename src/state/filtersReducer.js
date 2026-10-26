export const initialFilters = {
  dateFrom: "", // YYYY-MM-DD
  dateTo: "",   // YYYY-MM-DD
  severities: new Set(["light", "serious", "fatal", "unknown"]),
  cause: "all",
  region: "all",
};

export function filtersReducer(state, action) {
  switch (action.type) {
    case "initFromData": {
      const { minDateKey, maxDateKey } = action.payload;
      return { ...state, dateFrom: minDateKey, dateTo: maxDateKey };
    }
    case "setDateRange":
      return { ...state, dateFrom: action.payload.dateFrom, dateTo: action.payload.dateTo };
    case "toggleSeverity": {
      const next = new Set(state.severities);
      if (next.has(action.payload)) next.delete(action.payload);
      else next.add(action.payload);
      return { ...state, severities: next };
    }
    case "setCause":
      return { ...state, cause: action.payload };
    case "setRegion":
      return { ...state, region: action.payload };
    case "reset":
      return action.payload; // full reset to computed initial
    default:
      return state;
  }
}
