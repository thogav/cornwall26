# Oppsett — Devon & Cornwall 2026

## Status

| Steg | Status |
|------|--------|
| GitHub repo | ✅ Opprettet |
| Supabase | ✅ Konfigurert |
| Stormglass tidevann | ✅ API-nøkkel satt opp |
| Google My Maps | ⏳ Gjenstår |
| GitHub Pages live | ⏳ Gjenstår |

---

## 1. Publiser til GitHub Pages

### Første gang (initialiser lokalt repo og push)

Åpne Terminal og kjør disse kommandoene i rekkefølge:

```bash
cd "/Users/tg/Opus AI Workspace/Cornwall App"

git init
git add .
git commit -m "Cornwall & Devon 2026 reiseapp"
git branch -M main
git remote add origin https://github.com/DITT-BRUKERNAVN/DITT-REPO.git
git push -u origin main
```

> Bytt ut `DITT-BRUKERNAVN/DITT-REPO` med din faktiske GitHub-adresse.

### Aktiver GitHub Pages

1. Gå til repoet på github.com
2. Klikk **Settings → Pages**
3. Under **Source**: velg `main` branch og `/ (root)`
4. Klikk **Save**
5. Siden er live på `https://DITT-BRUKERNAVN.github.io/DITT-REPO/`

### Oppdatere siden fremover

Når du gjør endringer lokalt:
```bash
cd "/Users/tg/Opus AI Workspace/Cornwall App"
git add .
git commit -m "Kort beskrivelse av endringen"
git push
```

---

## 2. Tidevann — Stormglass.io ✅

**API-nøkkel er satt opp** i `js/tides.js`.

**Slik fungerer det:**
- Første gang siden lastes: automatisk oppslag for alle 4 lokasjoner (4 API-kall)
- Data caches i nettleseren i 7 dager — ingen gjentatte kall
- Ny aktivitet med stedsnavn → geocodes via Nominatim → tidevann hentes automatisk
- Gratis plan: 10 kall/dag (mer enn nok med caching)

**Legge til tidevann for nye steder:**
Fyll inn "Sted / lokasjon"-feltet når du legger til aktivitet via mobil — resten skjer automatisk.

---

## 3. Supabase (deling av aktiviteter) ✅

**Konfigurasjon er satt opp** i `js/supabase-client.js`.

Aktiviteter som legges til via "Legg til aktivitet"-skjemaet deles mellom alle fire i sanntid.

### Om du trenger å sette opp Supabase på nytt

1. Gå til [supabase.com](https://supabase.com) → ditt prosjekt
2. Gå til **SQL Editor** og kjør:

```sql
create table if not exists activities (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  url text,
  type text default 'attraksjon',
  day int,
  added_by text,
  location_name text,
  lat float,
  lon float,
  created_at timestamptz default now()
);

alter table activities enable row level security;

create policy "Alle kan lese" on activities
  for select using (true);

create policy "Alle kan legge til" on activities
  for insert with check (true);

create policy "Alle kan slette" on activities
  for delete using (true);
```

---

## 4. Google My Maps (kart) ⏳

1. Gå til [mymaps.google.com](https://mymaps.google.com)
2. Klikk **+ Opprett nytt kart**
3. Legg til markører for alle hoteller, severdigheter og restauranter
4. Tegn reiseruten mellom stedene
5. Klikk **Del** → **Innebygd på nettsted** → kopier `<iframe ...>`-koden
6. Åpne `index.html`, finn kommentaren `<!-- PLACEHOLDER — erstatt med Google My Maps iframe -->`
7. Erstatt `<div class="map-placeholder">...</div>` med iframe-koden
8. Legg til `id="map-frame"` på iframe-taggen

---

## 5. Oppdatere innhold

All reisedata redigeres i `js/data.js`:

| Hva du vil endre | Hvor i filen |
|-----------------|--------------|
| Hotellbeskrivelser | `hotels: [...]` |
| Aktivitetstips | `activities: {...}` |
| Tidslinje per dag | `days[X].timeline` |
| "Visste du at"-fakta | `facts: [...]` |
| Spotify-spillelister | `spotify: [...]` |
| Cornisk ordbok | `cornishPhrases: [...]` |
| Tidevannskoordinater | `days[X].tideCoords` |

Etter endring: lagre filen og kjør `git add . && git commit -m "..." && git push` — siden oppdateres automatisk.

---

## 6. Filstruktur

```
cornwall-2026/
├── index.html              ← Hoveddside
├── manifest.json           ← PWA (legg til hjemskjermen)
├── css/
│   └── style.css           ← All styling
├── images/
│   └── hero.jpg            ← Kynance Cove-bilde (hero-banner)
├── js/
│   ├── data.js             ← All reisedata — rediger her
│   ├── app.js              ← App-logikk
│   ├── tides.js            ← Tidevann (Stormglass + Nominatim)
│   └── supabase-client.js  ← Deling av aktiviteter
└── SETUP.md                ← Denne filen
```

---

## 7. Del med Eirin, Stig og Pia

Når GitHub Pages er aktivert, send denne lenken:
```
https://DITT-BRUKERNAVN.github.io/DITT-REPO/
```

De kan legge den til på hjemskjermen på mobilen:
- **iPhone**: Safari → Del-knapp → "Legg til på hjemskjerm"
- **Android**: Chrome → Meny → "Legg til på startskjerm"

Da fungerer appen som en native app — uten App Store!
