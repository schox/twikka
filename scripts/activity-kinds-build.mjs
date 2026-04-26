// Builds the activity_kinds JSONL for `npx convex import` from the
// CoPA Supabase exports + a curated platform-type mapping.
//
// Usage:
//   node scripts/activity-kinds-build.mjs <out.jsonl>
//   npx convex import --table activity_kinds <out.jsonl>
//
// Inputs (paths are hard-coded for now — they live in /Users/andrew/Downloads):
//   coa_class_rows.csv     - 3 rows: 1=Adult, 2=Older Adult, 3=Wheel Chair
//   coa_heading_rows.csv   - 28 rows: id → heading name
//   coa_activity_rows.csv  - 1322 rows: copaCode + METs + name + headingId + classId
//
// Output:
//   1322 + N JSONL records, where N is the count of HealthWorkoutActivityType
//   enums that didn't have a clean CoPA match (synthetic platform_only rows).

import { createReadStream, createWriteStream } from "node:fs";
import { createInterface } from "node:readline";

const CLASS_CSV = "/Users/andrew/Downloads/coa_class_rows.csv";
const HEADING_CSV = "/Users/andrew/Downloads/coa_heading_rows.csv";
const ACTIVITY_CSV = "/Users/andrew/Downloads/coa_activity_rows.csv";

// ── CSV parsing ───────────────────────────────────────────────────────

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

async function readCsv(path) {
  const rl = createInterface({
    input: createReadStream(path),
    crlfDelay: Infinity,
  });
  let header = null;
  const rows = [];
  for await (const line of rl) {
    if (!line.trim()) continue;
    const fields = parseCsvLine(line);
    if (!header) {
      header = fields;
      continue;
    }
    rows.push(fields);
  }
  return { header, rows };
}

// ── Heading → flag rules ──────────────────────────────────────────────
// Defaults applied per-heading. Per-row overrides come below.
// Reviewer note: these are best-effort. A heading is rarely homogeneous
// (e.g. "Conditioning Exercise" includes yoga AND HIIT). The override
// table corrects the most-significant outliers.
const HEADING_FLAGS = {
  "Video Games": { isCardio: false, isStrength: false, isMobility: false, isBalance: false, isMental: true },
  "Bicycling": { isCardio: true, isStrength: false, isMobility: false, isBalance: false, isMental: false },
  "Sports": { isCardio: true, isStrength: false, isMobility: false, isBalance: false, isMental: false },
  "Sport/recreation": { isCardio: true, isStrength: false, isMobility: false, isBalance: false, isMental: false },
  "Sports/recreation": { isCardio: true, isStrength: false, isMobility: false, isBalance: false, isMental: false },
  "Home Activities": { isCardio: false, isStrength: false, isMobility: true, isBalance: false, isMental: false },
  "Conditioning Exercise": { isCardio: true, isStrength: true, isMobility: false, isBalance: false, isMental: false },
  "Conditioning Activities": { isCardio: true, isStrength: true, isMobility: false, isBalance: false, isMental: false },
  "Self Care": { isCardio: false, isStrength: false, isMobility: true, isBalance: false, isMental: false },
  "Winter Activities": { isCardio: true, isStrength: false, isMobility: false, isBalance: true, isMental: false },
  "Fishing & Hunting": { isCardio: false, isStrength: false, isMobility: true, isBalance: false, isMental: false },
  "Running": { isCardio: true, isStrength: false, isMobility: false, isBalance: false, isMental: false },
  "Inactivity": { isCardio: false, isStrength: false, isMobility: false, isBalance: false, isMental: false },
  "Water Activities": { isCardio: true, isStrength: false, isMobility: false, isBalance: false, isMental: false },
  "Home Repair": { isCardio: false, isStrength: true, isMobility: true, isBalance: false, isMental: false },
  "Exercise": { isCardio: true, isStrength: false, isMobility: false, isBalance: false, isMental: false },
  "Miscellaneous": { isCardio: false, isStrength: false, isMobility: false, isBalance: false, isMental: false },
  "Music Playing": { isCardio: false, isStrength: false, isMobility: true, isBalance: false, isMental: true },
  "Household activities": { isCardio: false, isStrength: false, isMobility: true, isBalance: false, isMental: false },
  "Lawn & Garden": { isCardio: false, isStrength: false, isMobility: true, isBalance: false, isMental: false },
  "Lawn and Garden": { isCardio: false, isStrength: false, isMobility: true, isBalance: false, isMental: false },
  "Dancing": { isCardio: true, isStrength: false, isMobility: false, isBalance: true, isMental: false },
  "Volunteer Activities": { isCardio: false, isStrength: false, isMobility: false, isBalance: false, isMental: false },
  "Walking": { isCardio: true, isStrength: false, isMobility: false, isBalance: false, isMental: false },
  "Sexual Activity": { isCardio: true, isStrength: false, isMobility: false, isBalance: false, isMental: false },
  "Religious Activities": { isCardio: false, isStrength: false, isMobility: false, isBalance: false, isMental: false },
  "Transportation": { isCardio: false, isStrength: false, isMobility: false, isBalance: false, isMental: false },
  "Occupation": { isCardio: false, isStrength: false, isMobility: false, isBalance: false, isMental: false },
};

// Per-row flag overrides for activities the heading default gets wrong.
// Keyed by copaCode.
const ROW_FLAG_OVERRIDES = {
  // Yoga family — under "Conditioning Exercise" (defaults cardio+strength)
  // but really mobility+mental.
  2150: { isCardio: false, isStrength: false, isMobility: true, isBalance: false, isMental: true },
  2153: { isCardio: false, isStrength: true, isMobility: true, isBalance: false, isMental: true },
  2155: { isCardio: false, isStrength: false, isMobility: true, isBalance: false, isMental: true },
  2160: { isCardio: false, isStrength: true, isMobility: true, isBalance: false, isMental: true },
  2170: { isCardio: false, isStrength: false, isMobility: true, isBalance: false, isMental: true },
  2175: { isCardio: false, isStrength: false, isMobility: true, isBalance: false, isMental: true },
  2180: { isCardio: false, isStrength: false, isMobility: true, isBalance: false, isMental: true },
  2185: { isCardio: false, isStrength: false, isMobility: true, isBalance: false, isMental: true },
  // Pilates — same story
  2103: { isCardio: false, isStrength: true, isMobility: true, isBalance: false, isMental: false },
  2105: { isCardio: false, isStrength: true, isMobility: true, isBalance: false, isMental: false },
  // Stretching
  2101: { isCardio: false, isStrength: false, isMobility: true, isBalance: false, isMental: false },
  // Strength training
  2052: { isCardio: false, isStrength: true, isMobility: false, isBalance: false, isMental: false },
  2056: { isCardio: false, isStrength: true, isMobility: false, isBalance: false, isMental: false },
  // Tai Chi (heading "Sports" defaults cardio; really balance+mental)
  15670: { isCardio: false, isStrength: false, isMobility: true, isBalance: true, isMental: true },
};

// ── Platform mapping ──────────────────────────────────────────────────
//
// Maps each value of HealthWorkoutActivityType (the unified enum from
// the `health` Flutter package) to a CoPA copaCode. Best-effort: where
// CoPA has multiple variants, we pick the most general one. Where CoPA
// has no obvious match, copaCode is null and a synthetic platform_only
// row is created with the supplied displayName + mets.
//
// REVIEWER: please redline. Each entry is one of:
//   { type, copaCode }                      — exact CoPA mapping
//   { type, copaCode, note }                — exact mapping with reasoning
//   { type, copaCode: null, name, mets }    — no CoPA match, synthesise a row
const PLATFORM_MAP = [
  { type: "AMERICAN_FOOTBALL", copaCode: 15210, note: "Football, competitive" },
  { type: "ARCHERY", copaCode: 15010, note: "Archery, non-hunting" },
  { type: "AUSTRALIAN_FOOTBALL", copaCode: 15230, note: "Football, touch, flag, general — no AFL row in CoPA" },
  { type: "BADMINTON", copaCode: 15020, note: "Badminton, competitive (Taylor 450)" },
  { type: "BARRE", copaCode: null, name: "Barre", mets: 4 },
  { type: "BASEBALL", copaCode: 15620, note: "Softball or baseball, fast or slow pitch, moderate" },
  { type: "BASKETBALL", copaCode: 15055, note: "Basketball, general" },
  { type: "BIKING", copaCode: 1014, note: "Bicycling, general" },
  { type: "BIKING_STATIONARY", copaCode: 1200, note: "Bicycling, stationary, general" },
  { type: "BOWLING", copaCode: 15090, note: "Bowling (Taylor 390)" },
  { type: "BOXING", copaCode: 15100, note: "Boxing, in ring, general" },
  { type: "CALISTHENICS", copaCode: 2030 },
  { type: "CARDIO_DANCE", copaCode: 2005, note: "Aerobic dance, low impact, moderate" },
  { type: "CLIMBING", copaCode: 15533, note: "Rock or mountain climbing (Taylor 060)" },
  { type: "COOLDOWN", copaCode: 2101, note: "Stretching, mild" },
  { type: "CORE_TRAINING", copaCode: 2030, note: "Calisthenics, light/moderate" },
  { type: "CRICKET", copaCode: 15150, note: "Cricket, batting, bowling, fielding" },
  { type: "CROSS_COUNTRY_SKIING", copaCode: 19090, note: "Skiing, cross country, 4-4.9 mph, moderate" },
  { type: "CROSS_TRAINING", copaCode: 2035, note: "Circuit training, moderate effort" },
  { type: "CURLING", copaCode: 15170, note: "Curling" },
  { type: "DANCING", copaCode: 3070, note: "Contemporary dancing, general" },
  { type: "DISC_SPORTS", copaCode: 15230, note: "Frisbee, ultimate" },
  { type: "DOWNHILL_SKIING", copaCode: 19160, note: "Skiing, downhill, alpine or snowboarding, moderate" },
  { type: "ELLIPTICAL", copaCode: 2048 },
  { type: "EQUESTRIAN_SPORTS", copaCode: 15370 },
  { type: "FENCING", copaCode: 15200 },
  { type: "FISHING", copaCode: 4001 },
  { type: "FITNESS_GAMING", copaCode: 1010, note: "Bicycling games (closest active-gaming)" },
  { type: "FLEXIBILITY", copaCode: 2101 },
  { type: "FRISBEE_DISC", copaCode: 15230 },
  { type: "FUNCTIONAL_STRENGTH_TRAINING", copaCode: 2052, note: "Resistance/weight lifting" },
  { type: "GOLF", copaCode: 15265, note: "Golf, general" },
  { type: "GUIDED_BREATHING", copaCode: null, name: "Guided breathing", mets: 1.3 },
  { type: "GYMNASTICS", copaCode: 15300 },
  { type: "HAND_CYCLING", copaCode: null, name: "Hand cycling (wheelchair)", mets: 6 },
  { type: "HANDBALL", copaCode: 15320 },
  { type: "HIGH_INTENSITY_INTERVAL_TRAINING", copaCode: 2040, note: "Circuit training including kettlebells, vigorous" },
  { type: "HIKING", copaCode: 17080, note: "Hiking, cross country" },
  { type: "HOCKEY", copaCode: 15350, note: "Hockey, field — generic HOCKEY default; ice-hockey users will need a different mapping" },
  { type: "HUNTING", copaCode: 4100 },
  { type: "ICE_SKATING", copaCode: 19030, note: "Skating, ice, dancing, general" },
  { type: "JUMP_ROPE", copaCode: 2068 },
  { type: "KICKBOXING", copaCode: 15430 },
  { type: "LACROSSE", copaCode: 15460, note: "Lacrosse" },
  { type: "MARTIAL_ARTS", copaCode: 15430 },
  { type: "MIND_AND_BODY", copaCode: 2150, note: "Yoga, Hatha — broad bucket" },
  { type: "MIXED_CARDIO", copaCode: 2065, note: "Stair treadmill ergometer, general — 'mixed' is fuzzy" },
  { type: "OTHER", copaCode: null, name: "Other workout", mets: 4 },
  { type: "PADDLE_SPORTS", copaCode: 18070, note: "Canoeing/rowing for pleasure" },
  { type: "PARAGLIDING", copaCode: 15503 },
  { type: "PICKLEBALL", copaCode: 1552560 },
  { type: "PILATES", copaCode: 2105 },
  { type: "PLAY", copaCode: null, name: "Active play", mets: 4 },
  { type: "PREPARATION_AND_RECOVERY", copaCode: 2101 },
  { type: "RACQUETBALL", copaCode: 15530, note: "Racquetball, casual, general" },
  { type: "ROCK_CLIMBING", copaCode: 15533 },
  { type: "ROWING", copaCode: 18050, note: "Canoeing, rowing 4-5.9 mph, moderate" },
  { type: "ROWING_MACHINE", copaCode: 2071, note: "Rowing, stationary ergometer, moderate" },
  { type: "RUGBY", copaCode: 15560, note: "Rugby, union, team, competitive" },
  { type: "RUNNING", copaCode: 12030 },
  { type: "RUNNING_TREADMILL", copaCode: 12028, note: "Running, 4mph (also broadly 'run on level')" },
  { type: "SAILING", copaCode: 18120 },
  { type: "SCUBA_DIVING", copaCode: 18200 },
  { type: "SKATING", copaCode: 15592, note: "Roller blading / inline skating, moderate" },
  { type: "SKIING", copaCode: 19075, note: "Skiing, general — broad" },
  { type: "SNOWBOARDING", copaCode: 19201 },
  { type: "SNOWSHOEING", copaCode: null, name: "Snowshoeing", mets: 5.3 },
  { type: "SNOW_SPORTS", copaCode: 19075, note: "Skiing, general" },
  { type: "SOCCER", copaCode: 15610 },
  { type: "SOCIAL_DANCE", copaCode: 3038, note: "Ballroom dancing, competitive" },
  { type: "SOFTBALL", copaCode: 15620, note: "Softball/Baseball, fast or slow pitch — verify" },
  { type: "SQUASH", copaCode: 15652 },
  { type: "STAIRS", copaCode: 17131 },
  { type: "STAIR_CLIMBING", copaCode: 17131 },
  { type: "STAIR_CLIMBING_MACHINE", copaCode: 2065 },
  { type: "STEP_TRAINING", copaCode: 2004, note: "Bench step class, general" },
  { type: "STRENGTH_TRAINING", copaCode: 2052 },
  { type: "SURFING", copaCode: 18220 },
  { type: "SWIMMING", copaCode: 18310, note: "Swimming, leisurely, general" },
  { type: "SWIMMING_OPEN_WATER", copaCode: 18310, note: "Same as SWIMMING — leisurely default" },
  { type: "SWIMMING_POOL", copaCode: 18310 },
  { type: "TABLE_TENNIS", copaCode: 15660, note: "Table tennis, ping pong" },
  { type: "TAI_CHI", copaCode: 15670 },
  { type: "TENNIS", copaCode: 15675 },
  { type: "TRACK_AND_FIELD", copaCode: 15733, note: "Track and field — jumps. RUNNING already covers track running" },
  { type: "TRADITIONAL_STRENGTH_TRAINING", copaCode: 2052 },
  { type: "UNDERWATER_DIVING", copaCode: 18200, note: "Skindiving / scuba diving" },
  { type: "VOLLEYBALL", copaCode: 15711 },
  { type: "WALKING", copaCode: 17190 },
  { type: "WALKING_TREADMILL", copaCode: 17255, note: "Walking, self-selected speed, indoor track or outdoors" },
  { type: "WATER_FITNESS", copaCode: null, name: "Water fitness / aerobics", mets: 5.5 },
  { type: "WATER_POLO", copaCode: null, name: "Water polo", mets: 10 },
  { type: "WATER_SPORTS", copaCode: 18120, note: "Sailing/board sailing, general — broad" },
  { type: "WEIGHTLIFTING", copaCode: 2052 },
  { type: "WHEELCHAIR", copaCode: null, name: "Wheelchair propulsion", mets: 4 },
  { type: "WHEELCHAIR_RUN_PACE", copaCode: null, name: "Wheelchair, run pace", mets: 6 },
  { type: "WHEELCHAIR_WALK_PACE", copaCode: null, name: "Wheelchair, walk pace", mets: 3 },
  { type: "WRESTLING", copaCode: 15730 },
  { type: "YOGA", copaCode: 2150 },
];

// ── Build ─────────────────────────────────────────────────────────────

const [, , outputPath] = process.argv;
if (!outputPath) {
  console.error("Usage: node activity-kinds-build.mjs <out.jsonl>");
  process.exit(1);
}

const cls = await readCsv(CLASS_CSV);
const heading = await readCsv(HEADING_CSV);
const activity = await readCsv(ACTIVITY_CSV);

const classNameById = new Map(cls.rows.map((r) => [Number(r[0]), r[2]]));
const headingNameById = new Map(heading.rows.map((r) => [Number(r[0]), r[2]]));

function coaClassSlug(name) {
  switch (name) {
    case "Adult":
      return "adult";
    case "Older Adult":
      return "older_adult";
    case "Wheel Chair":
      return "wheelchair";
    default:
      throw new Error(`Unknown coa class: ${name}`);
  }
}

const out = createWriteStream(outputPath);
const now = Date.now();

// Build a copaCode → row index for the platform overlay.
const rowsByCopaCode = new Map();

let kept = 0;
for (const r of activity.rows) {
  // CSV columns: activity_code, met, activity_description, id, heading, class
  const [copaCodeStr, metStr, name, , headingIdStr, classIdStr] = r;
  const copaCode = Number(copaCodeStr);
  const mets = Number(metStr);
  const headingId = Number(headingIdStr);
  const classId = Number(classIdStr);
  const headingName = headingNameById.get(headingId) ?? "Miscellaneous";
  const className = classNameById.get(classId);
  if (!name || !className) continue;

  const headingFlags = HEADING_FLAGS[headingName] ?? {
    isCardio: false,
    isStrength: false,
    isMobility: false,
    isBalance: false,
    isMental: false,
  };
  const flags = ROW_FLAG_OVERRIDES[copaCode] ?? headingFlags;

  const row = {
    copaCode,
    name: name.trim(),
    mets,
    headingId,
    headingName,
    coaClass: coaClassSlug(className),
    isCardio: flags.isCardio,
    isStrength: flags.isStrength,
    isMobility: flags.isMobility,
    isBalance: flags.isBalance,
    isMental: flags.isMental,
    platformTypes: [],
    aliases: [],
    source: "copa",
    needsReview: false,
    createdAt: now,
    updatedAt: now,
  };
  rowsByCopaCode.set(copaCode, row);
  kept++;
}

// Apply platform overlay.
const platformOnly = [];
for (const m of PLATFORM_MAP) {
  if (m.copaCode == null) {
    platformOnly.push({
      copaCode: undefined,
      name: m.name,
      mets: m.mets,
      headingId: undefined,
      headingName: "Platform-only",
      coaClass: "adult",
      isCardio: false,
      isStrength: false,
      isMobility: false,
      isBalance: false,
      isMental: false,
      platformTypes: [m.type],
      aliases: [],
      source: "platform_only",
      needsReview: true,
      createdAt: now,
      updatedAt: now,
    });
    continue;
  }
  const row = rowsByCopaCode.get(m.copaCode);
  if (!row) {
    console.warn(
      `WARN: platform map references unknown copaCode ${m.copaCode} for ${m.type}`,
    );
    continue;
  }
  row.platformTypes.push(m.type);
}

// Write all rows.
let written = 0;
for (const row of rowsByCopaCode.values()) {
  out.write(JSON.stringify(row) + "\n");
  written++;
}
for (const row of platformOnly) {
  out.write(JSON.stringify(row) + "\n");
  written++;
}

out.end();
await new Promise((resolve) => out.on("finish", resolve));

const mappedCount = PLATFORM_MAP.filter((m) => m.copaCode != null).length;
const syntheticCount = platformOnly.length;
console.log(
  `CoPA rows kept: ${kept}\n` +
    `Platform mappings applied: ${mappedCount}\n` +
    `Synthetic platform_only rows: ${syntheticCount}\n` +
    `Total JSONL written: ${written}`,
);
