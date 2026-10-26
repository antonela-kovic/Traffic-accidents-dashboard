const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad2(n) {
  return String(n).padStart(2, "0");
}

export function deriveFields(date) {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const monthKey = `${year}-${month}`;

  const hour = date.getHours();
  const dayIndex = date.getDay(); // 0=Sun ... 6=Sat
  const dayOfWeek = DOW[dayIndex];

  const dateKey = `${year}-${month}-${pad2(date.getDate())}`; // YYYY-MM-DD

  return { monthKey, hour, dayIndex, dayOfWeek, dateKey };
}

export function normalizeAccident(raw) {
  if (!raw) return null;

  const dateTimeStr = raw.dateTime ?? raw.datetime ?? raw.DATE_TIME ?? raw.DateTime;
  const dt = new Date(dateTimeStr);
  if (Number.isNaN(dt.getTime())) return null;

  const lat = Number(raw.lat);
  const lon = Number(raw.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

  const severity = (raw.severity ?? "").toString().trim().toLowerCase();
  const cause = (raw.cause ?? "").toString().trim();
  const region = (raw.region ?? "").toString().trim();
  const city = (raw.city ?? "").toString().trim();

  const derived = deriveFields(dt);

  return {
    id: (raw.id ?? crypto.randomUUID()).toString(),
    dateTime: dt.toISOString(),
    ts: dt.getTime(),
    lat,
    lon,
    severity: severity || "unknown",
    cause: cause || "unknown",
    region: region || "unknown",
    city: city || "unknown",
    ...derived,
  };
}
