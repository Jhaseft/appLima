// Optimiza los assets de imagen: WebP para las usadas con require() en la UI
// y PNG recomprimido para las que exige Expo (icono, splash, notificación).
// Uso: node scripts/optimize-assets.mjs
import sharp from "sharp";
import { statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const img = (p) => join(root, "assets/images", p);
const kb = (p) => (statSync(p).size / 1024).toFixed(1) + " KB";

async function toWebp(src, out, width, quality = 85) {
  const before = kb(img(src));
  await sharp(img(src))
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(img(out));
  console.log(`WEBP ${src} (${before}) -> ${out} (${kb(img(out))})`);
}

async function optimizePng(src, width) {
  const before = kb(img(src));
  const buf = await sharp(img(src))
    .resize({ width, withoutEnlargement: true })
    .png({ compressionLevel: 9, quality: 90, effort: 10, palette: true })
    .toBuffer();
  await sharp(buf).toFile(img(src));
  console.log(`PNG  ${src} (${before}) -> (${kb(img(src))})`);
}

async function main() {
  // WebP para UI (require)
  await toWebp("Logo_web_03.png", "Logo_web_03.webp", 1200);
  await toWebp("logo.png", "logo.webp", 256);
  await toWebp("logopro2nobg.png", "logopro2nobg.webp", 640);
  await toWebp("logopro2.png", "logopro2.webp", 128);

  // PNG que exige Expo (config): recomprimir manteniendo formato
  await optimizePng("logopro2.png", 1024); // icono app (stores requieren 1024)
  await optimizePng("logopro2nobg.png", 1200); // splash + favicon
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
