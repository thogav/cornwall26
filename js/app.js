// ============================================================
// CORNWALL & DEVON 2026 — App Logic v3
// ============================================================

function ic(name, size = 16) {
  return `<i data-lucide="${name}" width="${size}" height="${size}"></i>`;
}
function renderIcons() {
  if (window.lucide) lucide.createIcons();
}

// ---- Navigation ----
function navigate(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  document.getElementById("sec-" + id).classList.add("active");
  document.querySelectorAll(`[data-nav="${id}"]`).forEach(b => b.classList.add("active"));
  window.scrollTo({ top: 0, behavior: "smooth" });
  renderIcons();
}

// ---- Countdown ----
function updateCountdown() {
  const now = new Date();
  const dep = TRIP.meta.departure;
  const ret = TRIP.meta.returnDate;
  const el  = document.getElementById("countdown-block");
  if (!el) return;

  // === UNDER TUREN ===
  if (now >= dep && now <= ret) {
    const today = getTodayDay();
    const totalDays = TRIP.days.length;
    const dayNum = today ? today.day : 1;
    const daysLeft = totalDays - dayNum;

    // Fremdriftsprikker
    const dots = TRIP.days.map((d, i) => {
      const isPast    = i + 1 < dayNum;
      const isCurrent = i + 1 === dayNum;
      return `<span class="prog-dot ${isPast ? "done" : isCurrent ? "current" : ""}"></span>`;
    }).join("");

    // Neste hendelse på tidslinjen i dag
    const nextEvent = today?.timeline.find(e => {
      const t = e.time.replace("~","").trim();
      if (!t.includes(":")) return false;
      const [hh, mm] = t.split(":").map(Number);
      const eventTime = new Date(); eventTime.setHours(hh, mm, 0);
      return eventTime > now;
    });
    const hotelNow = TRIP.hotels.find(h => h.id === today?.hotelId);

    const locationLabel = today ? (today.location || today.title) : "Cornwall & Devon";
    el.innerHTML = `
      <div class="trip-live-header">
        <span class="trip-live-dot"></span> På tur i Cornwall & Devon
      </div>
      <div class="trip-day-big">Dag ${dayNum} av ${totalDays}</div>
      <div class="trip-location">📍 ${locationLabel}</div>
      <div class="trip-progress">${dots}</div>
      <div class="trip-meta-row">
        ${hotelNow ? `<div class="trip-meta-chip">🏨 ${hotelNow.name}</div>` : ""}
        ${dayNum === totalDays ? `<div class="trip-meta-chip">🏁 Siste dag</div>` : ""}
      </div>
      ${nextEvent ? `<div class="trip-next-event">Neste: <strong>${nextEvent.time} — ${nextEvent.label}</strong></div>` : ""}`;
    return;
  }

  // === ETTER TUREN ===
  if (now > ret) {
    el.innerHTML = `
      <div class="trip-done-wrap">
        <div class="trip-done-icon">🌊</div>
        <h2 style="color:white;margin-bottom:6px">Turen er over</h2>
        <p class="trip-done-msg">Cornwall & Devon — juli 2026<br>Takk for turen, Eirin, Stig, Pia og Thomas!</p>
      </div>`;
    return;
  }

  // === FØR TUREN — Nedtelling ===
  const diff = dep - now;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  el.innerHTML = `
    <h2>Avreise om</h2>
    <p class="dates">5. juli – 12. juli 2026</p>
    <div class="countdown-grid">
      <div class="cd-unit"><span class="cd-num">${String(d).padStart(2,"0")}</span><span class="cd-label">dager</span></div>
      <div class="cd-unit"><span class="cd-num">${String(h).padStart(2,"0")}</span><span class="cd-label">timer</span></div>
      <div class="cd-unit"><span class="cd-num">${String(m).padStart(2,"0")}</span><span class="cd-label">min</span></div>
      <div class="cd-unit"><span class="cd-num">${String(s).padStart(2,"0")}</span><span class="cd-label">sek</span></div>
    </div>`;
}

// ---- Today Banner ----
function getTodayDay() {
  const now = new Date();
  return TRIP.days.find(d => {
    const dd = new Date(d.date);
    return now.getFullYear() === dd.getFullYear() && now.getMonth() === dd.getMonth() && now.getDate() === dd.getDate();
  }) || null;
}

function renderTodayBanner() {
  const today = getTodayDay();
  const banner = document.getElementById("today-banner");
  if (!today) return;
  banner.classList.add("visible");
  const events = today.timeline.length
    ? today.timeline.map(e => `<div class="today-event"><span class="t-time">${e.time}</span><span class="t-label">${e.label}</span></div>`).join("")
    : `<div class="today-event"><span class="t-label">Utforsk ${today.location}!</span></div>`;
  banner.innerHTML = `<h2>I dag — Dag ${today.day}: ${today.title}</h2><div class="today-timeline">${events}</div>`;
}

// ---- Weather ----
const WMO = { 0:"☀️ Klarvær", 1:"🌤️ Lettskyet", 2:"⛅ Delvis skyet", 3:"☁️ Overskyet", 45:"🌫️ Tåke", 48:"🌫️ Tåke", 51:"🌦️ Lett yr", 53:"🌦️ Yr", 55:"🌧️ Kraftig yr", 61:"🌧️ Lett regn", 63:"🌧️ Regn", 65:"🌧️ Kraftig regn", 80:"🌦️ Regnbyger", 81:"🌧️ Byger", 95:"⛈️ Torden" };

async function renderWeather() {
  const today = getTodayDay();
  const el = document.getElementById("weather-widget");
  if (!el || !today) return;
  try {
    const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${today.weatherCoords.lat}&longitude=${today.weatherCoords.lon}&current=temperature_2m,weathercode,windspeed_10m&timezone=Europe%2FLondon&wind_speed_unit=kmh`);
    const d = await r.json();
    const c = d.current;
    const desc = WMO[c.weathercode] || "🌡️";
    el.innerHTML = `
      <div class="weather-card" style="margin-bottom:14px">
        <div class="weather-icon-box">${desc.split(" ")[0]}</div>
        <div>
          <div class="weather-temp">${Math.round(c.temperature_2m)}°C</div>
          <div class="weather-desc">${desc.slice(desc.indexOf(" ")+1)} · Vind ${Math.round(c.windspeed_10m)} km/t · ${today.location}</div>
        </div>
      </div>`;
  } catch { el.style.display = "none"; }
}

// ---- Format date ----
function fmtDate(str) {
  return new Date(str).toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long" });
}
function fmtShort(str) {
  return new Date(str).toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
}

// ---- Tidevann-cache for dag-visning ----
window._tideCache = window._tideCache || {};

async function loadTidesForDay(day) {
  if (!day.tideCoords || !TIDES_API_KEY) return null;
  const key = day.date + "_" + day.tideCoords.lat;
  if (window._tideCache[key]) return window._tideCache[key];
  const data = await getTidesForDay(day);
  if (data) window._tideCache[key] = data;
  return data;
}

// ---- Render Days ----
function renderDays() {
  const container = document.getElementById("days-container");
  if (!container) return;
  const today = getTodayDay();

  container.innerHTML = TRIP.days.map(day => {
    const hotel = TRIP.hotels.find(h => h.id === day.hotelId);
    const isToday = today?.day === day.day;

    const tlHtml = day.timeline.length ? `
      <ul class="timeline">
        ${day.timeline.map(e => `
          <li>
            <span class="tl-time">${e.time}</span>
            <div class="tl-icon">${ic(tlIcon(e.icon), 14)}</div>
            <span class="tl-label">${e.label}</span>
          </li>`).join("")}
      </ul>` : "";

    const drivingHtml = day.driving ? `
      <div class="driving-chip">${ic("car", 14)} ${day.driving.from} → ${day.driving.to} · ${day.driving.approx}</div>` : "";

    const hotelHtml = hotel ? `
      <div class="hotel-info-row" style="margin-top:12px">${ic("building-2", 14)}<span><strong>${hotel.name}</strong><br><span style="font-size:0.77rem">${hotel.address}</span></span></div>` : "";

    // Innebygde aktiviteter for denne dagen (hensyn til overstyringer)
    const allBuiltInIds = Object.keys(TRIP.activities).filter(id => getEffectiveDay(id) === day.day);
    const chips = allBuiltInIds.map(id => TRIP.activities[id]).filter(Boolean)
      .map(a => `<button class="suggestion-chip" onclick="filterByDay(${day.day});navigate('aktiviteter')">${ic("arrow-right", 12)} ${a.name}</button>`).join("");

    // Brukertillagte aktiviteter for denne dagen
    const userActsForDay = [...getLocalActivities(), ...(window._remoteActivities || [])]
      .filter(a => String(a.day) === String(day.day));
    const userChips = userActsForDay.map(a =>
      `<button class="suggestion-chip" style="background:#dcfce7;border-color:#86efac;color:#166534" onclick="filterByDay(${day.day});navigate('aktiviteter')">${ic("check-circle-2", 12)} ${a.name}</button>`
    ).join("");

    const chipsHtml = (chips || userChips) ? `<div class="suggestion-row">${chips}${userChips}</div>` : "";

    // Tidevann-placeholder — fylles asynkront etter rendering
    // Sjekk om vi har cached data, quota-exceeded eller ingenting
    const tideCacheKey = `tides_sg_${day.tideCoords?.lat}_${day.tideCoords?.lon}_${day.date}`;
    const tideCached = day.tideCoords ? JSON.parse(localStorage.getItem(tideCacheKey) || "null") : null;
    const tideId = `tide-day-${day.day}`;
    let tideHtml = "";
    if (day.tideCoords && TIDES_API_KEY) {
      if (tideCached?.data) {
        // Har data — vis med en gang
        tideHtml = buildTideHtml(tideCached.data, day.date) || "";
      } else {
        // Ingen data ennå (quota eller ikke hentet) — vis ingenting, fylles inn asynkront
        tideHtml = `<div id="${tideId}"></div>`;
      }
    }

    return `
      <div class="card card-accent-${day.day % 2 === 0 ? "teal" : "navy"}" id="dag-${day.day}">
        <div class="card-inner">
          <div class="day-badge">${ic("calendar", 11)} Dag ${day.day}${isToday ? `<span class="today-pill">${ic("radio", 9)} I dag</span>` : ""}</div>
          <div class="day-date-label">${fmtDate(day.date)}</div>
          <div class="day-title-large">${day.title}</div>
          <div class="day-subtitle-label">${day.subtitle}</div>
          ${drivingHtml}
          ${tlHtml}
          ${hotelHtml}
          ${tideHtml}
          ${chipsHtml}
        </div>
      </div>`;
  }).join("");
  renderIcons();
}

function tlIcon(emoji) {
  const map = { "✈️":"plane", "🛬":"plane-landing", "🛫":"plane-takeoff", "🚗":"car", "🌿":"tree-pine", "🏨":"building-2", "🏰":"landmark", "🍽️":"utensils", "⚓":"anchor", "🐟":"fish", "🛣️":"navigation" };
  return map[emoji] || "circle";
}

// ---- Render Hotels ----
function renderHotels() {
  const container = document.getElementById("hotels-container");
  if (!container) return;
  const accents = ["blue","coral","teal","navy"];
  container.innerHTML = TRIP.hotels.map((h, i) => {
    const cIn  = new Date(h.checkIn).toLocaleDateString("nb-NO", { weekday: "short", day: "numeric", month: "long" });
    const cOut = new Date(h.checkOut).toLocaleDateString("nb-NO", { weekday: "short", day: "numeric", month: "long" });
    return `
      <div class="card card-accent-${accents[i % accents.length]}">
        <div class="card-inner">
          <div class="card-header-row">
            <div class="card-icon card-icon--${accents[i % accents.length]}">${ic("building-2", 22)}</div>
            <div>
              <div class="card-title">${h.name}</div>
              <div class="card-subtitle-text">${h.location}</div>
            </div>
          </div>
          <div class="hotel-dates-chip">${ic("moon", 13)} ${h.nights} natt${h.nights > 1 ? "er" : ""} · ${cIn} – ${cOut}</div>
          <div class="hotel-info-row">${ic("map-pin", 14)}<span>${h.address}</span></div>
          ${h.phone ? `<div class="hotel-info-row">${ic("phone", 14)}<a href="tel:${h.phone}">${h.phone}</a></div>` : ""}
          <div class="hotel-info-row">${ic("user", 14)}<span>Bestilt av ${h.bookedBy}</span></div>
          <p class="hotel-desc">${h.description}</p>
          ${h.notes ? `<div class="hotel-note">${ic("info", 14)} ${h.notes}</div>` : ""}
          <div class="btn-row" style="margin-top:14px">
            <a href="${h.mapsUrl}" target="_blank" class="btn-primary">${ic("map-pin", 14)} Åpne i Maps</a>
          </div>
        </div>
      </div>`;
  }).join("");
  renderIcons();
}

// ---- Render Activities ----
let activeFilter = "alle";

function filterByDay(day) {
  activeFilter = day;
  renderActivities();
  document.querySelectorAll(".filter-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.day == day || (day === "alle" && b.dataset.day === "alle"));
  });
}

const typeLabels = { attraksjon:"Attraksjon", natur:"Natur", by:"By & Kultur", vandring:"Vandring", kultur:"Kultur", restaurant:"Restaurant", "mat-og-drikke":"Mat & Drikke", bruker:"Lagt til av dere" };
const typeIcons  = { attraksjon:"star", natur:"tree-pine", by:"map-pin", vandring:"footprints", kultur:"palette", restaurant:"utensils", "mat-og-drikke":"wine", bruker:"users" };

function renderActivities() {
  const container = document.getElementById("activities-container");
  if (!container) return;

  // Hensyn til dag-overstyringer ved filtrering
  let ids;
  if (activeFilter === "alle") {
    ids = Object.keys(TRIP.activities);
  } else {
    const filterDay = Number(activeFilter);
    // Innebygde aktiviteter for denne dagen (hensyn til overstyringer)
    ids = Object.keys(TRIP.activities).filter(id => getEffectiveDay(id) === filterDay);
  }
  const items = ids.map(id => TRIP.activities[id]).filter(Boolean);
  const userActs = [...getLocalActivities(), ...(window._remoteActivities || [])].filter(a => activeFilter === "alle" || String(a.day) === String(activeFilter));

  const plannedIds = getPlannedIds();

  // Slett-knapp (for brukertillagte og "på ruten"-aktiviteter)
  const deleteBtn = (id, fn) => `
    <button onclick="${fn}('${id}')" title="Fjern"
      style="flex-shrink:0;background:none;border:none;cursor:pointer;color:var(--text-3);padding:4px 6px;border-radius:6px;transition:all 0.15s;margin-top:0"
      onmouseover="this.style.background='#fee2e2';this.style.color='#dc2626'"
      onmouseout="this.style.background='none';this.style.color='var(--text-3)'">
      ${ic("trash-2", 16)}
    </button>`;

  const routeTidesStore = JSON.parse(localStorage.getItem("cornwall_route_tides") || "{}");

  // Innebygde aktiviteter som er lagt til på ruten
  const dayOptions = TRIP.days.map(d =>
    `<option value="${d.day}">Dag ${d.day} — ${d.title}</option>`
  ).join("");

  const plannedCards = items
    .filter(a => plannedIds.includes(a.id))
    .map(a => {
      const storedTide = routeTidesStore[a.id];
      const tideHtml = storedTide
        ? buildTideHtml(storedTide.extremes, storedTide.date)
        : "";
      const effectiveDay = getEffectiveDay(a.id);
      const daySelector = `
        <div style="margin-bottom:10px">
          <label style="font-size:0.7rem;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:0.07em;display:block;margin-bottom:4px">${ic("calendar", 11)} Dag</label>
          <select onchange="setActivityDay('${a.id}', this.value)"
            style="font-size:0.78rem;font-family:inherit;border:1.5px solid var(--gray-2);border-radius:8px;padding:5px 9px;background:var(--gray-1);color:var(--text);outline:none;cursor:pointer">
            ${TRIP.days.map(d => `<option value="${d.day}" ${effectiveDay === d.day ? "selected" : ""}>Dag ${d.day} — ${d.title}</option>`).join("")}
          </select>
        </div>`;
      return `
      <div class="card card-accent-teal" id="act-card-${a.id}" style="margin-bottom:14px">
        <div class="card-inner">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">
            <div style="flex:1;min-width:0">
              <div class="activity-type-badge badge-pa-ruten">${ic("check-circle-2", 11)} På ruten</div>
              <h4 class="activity-name">${a.name}</h4>
            </div>
            ${deleteBtn(a.id, "removeFromRouteAndRender")}
          </div>
          <p class="activity-desc">${a.description}</p>
          ${daySelector}
          ${tideHtml}
          ${a.tip && !a.booked ? `<div class="activity-tip">${ic("lightbulb", 14)} <span>${a.tip}</span></div>` : ""}
          ${a.booked ? `<div class="activity-booked">${ic("check-circle-2", 14)} <span>${a.tip}</span></div>` : ""}
          <div class="btn-row">
            ${a.url ? `<a href="${a.url}" target="_blank" class="btn-secondary">${ic("external-link", 13)} Mer info</a>` : ""}
            ${a.mapsUrl ? `<a href="${a.mapsUrl}" target="_blank" class="btn-secondary">${ic("map-pin", 13)} Kart</a>` : ""}
          </div>
        </div>
      </div>`;
    }).join("");

  // Tidevann for brukertillagte aktiviteter (asynkront, vises etter rendering)
  setTimeout(() => {
    userActs.forEach(a => {
      if (!a.lat || !a.lon || !a.day || !TIDES_API_KEY) return;
      const day = TRIP.days.find(d => d.day === Number(a.day));
      if (!day) return;
      fetchTidesForLocation(a.lat, a.lon, day.date, day.date).then(extremes => {
        const el = document.getElementById(`act-card-${a.id}`)?.querySelector(".act-tide-slot");
        if (el && extremes) el.outerHTML = buildTideHtml(extremes, day.date);
      });
    });
  }, 100);

  // Brukertillagte aktiviteter (alltid "på ruten")
  const userCards = userActs.map(a => `
    <div class="card card-accent-teal" id="act-card-${a.id}" style="margin-bottom:14px">
      <div class="card-inner">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">
          <div style="flex:1;min-width:0">
            <div class="activity-type-badge badge-bruker">${ic("users", 11)} Lagt til av dere</div>
            <h4 class="activity-name">${a.name}</h4>
          </div>
          ${deleteBtn(a.id, "removeActivity")}
        </div>
        <p class="activity-desc">${a.description || ""}</p>
        ${a.locationName ? `<div style="font-size:0.75rem;color:var(--text-3);margin-bottom:6px">${ic("map-pin",11)} ${a.locationName}</div>` : ""}
        <div class="act-tide-slot"></div>
        <div class="btn-row">
          ${a.url ? `<a href="${a.url}" target="_blank" class="btn-secondary">${ic("external-link", 13)} Mer info</a>` : ""}
          ${a.added_by ? `<span class="btn-secondary" style="cursor:default;pointer-events:none">${ic("user", 13)} ${a.added_by}</span>` : ""}
        </div>
      </div>
    </div>`).join("");

  // Innebygde forslag (ikke lagt til ennå)
  const suggestionHeader = `
    <div style="display:flex;align-items:center;gap:8px;margin:20px 0 12px">
      <div style="flex:1;height:1px;background:var(--border)"></div>
      <span style="font-size:0.7rem;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:0.08em;white-space:nowrap">Forslag</span>
      <div style="flex:1;height:1px;background:var(--border)"></div>
    </div>`;

  const suggestionCards = items
    .filter(a => !plannedIds.includes(a.id))
    .map(a => `
      <div class="card card-suggestion" id="act-card-${a.id}" style="margin-bottom:12px">
        <div class="card-inner">
          <div class="activity-type-badge badge-forslag">${ic(typeIcons[a.type] || "star", 11)} ${typeLabels[a.type] || a.type}</div>
          <h4 class="activity-name" style="color:var(--text-2)">${a.name}</h4>
          <p class="activity-desc">${a.description}</p>
          ${a.tip && !a.booked ? `<div class="activity-tip">${ic("lightbulb", 14)} <span>${a.tip}</span></div>` : ""}
          ${a.booked ? `<div class="activity-booked">${ic("check-circle-2", 14)} <span>${a.tip}</span></div>` : ""}
          <div class="btn-row" style="margin-top:10px">
            <button onclick="addToRouteAndRender('${a.id}')" style="display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#0a2744,#0a5eb5);color:white;border:none;border-radius:980px;padding:8px 16px;font-size:0.8rem;font-weight:700;font-family:inherit;cursor:pointer;box-shadow:0 2px 8px rgba(10,39,68,0.2)">${ic("plus", 14)} Legg til på ruten</button>
            ${a.url ? `<a href="${a.url}" target="_blank" class="btn-secondary">${ic("external-link", 13)} Mer info</a>` : ""}
            ${a.mapsUrl ? `<a href="${a.mapsUrl}" target="_blank" class="btn-secondary">${ic("map-pin", 13)} Kart</a>` : ""}
          </div>
        </div>
      </div>`).join("");

  const hasPlanItems = plannedCards || userCards;
  const hasSuggestions = suggestionCards;

  container.innerHTML =
    (hasPlanItems ? plannedCards + userCards : "") +
    (hasSuggestions ? (hasPlanItems ? suggestionHeader : "") + suggestionCards : "") +
    (!hasPlanItems && !hasSuggestions ? `<div style="text-align:center;color:var(--text-3);padding:40px 20px">Ingen aktiviteter for denne dagen ennå.</div>` : "");
  renderIcons();
}

// ---- Render Programme ----
function renderProgramme() {
  const container = document.getElementById("programme-container");
  if (!container) return;
  const plannedIds = getPlannedIds();
  const userActs   = [...getLocalActivities(), ...(window._remoteActivities || [])];

  const rows = TRIP.days.map(day => {
    const hotel = TRIP.hotels.find(h => h.id === day.hotelId);

    // Innebygde aktiviteter for dagen
    const builtIn = day.activities
      .map(id => TRIP.activities[id]?.name).filter(Boolean);

    // Brukertillagte + "på ruten"-aktiviteter for denne dagen
    const userForDay = userActs
      .filter(a => String(a.day) === String(day.day))
      .map(a => `✓ ${a.name}`);

    // Innebygde som er eksplisitt lagt til på ruten (markert)
    const plannedBuiltIn = day.activities
      .filter(id => plannedIds.includes(id))
      .map(id => TRIP.activities[id]?.name).filter(Boolean)
      .map(n => `✓ ${n}`);

    // Kombiner: vis "på ruten" øverst, deretter brukerlagte, deretter forslag
    const notPlanned = builtIn.filter(n =>
      !plannedBuiltIn.some(p => p.includes(n))
    );
    const allNames = [...plannedBuiltIn, ...userForDay, ...notPlanned];
    const acts = allNames.length ? allNames.join(", ") : "—";
    const locName = day.location || day.title || "—";
    const tl = day.timeline.length
      ? day.timeline.map(e => [e.time, e.label].filter(Boolean).join(" ")).join("<br>")
      : `Utforsk ${locName}`;
    return `<tr>
      <td class="day-col">Dag ${day.day}<br><span style="font-weight:400;color:var(--text-3);font-size:0.72rem">${fmtShort(day.date)}</span></td>
      <td><strong>${day.title}</strong><br><span style="font-size:0.75rem;color:var(--text-3)">${day.subtitle}</span></td>
      <td style="font-size:0.78rem;color:var(--text-3)">${hotel ? hotel.name : "—"}</td>
      <td style="font-size:0.78rem">${tl}</td>
      <td style="font-size:0.78rem">${acts}</td>
    </tr>`;
  }).join("");
  container.innerHTML = `<div class="programme-scroll"><table class="programme-table">
    <thead><tr><th>Dag</th><th>Tittel</th><th>Hotell</th><th>Tidslinje</th><th>Aktiviteter</th></tr></thead>
    <tbody>${rows}</tbody></table></div>`;
}

// ---- Render Map links ----
function renderMapLinks() {
  const el = document.getElementById("map-links-container");
  if (!el) return;
  const links = [
    ["The Eden Project", "https://maps.google.com/?q=The+Eden+Project+Bodelva+Cornwall", "tree-pine"],
    ["Housel Bay Hotel, Lizard", "https://maps.google.com/?q=Housel+Bay+Hotel+Lizard+Cornwall", "building-2"],
    ["Kynance Cove", "https://maps.google.com/?q=Kynance+Cove+Lizard+Cornwall", "waves"],
    ["St. Michael's Mount", "https://maps.google.com/?q=St+Michaels+Mount+Marazion+Cornwall", "landmark"],
    ["Alfred Wallis-leiligheten, St. Ives", "https://maps.google.com/?q=Woon+Barnoon+St+Ives+Cornwall", "home"],
    ["Polgoon Vineyard", "https://maps.google.com/?q=Polgoon+Vineyard+Penzance", "wine"],
    ["Tintagel Castle", "https://maps.google.com/?q=Tintagel+Castle+Cornwall", "castle"],
    ["Red Lion Hotel, Clovelly", "https://maps.google.com/?q=Red+Lion+Hotel+Clovelly+Devon", "building-2"],
    ["Polperro", "https://maps.google.com/?q=Polperro+Cornwall", "anchor"],
    ["Fieldhead Hotel, Looe", "https://maps.google.com/?q=Fieldhead+Hotel+Looe+Cornwall", "building-2"],
  ];
  el.innerHTML = links.map(([label, url, icon]) =>
    `<a href="${url}" target="_blank" class="btn-secondary" style="justify-content:flex-start">${ic(icon, 14)} ${label}</a>`
  ).join("");
  renderIcons();
}

// ---- Render Info ----
function renderInfo() {
  const phraseEl = document.getElementById("phrase-list");
  if (phraseEl) {
    phraseEl.innerHTML = TRIP.cornishPhrases.map(p =>
      `<li><span class="phrase-word">${p.phrase}</span><span class="phrase-meaning">${p.meaning}</span></li>`).join("");
  }

  const spotifyEl = document.getElementById("spotify-list");
  if (spotifyEl) {
    spotifyEl.innerHTML = TRIP.spotify.map(s =>
      `<a href="${s.searchUrl}" target="_blank" class="spotify-card">
        <div class="spotify-badge">${ic("music", 18)}</div>
        <div><div class="s-title">${s.title}</div><div class="s-desc">${s.description}</div></div>
      </a>`).join("");
  }

  const emEl = document.getElementById("emergency-list");
  if (emEl) {
    emEl.innerHTML = `
      <li>${ic("phone-call",14)}<span class="em-label">Nødsituasjoner (UK)</span><a href="tel:999" style="font-weight:700;color:var(--coral)">999</a></li>
      <li>${ic("phone",14)}<span class="em-label">Ikke-nødmeldinger</span><a href="tel:101">101</a></li>
      <li>${ic("flag",14)}<span class="em-label">Norsk ambassade London</span><a href="tel:+442075915500">+44 20 7591 5500</a></li>
      <li>${ic("credit-card",14)}<span class="em-label">Europeisk helsetrygdkort</span><span style="color:var(--text-3)">Husk EHIC for alle fire</span></li>
      <li>${ic("banknote",14)}<span class="em-label">Valuta</span><span style="color:var(--text-3)">Britiske pund (GBP) — ha kontant til Clovelly</span></li>`;
  }

  const packEl = document.getElementById("packing-list");
  if (packEl) {
    const items = ["Pass", "EHIC-kort", "Reiseforsikring", "Strømplugg (UK)", "GBP kontant", "Vandresko", "Regntøy", "Solkrem", "Badetøy", "Lader + powerbank", "Snacks dag 1", "Bilsykepose"];
    packEl.innerHTML = items.map(i => `<div class="packing-item">${ic("check-circle-2",14)} ${i}</div>`).join("");
  }

  const factsEl = document.getElementById("facts-list");
  if (factsEl && TRIP.facts) {
    factsEl.innerHTML = TRIP.facts
      .map(f => `<div class="fact-item">${ic(f.icon, 16)} <span>${f.text}</span></div>`)
      .join("");
  }

  renderIcons();
}

// ---- Slett aktivitet ----
async function removeActivity(id) {
  const card = document.getElementById("act-card-" + id);
  if (card) {
    card.style.transition = "opacity 0.2s, transform 0.2s";
    card.style.opacity = "0";
    card.style.transform = "translateX(8px)";
    setTimeout(() => card.remove(), 200);
  }
  await deleteUserActivity(id);
  renderActivities();
  renderDays();         // oppdater Reiseplan
  renderHomeContent();  // oppdater Hjem (aktiviteter i dag)
  renderIcons();
}

async function addToRouteAndRender(id) {
  addToRoute(id);
  renderActivities();
  renderIcons();

  // Finn aktiviteten og hvilken dag den tilhører
  const activity = TRIP.activities[id];
  if (!activity) return;
  const dayObj = TRIP.days.find(d => d.activities.includes(id));
  if (!dayObj) return;

  // Geocode aktivitetsnavnet og hent tidevann
  if (TIDES_API_KEY || true) { // Geocoding er alltid gratis
    const coords = await geocodePlace(activity.name);
    if (!coords) return;

    // Lagre koordinater for aktiviteten
    const routeTides = JSON.parse(localStorage.getItem("cornwall_route_coords") || "{}");
    routeTides[id] = { lat: coords.lat, lon: coords.lon };
    localStorage.setItem("cornwall_route_coords", JSON.stringify(routeTides));

    if (TIDES_API_KEY) {
      // Hent tidevann og vis på kortet
      const extremes = await fetchTidesForLocation(coords.lat, coords.lon, dayObj.date, dayObj.date);
      if (extremes) {
        const tideStore = JSON.parse(localStorage.getItem("cornwall_route_tides") || "{}");
        tideStore[id] = { extremes, date: dayObj.date };
        localStorage.setItem("cornwall_route_tides", JSON.stringify(tideStore));
        renderActivities(); renderDays(); renderIcons();
      }
    }
  }
}

function setActivityDay(id, newDay) {
  setDayOverride(id, newDay);
  renderActivities();
  renderDays();
  renderIcons();
}

function removeFromRouteAndRender(id) {
  const card = document.getElementById("act-card-" + id);
  const cleanup = () => {
    removeFromRoute(id);
    setDayOverride(id, null); // nullstill eventuell dag-overstyring
    // Rydd opp lagrede koordinater og tidevann
    const coords = JSON.parse(localStorage.getItem("cornwall_route_coords") || "{}");
    const tides  = JSON.parse(localStorage.getItem("cornwall_route_tides")  || "{}");
    delete coords[id]; delete tides[id];
    localStorage.setItem("cornwall_route_coords", JSON.stringify(coords));
    localStorage.setItem("cornwall_route_tides",  JSON.stringify(tides));
    renderActivities(); renderDays(); renderIcons();
  };
  if (card) {
    card.style.transition = "opacity 0.2s, transform 0.2s";
    card.style.opacity = "0";
    card.style.transform = "translateX(8px)";
    setTimeout(cleanup, 200);
  } else { cleanup(); }
}

// ---- Add Form ----
async function initAddForm() {
  const form = document.getElementById("add-activity-form");
  if (!form) return;
  if (!supabaseReady) { const n = document.getElementById("supabase-notice"); if (n) n.style.display = "block"; }

  const daySelect = document.getElementById("form-day");
  if (daySelect) {
    daySelect.innerHTML = `<option value="">Alle dager / Usikker</option>` +
      TRIP.days.map(d => `<option value="${d.day}">Dag ${d.day} — ${d.title} (${fmtShort(d.date)})</option>`).join("");
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const btn = form.querySelector(".btn-submit");
    btn.disabled = true; btn.innerHTML = ic("waves", 16) + " Lagrer...";
    const locationInput = (document.getElementById("form-location")?.value || "").trim();
    const activity = {
      name:         document.getElementById("form-name").value.trim(),
      description:  document.getElementById("form-description").value.trim(),
      url:          document.getElementById("form-url").value.trim(),
      type:         document.getElementById("form-type").value,
      day:          Number(document.getElementById("form-day").value) || null,
      added_by:     document.getElementById("form-by").value,
      locationName: locationInput || null,
    };
    try {
      const saved = await addUserActivity(activity);
      const successEl = document.getElementById("form-success");
      successEl.style.display = "block";
      form.reset();
      renderActivities(); renderDays(); renderHomeContent(); renderIcons();

      // Auto-geocoding — kjøres alltid når stedsfelt er fylt ut (Nominatim er gratis)
      if (locationInput && saved) {
        successEl.textContent = "📍 Lagret! Finner koordinater for " + locationInput + "...";
        geocodePlace(locationInput).then(async coords => {
          if (coords) {
            // Lagre koordinater i localStorage uansett API-nøkkel
            const stored = JSON.parse(localStorage.getItem("cornwall_activities") || "[]");
            const idx = stored.findIndex(a => String(a.id) === String(saved.id));
            if (idx >= 0) {
              stored[idx].lat = coords.lat;
              stored[idx].lon = coords.lon;
              localStorage.setItem("cornwall_activities", JSON.stringify(stored));
            }

            if (TIDES_API_KEY && saved.day) {
              // Hent tidevann om API-nøkkel finnes
              successEl.textContent = "🌊 Koordinater funnet — henter tidevann...";
              const day = TRIP.days.find(d => d.day === Number(saved.day));
              if (day) {
                const extremes = await fetchTidesForLocation(coords.lat, coords.lon, day.date, day.date);
                if (extremes) {
                  successEl.textContent = "🌊 Tidevann lastet for " + locationInput + "!";
                  renderActivities(); renderDays(); renderIcons();
                  return;
                }
              }
            } else {
              successEl.textContent = "📍 Koordinater lagret for " + locationInput + ". Tidevann aktiveres når Stormglass API-nøkkel settes opp.";
            }
          } else {
            successEl.textContent = "✅ Lagret! (Sted '" + locationInput + "' ikke funnet — sjekk stavemåten)";
          }
          renderActivities(); renderDays(); renderIcons();
        });
      } else {
        successEl.textContent = "✅ Aktiviteten er lagt til og deles med alle fire!";
      }
      setTimeout(() => { successEl.style.display = "none"; }, 6000);
    } catch (err) { alert("Feil: " + err.message); }
    btn.disabled = false; btn.innerHTML = ic("plus", 16) + " Legg til";
    renderIcons();
  });
}

// ---- Dynamic Home Page ----
function renderHomeContent() {
  const now  = new Date();
  const dep  = TRIP.meta.departure;
  const ret  = TRIP.meta.returnDate;
  const el   = document.getElementById("home-dynamic");
  if (!el) return;

  // === UNDER TUREN ===
  if (now >= dep && now <= ret) {
    const today = getTodayDay();
    if (!today) return;
    const hotel = TRIP.hotels.find(h => h.id === today.hotelId);

    // Neste hendelse på tidslinjen
    const upcomingEvents = today.timeline.filter(e => {
      const t = e.time.replace("~","").trim();
      if (!t.includes(":")) return true;
      const [hh, mm] = t.split(":").map(Number);
      const et = new Date(now.getTime()); // kopi — ikke muter now
      et.setHours(hh, mm, 0, 0);
      return et > now;
    });

    // Nattmodus kl 23:30–07:00 viser alltid sove-kortet
    const totalMins = now.getHours() * 60 + now.getMinutes();
    const isNight = totalMins >= 23 * 60 + 30 || totalMins < 7 * 60;
    const nextEvent = isNight ? null : upcomingEvents[0];

    // Restaurant-booking i dag?
    const restaurant = today.restaurant;

    const nowMs = now.getTime();
    const locLabel = today.location || today.title;

    // Tidevann for i dag — hentes og vises på hjem
    if (today.tideCoords && TIDES_API_KEY) {
      loadTidesForDay(today).then(extremes => {
        const chip = buildNextTideChip(extremes);
        const tideHomeEl = document.getElementById("tide-home-today");
        if (tideHomeEl && chip) tideHomeEl.outerHTML = chip;
      });
    }

    // Tidslinje-HTML
    const tlHtml = today.timeline.length ? `
      <ul class="timeline" style="margin:0">
        ${today.timeline.map(e => {
          const t = e.time.replace("~","").trim();
          let isPast = false;
          if (t.includes(":")) {
            const [hh, mm] = t.split(":").map(Number);
            const et = new Date(nowMs); et.setHours(hh, mm, 0, 0);
            isPast = et.getTime() < nowMs;
          }
          return `<li style="${isPast ? "opacity:0.4" : ""}">
            <span class="tl-time">${e.time}</span>
            <div class="tl-icon">${ic(tlIcon(e.icon), 14)}</div>
            <span class="tl-label">${e.label}</span>
          </li>`;
        }).join("")}
      </ul>` : `<p style="font-size:0.9rem;color:var(--text-2);padding:6px 0;font-weight:500">Utforsk ${locLabel}!</p>`;

    // Aktiviteter i dag — forhåndsdefinerte + brukerlagte
    const builtInActs = (today.activities || [])
      .map(id => TRIP.activities[id]).filter(Boolean);
    const userActs = [...getLocalActivities(), ...(window._remoteActivities || [])]
      .filter(a => String(a.day) === String(today.day));
    const allActs = [...builtInActs, ...userActs];

    const actsHtml = allActs.length ? `
      <div class="card" style="margin-bottom:14px">
        <div class="card-inner">
          <div class="card-header-row" style="margin-bottom:10px">
            <div class="card-icon card-icon--teal">${ic("compass", 20)}</div>
            <div>
              <div class="card-title">I dag på ${locLabel}</div>
              <div class="card-subtitle-text">${allActs.length} steder og aktiviteter</div>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${allActs.map(a => `
              <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
                <div style="width:32px;height:32px;border-radius:8px;background:var(--gray-1);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--teal)">
                  ${ic(typeIcons[a.type] || "star", 14)}
                </div>
                <div style="flex:1;min-width:0">
                  <div style="font-weight:600;font-size:0.85rem;color:var(--black)">${a.name}</div>
                  ${a.tip && !a.booked ? `<div style="font-size:0.75rem;color:var(--text-3);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${a.tip}</div>` : ""}
                  ${a.booked ? `<div style="font-size:0.75rem;color:#16a34a;font-weight:600">✅ Bestilt</div>` : ""}
                </div>
                ${a.mapsUrl ? `<a href="${a.mapsUrl}" target="_blank" style="flex-shrink:0;color:var(--blue)">${ic("map-pin", 16)}</a>` : ""}
              </div>`).join("")}
          </div>
          <div class="btn-row" style="margin-top:12px">
            <button class="btn-secondary" onclick="filterByDay(${today.day});navigate('aktiviteter')">${ic("arrow-right", 13)} Se alle detaljer</button>
          </div>
        </div>
      </div>` : "";

    el.innerHTML = `
      <!-- Neste hendelse (fremhevet) -->
      ${nextEvent ? `
        <div class="today-next-card">
          <div class="today-next-label">${ic("clock", 13)} Neste</div>
          <div class="today-next-time">${nextEvent.time}</div>
          <div class="today-next-event">${nextEvent.label}</div>
        </div>` : (() => {
          // Velg sovekarakter basert på sted — øgle i Lizard!
          const isLizard = (today.location || "").toLowerCase().includes("lizard");
          const sleeper  = isLizard ? "🦎" : "😴";
          const nightMsg = `God natt fra ${locLabel}!`;
          return `
          <div class="today-next-card today-next-card--done">
            <div class="sleep-scene">
              <span class="sleep-emoji">${sleeper}</span>
              <div class="sleep-zs">
                <span class="sleep-z">z</span>
                <span class="sleep-z">z</span>
                <span class="sleep-z">Z</span>
              </div>
            </div>
            <div class="today-next-label" style="margin-bottom:4px">${ic("moon", 13)} Ferdig for i dag</div>
            <div class="today-next-event">${nightMsg}</div>
          </div>`;
        })()}

      <!-- Dagens tidslinje -->
      <div class="card card-accent-navy" style="margin-bottom:14px">
        <div class="card-inner">
          <div class="card-header-row" style="margin-bottom:12px">
            <div class="card-icon card-icon--navy">${ic("calendar-days", 20)}</div>
            <div>
              <div class="card-title">Dag ${today.day} — ${today.title}</div>
              <div class="card-subtitle-text">${fmtDate(today.date)}</div>
            </div>
          </div>
          ${tlHtml}
        </div>
      </div>

      <!-- Aktiviteter i dag -->
      ${actsHtml}

      <!-- Tidevann for i dag -->
      ${today.tideCoords ? `<div id="tide-home-today"></div>` : ""}

      <!-- Kveldsbooking -->
      ${restaurant ? `
        <div class="card card-accent-coral" style="margin-bottom:14px">
          <div class="card-inner">
            <div class="card-header-row">
              <div class="card-icon card-icon--coral">${ic("utensils", 20)}</div>
              <div>
                <div class="card-title">${restaurant.name}</div>
                <div class="card-subtitle-text">Reservert kl ${restaurant.time} · ${restaurant.hotel}</div>
              </div>
            </div>
          </div>
        </div>` : ""}

      <!-- Hotell i natt -->
      ${hotel ? `
        <div class="card" style="margin-bottom:14px">
          <div class="card-inner">
            <div class="card-header-row">
              <div class="card-icon card-icon--blue">${ic("building-2", 20)}</div>
              <div>
                <div class="card-title">${hotel.name}</div>
                <div class="card-subtitle-text">${hotel.address}</div>
              </div>
            </div>
            <div class="btn-row" style="margin-top:10px">
              <a href="${hotel.mapsUrl}" target="_blank" class="btn-secondary">${ic("map-pin", 13)} Veibeskrivelse</a>
              ${hotel.phone ? `<a href="tel:${hotel.phone}" class="btn-secondary">${ic("phone", 13)} Ring hotellet</a>` : ""}
            </div>
          </div>
        </div>` : ""}

      <!-- Hurtignavigering -->
      <div class="quicknav-grid">
        <button class="quicknav-btn" onclick="navigate('reiseplan')">
          <div class="quicknav-icon">${ic("calendar-days", 22)}</div>
          <span class="quicknav-label">Reiseplan</span>
        </button>
        <button class="quicknav-btn" onclick="filterByDay(${today.day});navigate('aktiviteter')">
          <div class="quicknav-icon">${ic("compass", 22)}</div>
          <span class="quicknav-label">I dag</span>
        </button>
        <button class="quicknav-btn" onclick="navigate('kart')">
          <div class="quicknav-icon">${ic("map", 22)}</div>
          <span class="quicknav-label">Kart</span>
        </button>
        <button class="quicknav-btn" onclick="navigate('hoteller')">
          <div class="quicknav-icon">${ic("building-2", 22)}</div>
          <span class="quicknav-label">Hoteller</span>
        </button>
        <button class="quicknav-btn" onclick="navigate('aktiviteter')">
          <div class="quicknav-icon">${ic("star", 22)}</div>
          <span class="quicknav-label">Aktiviteter</span>
        </button>
        <button class="quicknav-btn" onclick="navigate('info')">
          <div class="quicknav-icon">${ic("info", 22)}</div>
          <span class="quicknav-label">Info</span>
        </button>
      </div>`;

    renderIcons();
    return;
  }

  // === FØR ELLER ETTER TUREN — standard layout ===
  el.innerHTML = `
    <div class="info-duo">
      <div class="info-duo-card">
        <div class="info-duo-icon">${ic("plane", 20)}</div>
        <div>
          <div class="info-duo-title">SAS SK803 — 5. juli</div>
          <div class="info-duo-line">OSL 08:00 → LHR 09:35</div>
        </div>
      </div>
      <div class="info-duo-card">
        <div class="info-duo-icon">${ic("plane-takeoff", 20)}</div>
        <div>
          <div class="info-duo-title">Norwegian DY1313 — 12. juli</div>
          <div class="info-duo-line">LGW 20:50 → OSL 23:55</div>
        </div>
      </div>
    </div>

    <div class="card card-accent-coral" style="margin-bottom:16px">
      <div class="card-inner">
        <div class="card-header-row">
          <div class="card-icon card-icon--coral">${ic("car", 22)}</div>
          <div>
            <div class="card-title">Leiebil — Enterprise</div>
            <div class="card-subtitle-text">Bekreftelse: 1596547572</div>
          </div>
        </div>
        <div class="hotel-info-row">${ic("plane-landing", 14)}<span><strong>Henting:</strong> Heathrow (LHR) — søndag 5. juli kl 10:30<br><span style="font-size:0.77rem;color:var(--text-3)">Northern Perimeter Road, TW6 2RY · +44 20 8150 1809</span></span></div>
        <div class="hotel-info-row" style="margin-top:6px">${ic("plane-takeoff", 14)}<span><strong>Levering:</strong> Gatwick (LGW) — søndag 12. juli kl 18:00<br><span style="font-size:0.77rem;color:var(--text-3)">South Terminal, Lower Forecourt Road, RH6 0NP</span></span></div>
        <div class="btn-row" style="margin-top:14px">
          <a href="https://maps.google.com/?q=Enterprise+Car+Hire+Heathrow+Airport" target="_blank" class="btn-secondary">${ic("map-pin", 14)} Heathrow</a>
          <a href="https://maps.google.com/?q=Enterprise+Car+Hire+Gatwick+Airport" target="_blank" class="btn-secondary">${ic("map-pin", 14)} Gatwick</a>
        </div>
      </div>
    </div>

    <div class="quicknav-grid">
      <button class="quicknav-btn" onclick="navigate('reiseplan')">
        <div class="quicknav-icon">${ic("calendar-days", 22)}</div>
        <span class="quicknav-label">Reiseplan</span>
      </button>
      <button class="quicknav-btn" onclick="navigate('hoteller')">
        <div class="quicknav-icon">${ic("building-2", 22)}</div>
        <span class="quicknav-label">Hoteller</span>
      </button>
      <button class="quicknav-btn" onclick="navigate('aktiviteter')">
        <div class="quicknav-icon">${ic("compass", 22)}</div>
        <span class="quicknav-label">Aktiviteter</span>
      </button>
      <button class="quicknav-btn" onclick="navigate('kart')">
        <div class="quicknav-icon">${ic("map", 22)}</div>
        <span class="quicknav-label">Kart</span>
      </button>
      <button class="quicknav-btn" onclick="navigate('info')">
        <div class="quicknav-icon">${ic("info", 22)}</div>
        <span class="quicknav-label">Info</span>
      </button>
    </div>`;
  renderIcons();
}

// ---- Last tidevann asynkront inn i dagkortene ----
async function loadTidesIntoCards() {
  if (!TIDES_API_KEY) return;
  for (const day of TRIP.days) {
    if (!day.tideCoords) continue;
    const extremes = await loadTidesForDay(day);
    if (!extremes) continue;
    const el = document.getElementById(`tide-day-${day.day}`);
    if (el) {
      const html = buildTideHtml(extremes, day.date);
      if (html) el.outerHTML = html;
    }
  }
  renderIcons();
}

// ---- Remote activities ----
async function loadRemoteActivities() {
  window._remoteActivities = await fetchUserActivities();
  renderActivities();
  renderDays();         // oppdater Reiseplan med fjernlagrede aktiviteter
  renderHomeContent();  // oppdater Hjem
  renderIcons();
}

// ---- Init ----
document.addEventListener("DOMContentLoaded", async () => {
  updateCountdown();
  setInterval(updateCountdown, 1000);
  renderTodayBanner();
  renderHomeContent();
  renderDays();
  renderHotels();
  renderActivities();
  renderMapLinks();
  renderInfo();
  initAddForm();

  // Skjul stats-raden under og etter turen
  const now = new Date();
  if (now >= TRIP.meta.departure) {
    const statsEl = document.getElementById("home-stats");
    if (statsEl) statsEl.style.display = "none";
  }

  renderIcons();

  // Async
  renderWeather();
  loadRemoteActivities();
  loadTidesIntoCards();
  prefetchAllTides();

  navigate("hjem");
});
