// Converts /Users/andrew/Downloads/city_rows.csv (~140k rows of GeoNames
// cities exported from the old Supabase Twikka) into JSONL the Convex
// `npx convex import` command consumes.
//
// Usage:
//   node convex/seed/cities-build.mjs <input.csv> <output.jsonl>
//   npx convex import --table cities <output.jsonl>
//
// Quirk handled: the Supabase export double-wraps the alternatenames
// field. After CSV-decoding the field, we strip leading/trailing literal
// double-quotes before splitting on commas.

import { createReadStream, createWriteStream } from "node:fs";
import { createInterface } from "node:readline";

function parseCsvLine(line) {
  const out = [];
  let i = 0;
  let cur = "";
  let inQuotes = false;
  while (i < line.length) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      cur += ch;
      i++;
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (ch === ",") {
      out.push(cur);
      cur = "";
      i++;
      continue;
    }
    cur += ch;
    i++;
  }
  out.push(cur);
  return out;
}

function parseAlternateNames(raw) {
  if (!raw) return [];
  let s = raw.trim();
  // Strip one layer of leading/trailing literal double-quotes that
  // survive CSV decoding (Supabase export quirk).
  while (s.startsWith('"') && s.endsWith('"') && s.length >= 2) {
    s = s.slice(1, -1);
  }
  if (!s) return [];
  return s
    .split(",")
    .map((x) => x.trim())
    .filter((x) => x.length > 0);
}

const [, , inputPath, outputPath] = process.argv;
if (!inputPath || !outputPath) {
  console.error(
    "Usage: node cities-build.mjs <input.csv> <output.jsonl>",
  );
  process.exit(1);
}

const out = createWriteStream(outputPath);
const rl = createInterface({
  input: createReadStream(inputPath),
  crlfDelay: Infinity,
});

let header = null;
let rowCount = 0;
let written = 0;

for await (const line of rl) {
  if (!line.trim()) continue;
  const fields = parseCsvLine(line);
  if (!header) {
    header = fields;
    continue;
  }
  rowCount++;
  const [geonameid, name, asciiname, altRaw, lat, lng, cc, tz] = fields;
  const altNames = parseAlternateNames(altRaw);
  if (!geonameid || !name || !lat || !lng || !tz) continue;

  const haystack = [name, asciiname, ...altNames, cc].join(" ");
  out.write(
    JSON.stringify({
      geonameid: Number(geonameid),
      name,
      asciiname,
      alternatenames: altNames,
      latitude: Number(lat),
      longitude: Number(lng),
      countryCode: cc,
      timezone: tz,
      searchHaystack: haystack,
    }) + "\n",
  );
  written++;
}

out.end();
await new Promise((resolve) => out.on("finish", resolve));
console.log(`Read ${rowCount} rows, wrote ${written} JSONL records.`);
