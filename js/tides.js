// ============================================================
// TIDES.JS — Tidevann via Stormglass.io API
//
// OPPSETT (5 minutter):
// 1. Gå til https://stormglass.io og registrer gratis konto
// 2. Kopier API-nøkkelen fra dashbordet
// 3. Lim den inn nedenfor
//
// Gratis plan: 10 kall/dag — vi trenger kun 4 totalt (ett per
// lokasjon), og disse caches i 7 dager i nettleseren.
// ============================================================

const TIDES_API_KEY = "a1990ce4-5f90-11f1-be7d-0242ac120004-a1990da2-5f90-11f1-be7d-0242ac120004";   // ← Lim inn din Stormglass API-nøkkel her

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dagers cache

// ---- Hent tidevann fra Stormglass for én lokasjon og dato-periode ----
async function fetchTidesForLocation(lat, lon, startDate, endDate) {
  if (!TIDES_API_KEY) return null;

  const cacheKey = `tides_sg_${lat}_${lon}_${startDate}`;
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
    if (cached && (Date.now() - cached.fetchedAt) < CACHE_TTL_MS) {
      return cached.data;
    }
  } catch { /* ignorer */ }

  try {
    const startISO = new Date(startDate + "T00:00:00Z").toISOString();
    const endISO   = new Date(endDate   + "T23:59:59Z").toISOString();
    const url = `https://api.stormglass.io/v2/tide/extremes/point?lat=${lat}&lng=${lon}&start=${startISO}&end=${endISO}`;

    const res = await fetch(url, {
      headers: { Authorization: TIDES_API_KEY }
    });

    const json = await res.json();

    // Kvote overskredet — vis tydelig melding, ikke cache null-resultat
    if (json.errors?.key === "API quota exceeded") {
      console.warn("🌊 Stormglass: dagskvote (10 kall) brukt opp. Prøver igjen i morgen.");
      return null; // Ingen cache — prøver automatisk neste dag
    }

    if (!res.ok) { console.warn("Stormglass feil:", res.status, json); return null; }
    if (!json.data?.length) return null;

    localStorage.setItem(cacheKey, JSON.stringify({
      fetchedAt: Date.now(),
      data: json.data
    }));
    return json.data;
  } catch (err) {
    console.warn("Tidevann-feil:", err);
    return null;
  }
}

// ---- Hent tidevann for én dag ----
async function getTidesForDay(day) {
  if (!day?.tideCoords || !TIDES_API_KEY) return null;
  const { lat, lon } = day.tideCoords;
  // Hent ± 1 dag ekstra for god margin (bufrer natt til natt)
  const prevDate = new Date(day.date);
  prevDate.setDate(prevDate.getDate() - 1);
  const prev = prevDate.toISOString().slice(0, 10);
  return await fetchTidesForLocation(lat, lon, prev, day.date);
}

// ---- Forhåndshent tidevann for hele turen (samlet, én kall per unike lokasjon) ----
async function prefetchAllTides() {
  if (!TIDES_API_KEY) return;

  // Grupper dager per unike koordinat-nøkkel
  const groups = {};
  for (const day of TRIP.days) {
    if (!day.tideCoords) continue;
    const key = `${day.tideCoords.lat}_${day.tideCoords.lon}`;
    if (!groups[key]) groups[key] = { lat: day.tideCoords.lat, lon: day.tideCoords.lon, days: [] };
    groups[key].days.push(day.date);
  }

  for (const g of Object.values(groups)) {
    const sorted = g.days.sort();
    const startDate = sorted[0];
    const endDate   = sorted[sorted.length - 1];
    const cacheKey  = `tides_sg_${g.lat}_${g.lon}_${startDate}`;

    // Skip om cache er fersk
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
      if (cached && (Date.now() - cached.fetchedAt) < CACHE_TTL_MS) continue;
    } catch { /* */ }

    await fetchTidesForLocation(g.lat, g.lon, startDate, endDate);
    // Liten pause mellom kall for å være høflig mot API-et
    await new Promise(r => setTimeout(r, 300));
  }
}

// ---- Format én tidevannshendelse ----
function formatTideEvent(event) {
  const d = new Date(event.time);
  const time = d.toLocaleTimeString("nb-NO", {
    hour: "2-digit", minute: "2-digit",
    timeZone: "Europe/London"
  });
  const type   = event.type === "high" ? "High" : "Low";
  const label  = event.type === "high" ? "Høyvann" : "Lavvann";
  const icon   = event.type === "high" ? "arrow-up" : "arrow-down";
  const height = Number(event.height).toFixed(1);
  const dt     = d.getTime() / 1000;
  return { time, type, label, icon, height, dt };
}

// ---- Finn neste tidvann fra nå ----
function getNextTide(extremes) {
  if (!extremes?.length) return null;
  const nowMs = Date.now();
  const next = extremes
    .map(formatTideEvent)
    .find(e => e.dt * 1000 > nowMs);
  return next || null;
}

// ---- Filtrer tidevannshendelser for én bestemt dato ----
function filterTidesForDate(extremes, dateStr) {
  if (!extremes?.length) return [];
  return extremes.filter(e => {
    const d = new Date(e.time);
    const localDate = d.toLocaleDateString("sv-SE", { timeZone: "Europe/London" });
    return localDate === dateStr;
  }).map(formatTideEvent);
}

// ---- Bygg kompakt tidevannsbånd (brukes i dagkort) ----
function buildTideHtml(extremes, dateStr) {
  const events = dateStr ? filterTidesForDate(extremes, dateStr) : extremes.map(formatTideEvent);
  if (!events.length) return "";

  const items = events.slice(0, 5).map(e =>
    `<span class="tide-event tide-${e.type.toLowerCase()}">
       <span class="tide-arrow">${e.type === "High" ? "↑" : "↓"}</span>
       <span class="tide-time">${e.time}</span>
       <span class="tide-ht">${e.height}m</span>
     </span>`
  ).join("");

  return `
    <div class="tide-strip">
      <span class="tide-icon-wrap">${ic("waves", 14)}</span>
      <div class="tide-events">${items}</div>
    </div>`;
}

// ---- Geocoding via Nominatim (OpenStreetMap) — ingen API-nøkkel ----
async function geocodePlace(placeName) {
  if (!placeName?.trim()) return null;
  // countrycodes=gb begrenser til UK, trenger ikke mer kontekst
  const query = encodeURIComponent(placeName.trim());
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=gb`,
      { headers: { "User-Agent": "Cornwall2026TravelApp/1.0" } }
    );
    const data = await res.json();
    if (!data.length) return null;
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      displayName: data[0].display_name.split(",")[0] // Bare første del av navn
    };
  } catch { return null; }
}

// ---- Automatisk tidevann for brukertillagt aktivitet ----
// Kall denne etter at aktiviteten er lagret for å berike den med tidevann
async function enrichActivityWithTides(activity) {
  if (!TIDES_API_KEY || !activity.day) return activity;

  // Finn koordinater fra stedsnavn
  let coords = null;
  if (activity.lat && activity.lon) {
    coords = { lat: activity.lat, lon: activity.lon };
  } else if (activity.locationName) {
    coords = await geocodePlace(activity.locationName);
    if (coords) {
      activity.lat = coords.lat;
      activity.lon = coords.lon;
    }
  } else if (activity.name) {
    // Prøv med selve aktivitetsnavnet som fallback
    coords = await geocodePlace(activity.name);
    if (coords) {
      activity.lat = coords.lat;
      activity.lon = coords.lon;
    }
  }

  if (!coords) return activity;

  // Finn datoen for dagen aktiviteten tilhører
  const day = TRIP.days.find(d => d.day === Number(activity.day));
  if (!day) return activity;

  // Hent tidevann
  const tides = await fetchTidesForLocation(coords.lat, coords.lon, day.date, day.date);
  if (tides) {
    // Lagre tider på aktiviteten (kun for visning — lagres ikke i Supabase/localStorage)
    activity._tides = tides;
    // Oppdater localStorage-kopi om aktiviteten er lokal
    if (activity.local) {
      const stored = JSON.parse(localStorage.getItem("cornwall_activities") || "[]");
      const idx = stored.findIndex(a => String(a.id) === String(activity.id));
      if (idx >= 0) {
        stored[idx].lat = coords.lat;
        stored[idx].lon = coords.lon;
        localStorage.setItem("cornwall_activities", JSON.stringify(stored));
      }
    }
  }
  return activity;
}

// ---- Bygg "Neste tidevann"-chip for hjemskjerm ----
function buildNextTideChip(extremes) {
  const next = getNextTide(extremes);
  if (!next) return "";

  const diffMin = Math.round((next.dt - Date.now() / 1000) / 60);
  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;
  const timeLeft = h > 0 ? `${h} t ${m} min` : `${m} min`;

  return `
    <div class="tide-next-chip">
      ${ic("waves", 15)}
      <div>
        <span class="tide-next-label">${next.label} kl. ${next.time}</span>
        <span class="tide-next-height"> · ${next.height} m · om ${timeLeft}</span>
      </div>
    </div>`;
}
