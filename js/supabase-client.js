// ============================================================
// SUPABASE-KONFIGURASJON
// ============================================================

const SUPABASE_URL = "https://ptammaxltnsdyjsdtwyj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0YW1tYXhsdG5zZHlqc2R0d3lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MTI5ODQsImV4cCI6MjA5NjA4ODk4NH0.ZU6HqyXiNniL-v_N1mCH_jjtv67qVcjPKhBO74eVwqY";

const supabaseReady = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

const SB_HEADERS = {
  "apikey": SUPABASE_ANON_KEY,
  "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json"
};

// ---- Hent alle aktiviteter fra Supabase ----
async function fetchUserActivities() {
  if (!supabaseReady) return [];
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/activities?select=*&order=created_at.desc`,
      { headers: SB_HEADERS }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Supabase SELECT feil:", res.status, err);
      return [];
    }
    const data = await res.json();
    console.log(`✅ Supabase: hentet ${data.length} aktiviteter`);
    return data;
  } catch (e) {
    console.error("Supabase fetch feil:", e);
    return [];
  }
}

// ---- Legg til aktivitet i Supabase ----
async function addUserActivity(activity) {
  if (!supabaseReady) {
    // Offline-fallback: localStorage
    const existing = JSON.parse(localStorage.getItem("cornwall_activities") || "[]");
    const newItem = { ...activity, id: Date.now(), created_at: new Date().toISOString(), local: true };
    existing.unshift(newItem);
    localStorage.setItem("cornwall_activities", JSON.stringify(existing));
    return newItem;
  }

  const payload = {
    name:          activity.name          || null,
    description:   activity.description   || null,
    url:           activity.url           || null,
    type:          activity.type          || "attraksjon",
    day:           activity.day           || null,
    added_by:      activity.added_by      || null,
    location_name: activity.locationName  || activity.location_name || null,
    lat:           activity.lat           || null,
    lon:           activity.lon           || null,
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/activities`, {
    method: "POST",
    headers: { ...SB_HEADERS, "Prefer": "return=representation" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Kunne ikke lagre aktivitet");
  }
  const data = await res.json();
  return data[0];
}

// ---- Oppdater koordinater for en aktivitet ----
async function updateActivityCoords(id, lat, lon) {
  if (!supabaseReady) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/activities?id=eq.${id}`, {
      method: "PATCH",
      headers: { ...SB_HEADERS, "Prefer": "return=minimal" },
      body: JSON.stringify({ lat, lon })
    });
  } catch (e) { console.warn("Supabase PATCH feil:", e); }
}

// ---- Slett aktivitet fra Supabase ----
async function deleteUserActivity(id) {
  // Fjern fra Supabase
  if (supabaseReady) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/activities?id=eq.${id}`, {
        method: "DELETE",
        headers: SB_HEADERS
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.warn("Supabase DELETE feil:", res.status, err);
      } else {
        console.log(`✅ Supabase: slettet aktivitet ${id}`);
      }
    } catch (e) { console.warn("Delete feil:", e); }
  }

  // Fjern fra offline-localStorage (om den finnes der)
  const existing = JSON.parse(localStorage.getItem("cornwall_activities") || "[]");
  const updated = existing.filter(a => String(a.id) !== String(id));
  localStorage.setItem("cornwall_activities", JSON.stringify(updated));

  // Oppdater lokal cache umiddelbart
  if (window._remoteActivities) {
    window._remoteActivities = window._remoteActivities.filter(a => String(a.id) !== String(id));
  }
}

// ---- Offline localStorage-fallback ----
function getLocalActivities() {
  return JSON.parse(localStorage.getItem("cornwall_activities") || "[]");
}

// ---- "På ruten"-funksjonalitet (synkronisert via Supabase) ----
// Innebygde aktiviteter markert «på ruten» lagres som type="planned-builtin"
// i Supabase-tabellen — nøyaktig samme infrastruktur som brukertillagte.

function getPlannedIds() {
  if (supabaseReady && window._remoteActivities !== undefined) {
    // Les fra Supabase-cachen — gjelder for alle enheter
    return (window._remoteActivities || [])
      .filter(a => a.type === "planned-builtin")
      .map(a => a.name);
  }
  // Fallback til localStorage når Supabase ikke er tilgjengelig
  return JSON.parse(localStorage.getItem("cornwall_planned") || "[]");
}

async function addToRoute(id) {
  // Oppdater localStorage umiddelbart for rask UI-respons
  const local = JSON.parse(localStorage.getItem("cornwall_planned") || "[]");
  if (!local.includes(id)) {
    local.push(id);
    localStorage.setItem("cornwall_planned", JSON.stringify(local));
  }

  if (!supabaseReady) return;

  // Ikke legg til dobbelt
  const alreadyThere = (window._remoteActivities || []).some(
    a => a.type === "planned-builtin" && a.name === id
  );
  if (alreadyThere) return;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/activities`, {
      method: "POST",
      headers: { ...SB_HEADERS, "Prefer": "return=representation" },
      body: JSON.stringify({ name: id, type: "planned-builtin" })
    });
    if (res.ok) {
      const data = await res.json();
      if (window._remoteActivities !== undefined) {
        window._remoteActivities = [...(window._remoteActivities || []), data[0]];
      }
    } else {
      console.warn("addToRoute Supabase feil:", res.status);
    }
  } catch (e) { console.warn("addToRoute feil:", e); }
}

async function removeFromRoute(id) {
  // Oppdater localStorage umiddelbart
  const local = JSON.parse(localStorage.getItem("cornwall_planned") || "[]").filter(p => p !== id);
  localStorage.setItem("cornwall_planned", JSON.stringify(local));

  if (!supabaseReady) return;

  const entry = (window._remoteActivities || []).find(
    a => a.type === "planned-builtin" && a.name === id
  );
  if (entry) {
    await deleteUserActivity(entry.id);
  }
}

// ---- Dag-overstyring ----
function getDayOverrides() {
  return JSON.parse(localStorage.getItem("cornwall_day_overrides") || "{}");
}
function setDayOverride(id, day) {
  const overrides = getDayOverrides();
  if (day) overrides[id] = Number(day);
  else delete overrides[id];
  localStorage.setItem("cornwall_day_overrides", JSON.stringify(overrides));
}
function getEffectiveDay(activityId) {
  const overrides = getDayOverrides();
  if (overrides[activityId]) return overrides[activityId];
  const day = TRIP.days.find(d => d.activities.includes(activityId));
  return day ? day.day : null;
}
