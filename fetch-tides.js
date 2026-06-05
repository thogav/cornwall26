// ============================================================
// fetch-tides.js — Kjør én gang lokalt for å pre-cache alle
// tidevannsdata for turen og lagre dem i js/tides-preloaded.js
//
// Bruk: node fetch-tides.js
// ============================================================

const https = require("https");
const fs    = require("fs");
const path  = require("path");

const API_KEY = "a1990ce4-5f90-11f1-be7d-0242ac120004-a1990da2-5f90-11f1-be7d-0242ac120004";

// Alle unike lokasjoner for turen
const LOCATIONS = [
  { key: "lizard",   lat: 49.9985, lon: -5.2065, name: "Lizard / Housel Bay",  start: "2026-07-04", end: "2026-07-06" },
  { key: "stives",   lat: 50.2127, lon: -5.4806, name: "St. Ives",             start: "2026-07-06", end: "2026-07-10" },
  { key: "clovelly", lat: 50.9985, lon: -4.3978, name: "Clovelly / Bideford",  start: "2026-07-09", end: "2026-07-11" },
  { key: "looe",     lat: 50.3533, lon: -4.4567, name: "Looe",                 start: "2026-07-10", end: "2026-07-12" },
];

function fetchJson(url, apiKey) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { Authorization: apiKey } }, res => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    });
    req.on("error", reject);
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log("🌊 Henter tidevannsdata fra Stormglass...\n");
  const result = {};

  for (const loc of LOCATIONS) {
    const startISO = new Date(loc.start + "T00:00:00Z").toISOString();
    const endISO   = new Date(loc.end   + "T23:59:59Z").toISOString();
    const url = `https://api.stormglass.io/v2/tide/extremes/point?lat=${loc.lat}&lng=${loc.lon}&start=${startISO}&end=${endISO}`;

    console.log(`📍 Henter: ${loc.name} (${loc.start} → ${loc.end})...`);
    try {
      const json = await fetchJson(url, API_KEY);
      if (json.errors?.key === "API quota exceeded") {
        console.error(`   ❌ Kvote overskredet! Prøv igjen i morgen.`);
        process.exit(1);
      }
      if (!json.data?.length) {
        console.warn(`   ⚠️  Ingen data returnert for ${loc.name}`);
        continue;
      }
      const cacheKey = `tides_sg_${loc.lat}_${loc.lon}_${loc.start}`;
      result[cacheKey] = { fetchedAt: Date.now(), data: json.data };
      console.log(`   ✅ ${json.data.length} tidevannshendelser lagret`);
    } catch (err) {
      console.error(`   ❌ Feil: ${err.message}`);
    }

    // Vent litt mellom kall
    await sleep(500);
  }

  // Skriv til js/tides-preloaded.js
  const outPath = path.join(__dirname, "js", "tides-preloaded.js");
  const js = `// Auto-generert av fetch-tides.js — ikke rediger manuelt
// Oppdatert: ${new Date().toISOString()}
window.TIDES_PRELOADED = ${JSON.stringify(result, null, 2)};
`;
  fs.writeFileSync(outPath, js, "utf8");
  console.log(`\n✅ Ferdig! Lagret til js/tides-preloaded.js`);
  console.log(`   Commit filen og push til GitHub:\n`);
  console.log(`   git add js/tides-preloaded.js`);
  console.log(`   git commit -m "Pre-cache tidevannsdata for juli 2026"`);
  console.log(`   git push\n`);
}

main();
