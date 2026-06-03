// ============================================================
// SUPABASE-KONFIGURASJON
// Følg SETUP.md for å opprette prosjekt og fylle inn verdiene under
// ============================================================

const SUPABASE_URL = "https://ptammaxltnsdyjsdtwyj.supabase.co";       // Lim inn din Supabase Project URL her
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0YW1tYXhsdG5zZHlqc2R0d3lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MTI5ODQsImV4cCI6MjA5NjA4ODk4NH0.ZU6HqyXiNniL-v_N1mCH_jjtv67qVcjPKhBO74eVwqY";  // Lim inn din anon/public key her

const supabaseReady = SUPABASE_URL && SUPABASE_ANON_KEY;

// ---- API-hjelpefunksjoner ----

async function fetchUserActivities() {
  if (!supabaseReady) return [];
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/activities?select=*&order=created_at.desc`, {
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch { return []; }
}

async function addUserActivity(activity) {
  if (!supabaseReady) {
    // Fallback: lagre i localStorage
    const existing = JSON.parse(localStorage.getItem("cornwall_activities") || "[]");
    const newItem = { ...activity, id: Date.now(), created_at: new Date().toISOString(), local: true };
    existing.unshift(newItem);
    localStorage.setItem("cornwall_activities", JSON.stringify(existing));
    return newItem;
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/activities`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify(activity)
  });
  if (!res.ok) throw new Error("Kunne ikke lagre aktivitet");
  const data = await res.json();
  return data[0];
}

function getLocalActivities() {
  return JSON.parse(localStorage.getItem("cornwall_activities") || "[]");
}

// ---- "På ruten"-funksjonalitet for innebygde forslag ----
function getPlannedIds() {
  return JSON.parse(localStorage.getItem("cornwall_planned") || "[]");
}
function addToRoute(id) {
  const planned = getPlannedIds();
  if (!planned.includes(id)) {
    planned.push(id);
    localStorage.setItem("cornwall_planned", JSON.stringify(planned));
  }
}
function removeFromRoute(id) {
  const planned = getPlannedIds().filter(p => p !== id);
  localStorage.setItem("cornwall_planned", JSON.stringify(planned));
}

async function deleteUserActivity(id) {
  // Fjern fra localStorage
  const existing = JSON.parse(localStorage.getItem("cornwall_activities") || "[]");
  const updated = existing.filter(a => String(a.id) !== String(id));
  localStorage.setItem("cornwall_activities", JSON.stringify(updated));

  // Fjern fra Supabase hvis konfigurert og ikke lokal
  if (supabaseReady) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/activities?id=eq.${id}`, {
        method: "DELETE",
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      // Oppdater remote-cache
      if (window._remoteActivities) {
        window._remoteActivities = window._remoteActivities.filter(a => String(a.id) !== String(id));
      }
    } catch { /* ignorer feil */ }
  }
}
