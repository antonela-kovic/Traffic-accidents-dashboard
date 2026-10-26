function inDateRange(dateKey, from, to) {
  if (!from || !to) return true;
  return dateKey >= from && dateKey <= to; // works for YYYY-MM-DD lexicographically
}

export function applyFilters(data, filters) {
  return data.filter((d) => {
    if (!inDateRange(d.dateKey, filters.dateFrom, filters.dateTo)) return false;
    if (filters.severities && filters.severities.size > 0 && !filters.severities.has(d.severity)) return false;
    if (filters.cause !== "all" && d.cause !== filters.cause) return false;
    if (filters.region !== "all" && d.region !== filters.region) return false;
    return true;
  });
}

export function uniqueValues(data, key) {
  const set = new Set();
  for (const d of data) set.add(d[key]);
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function computeMinMaxDateKeys(data) {
  if (!data.length) return { minDateKey: "", maxDateKey: "" };
  const minDateKey = data[0].dateKey;
  const maxDateKey = data[data.length - 1].dateKey;
  return { minDateKey, maxDateKey };
}
