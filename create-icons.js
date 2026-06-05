// ============================================================
// create-icons.js — Generer app-ikoner for iOS og Android
//
// Bruk:
//   npm install canvas
//   node create-icons.js
// ============================================================

const { createCanvas } = require("canvas");
const fs   = require("fs");
const path = require("path");

const SIZES = [
  { size: 180, file: "apple-touch-icon.png" }, // iOS «Legg til på hjemskjerm»
  { size: 192, file: "icon-192.png" },          // Android PWA
  { size: 512, file: "icon-512.png" },          // Android PWA splash
];

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  const s = size;

  // ---- Bakgrunn: navy → blå gradient ----
  const grad = ctx.createLinearGradient(0, 0, s, s);
  grad.addColorStop(0, "#0a2744");
  grad.addColorStop(1, "#0a5eb5");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, s, s);

  // ---- Bølge 1 (stor, hvit) ----
  ctx.strokeStyle = "rgba(255,255,255,0.92)";
  ctx.lineWidth   = s * 0.058;
  ctx.lineCap     = "round";

  const y1  = s * 0.50;
  const amp = s * 0.085;
  const seg = s * 0.40;

  ctx.beginPath();
  ctx.moveTo(s * 0.08, y1);
  ctx.bezierCurveTo(
    s * 0.08 + seg * 0.25, y1 - amp,
    s * 0.08 + seg * 0.75, y1 - amp,
    s * 0.08 + seg,        y1
  );
  ctx.bezierCurveTo(
    s * 0.08 + seg * 1.25, y1 + amp,
    s * 0.08 + seg * 1.75, y1 + amp,
    s * 0.92,              y1
  );
  ctx.stroke();

  // ---- Bølge 2 (liten, halvgjennomsiktig) ----
  ctx.lineWidth   = s * 0.040;
  ctx.strokeStyle = "rgba(255,255,255,0.55)";

  const y2 = s * 0.645;
  const a2 = amp * 0.70;

  ctx.beginPath();
  ctx.moveTo(s * 0.18, y2);
  ctx.bezierCurveTo(
    s * 0.18 + seg * 0.25, y2 - a2,
    s * 0.18 + seg * 0.75, y2 - a2,
    s * 0.18 + seg,        y2
  );
  ctx.bezierCurveTo(
    s * 0.18 + seg * 1.25, y2 + a2,
    s * 0.18 + seg * 1.65, y2 + a2,
    s * 0.82,              y2
  );
  ctx.stroke();

  return canvas;
}

// ---- Skriv filer ----
const iconsDir = path.join(__dirname, "icons");
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir);

console.log("🎨 Lager ikoner...\n");
for (const { size, file } of SIZES) {
  const canvas = drawIcon(size);
  const out = path.join(iconsDir, file);
  fs.writeFileSync(out, canvas.toBuffer("image/png"));
  console.log(`  ✅ icons/${file}  (${size}×${size}px)`);
}

console.log(`
Ferdig! Kjør nå:
  git add icons/
  git commit -m "Legg til tilpassede app-ikoner"
  git push
`);
