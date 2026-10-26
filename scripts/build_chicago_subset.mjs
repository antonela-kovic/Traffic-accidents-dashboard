// Downloads a subset of the City of Chicago "Traffic Crashes - Crashes" open dataset
// and converts it to the format the dashboard reads (public/data/accidents.csv).
//
// Usage: npm run data:chicago -- --year 2023 --limit 30000
// (defaults: year 2024, limit 20000)
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import Papa from "papaparse";

const { values: args } = parseArgs({
  options: {
    year: { type: "string", default: process.env.YEAR ?? "2024" },
    limit: { type: "string", default: process.env.LIMIT ?? "20000" },
  },
});
const YEAR = args.year;
const LIMIT = Number(args.limit);

// Socrata resource endpoint (query-friendly)
const BASE = "https://data.cityofchicago.org/resource/85ca-t3if.csv";

// Output (overwrites the existing accidents.csv)
const OUT_PATH = path.resolve("public", "data", "accidents.csv");

function buildUrl() {
  // Request only the columns that are needed (smaller response, fewer 400 errors)
  const selectCols = [
    "crash_record_id",
    "crash_date",
    "latitude",
    "longitude",
    "most_severe_injury",
    "prim_contributory_cause",
  ];

  // Date format without milliseconds (more reliable with the API)
  const from = `${YEAR}-01-01T00:00:00`;
  const to = `${Number(YEAR) + 1}-01-01T00:00:00`;

  const where = [
    `crash_date >= '${from}'`,
    `crash_date < '${to}'`,
    `latitude IS NOT NULL`,
    `longitude IS NOT NULL`,
  ].join(" AND ");

  const params = new URLSearchParams();
  params.set("$select", selectCols.join(","));
  params.set("$where", where);
  params.set("$limit", String(LIMIT));

  return `${BASE}?${params.toString()}`;
}

function normalizeSeverity(mostSevereInjury) {
  const s = String(mostSevereInjury ?? "").toUpperCase();
  if (s.includes("FATAL")) return "fatal";
  if (s.includes("INCAPACITATING")) return "serious";
  if (
    s.includes("NONINCAPACITATING") ||
    s.includes("REPORTED") ||
    s.includes("NO INDICATION")
  )
    return "light";
  return "unknown";
}

async function downloadCsv(url) {
  console.log("GET:", url);

  const res = await fetch(url, {
    headers: {
      // some public data portals reject requests without these headers
      Accept: "text/csv",
      "User-Agent": "Mozilla/5.0",
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Download failed: ${res.status} ${res.statusText}\n\nServer response:\n${body.slice(
        0,
        2000
      )}`
    );
  }

  return await res.text();
}

function toAccidentRows(chicagoRows) {
  return chicagoRows
    .map((r) => {
      const lat = Number(r.latitude);
      const lon = Number(r.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

      return {
        id: r.crash_record_id,
        dateTime: r.crash_date, // the app derives hour, weekday and month from this
        lat,
        lon,
        severity: normalizeSeverity(r.most_severe_injury),
        cause: r.prim_contributory_cause || "unknown",
        region: "Chicago",
        city: "Chicago",
      };
    })
    .filter(Boolean);
}

async function main() {
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });

  const url = buildUrl();
  const csvText = await downloadCsv(url);

  const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
  if (parsed.errors?.length) {
    console.warn("Papa parse warnings:", parsed.errors.slice(0, 5));
  }

  const accidents = toAccidentRows(parsed.data);

  const outCsv = Papa.unparse(accidents, {
    columns: ["id", "dateTime", "lat", "lon", "severity", "cause", "region", "city"],
  });

  fs.writeFileSync(OUT_PATH, outCsv, "utf-8");
  console.log(`OK: wrote ${accidents.length} rows -> ${OUT_PATH}`);
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
