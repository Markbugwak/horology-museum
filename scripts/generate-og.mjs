import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const width = 1200;
const height = 630;
const hero = await readFile(new URL('../public/images/hero-watch.svg', import.meta.url));
const overlay = Buffer.from(`<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="none"/>
  <path d="M72 88H150" stroke="#B89A5E" stroke-width="2"/>
  <text x="72" y="75" fill="#5E6258" font-family="Arial,sans-serif" font-size="14" letter-spacing="3">AN INDEPENDENT WATCH MUSEUM</text>
  <text x="68" y="240" fill="#20251F" font-family="Georgia,serif" font-size="94" letter-spacing="-4">HOROLOGY</text>
  <text x="74" y="300" fill="#20251F" font-family="Georgia,serif" font-size="36" font-style="italic">Time, made mechanical.</text>
  <path d="M74 350H530" stroke="#C9C5B8" stroke-width="1"/>
  <text x="74" y="392" fill="#5E6258" font-family="Arial,sans-serif" font-size="16">THREE ORIGINAL WATCH STUDIES</text>
  <text x="74" y="421" fill="#5E6258" font-family="Arial,sans-serif" font-size="16">ANATOMY · DESIGN · HISTORY</text>
  <text x="74" y="572" fill="#77786E" font-family="Arial,sans-serif" font-size="12" letter-spacing="2">EDUCATIONAL PROJECT · CONCEPTUAL ARCHETYPES</text>
</svg>`);
await sharp({
  create: { width, height, channels: 3, background: '#f5f3ed' },
})
  .composite([
    { input: await sharp(hero).resize(560, 610, { fit: 'contain', background: '#f5f3ed' }).png().toBuffer(), left: 625, top: 10 },
    { input: overlay, left: 0, top: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(fileURLToPath(new URL('../public/images/og-horology.png', import.meta.url)));
process.stdout.write('Generated public/images/og-horology.png (1200×630)\n');
