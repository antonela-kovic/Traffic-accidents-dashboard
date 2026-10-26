import Papa from "papaparse";
import { normalizeAccident } from "./transforms";

export async function loadAccidentsFromCsvPublic(path = "/data/accidents_sample.csv") {
  const text = await fetch(path).then((r) => r.text());
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });

  return parsed.data
    .map(normalizeAccident)
    .filter(Boolean)
    .sort((a, b) => a.ts - b.ts);
}
