export function groupByDate(data) {
  const m = new Map();
  for (const d of data) m.set(d.dateKey, (m.get(d.dateKey) ?? 0) + 1);

  return Array.from(m.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }));
}

export function heatmapDayHour(data) {
  // 7 days (Sun=0..Sat=6) x 24 hours
  const matrix = Array.from({ length: 7 }, () => Array(24).fill(0));
  for (const d of data) {
    if (d.dayIndex >= 0 && d.dayIndex <= 6 && d.hour >= 0 && d.hour <= 23) {
      matrix[d.dayIndex][d.hour] += 1;
    }
  }
  return matrix;
}


export function groupByCauseWithOther(data, topN = 10) {
  const m = new Map();
  for (const d of data) m.set(d.cause, (m.get(d.cause) ?? 0) + 1);

  const sorted = Array.from(m.entries())
    .map(([cause, count]) => ({ cause, count }))
    .sort((a, b) => b.count - a.count);

  const head = sorted.slice(0, topN);
  const tail = sorted.slice(topN);

  const otherCount = tail.reduce((s, x) => s + x.count, 0);
  if (otherCount > 0) head.push({ cause: "OTHER (all remaining)", count: otherCount });

  return head;
}


// Placeholder values in the Chicago data that say nothing about the cause
const UNINFORMATIVE_CAUSES = new Set(["UNABLE TO DETERMINE", "NOT APPLICABLE", "unknown"]);

export function computeKpis(data) {
  const total = data.length;

  // Most common *known* cause (placeholders such as "UNABLE TO DETERMINE" are skipped)
  let topCause = "—";
  const causes = new Map();
  for (const d of data) {
    if (!UNINFORMATIVE_CAUSES.has(d.cause)) causes.set(d.cause, (causes.get(d.cause) ?? 0) + 1);
  }
  if (causes.size > 0) {
    topCause = Array.from(causes.entries()).sort((a, b) => b[1] - a[1])[0][0];
  }

  let peakHour = "—";
  if (total > 0) {
    const hours = Array(24).fill(0);
    for (const d of data) hours[d.hour] += 1;
    const idx = hours.reduce((best, v, i) => (v > hours[best] ? i : best), 0);
    peakHour = `${String(idx).padStart(2, "0")}:00`;
  }

  return { total, topCause, peakHour };
}


const SEVERITY_WEIGHT = {
  light: 1,
  serious: 3,
  fatal: 6,
  unknown: 1,
};

function severityWeight(sev) {
  const key = (sev ?? "unknown").toString().trim().toLowerCase();
  return SEVERITY_WEIGHT[key] ?? 1;
}

/**
 * Grid aggregation (hotspots).
 * cellDeg: cell size in degrees (0.01 is about 1.1 km in latitude; the width varies with longitude).
 * score: sum of severity weights, so serious and fatal accidents raise the risk of a cell more.
 * returns: [{ key, lat, lon, count, score }], sorted by score
 */
export function gridHotspots(data, cellDeg = 0.01) {
  const m = new Map();

  for (const d of data) {
    const lat = d.lat;
    const lon = d.lon;
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;

    const i = Math.floor(lat / cellDeg);
    const j = Math.floor(lon / cellDeg);
    const key = `${i}:${j}`;

    const centerLat = (i + 0.5) * cellDeg;
    const centerLon = (j + 0.5) * cellDeg;

    const w = severityWeight(d.severity);

    const prev = m.get(key);
    if (!prev) {
      m.set(key, { key, lat: centerLat, lon: centerLon, count: 1, score: w });
    } else {
      prev.count += 1;
      prev.score += w;
    }
  }

  return Array.from(m.values()).sort((a, b) => b.score - a.score);
}
