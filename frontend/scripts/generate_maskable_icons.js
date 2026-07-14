import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createMaskableIcon(size, filename, outFilename) {
  const publicDir = path.resolve(__dirname, '../public');
  const inputPath = path.join(publicDir, filename);
  const outputPath = path.join(publicDir, outFilename);

  // The safe zone is a circle with a radius of 40% of the image size.
  // To ensure the current logo fits in the safe zone, we scale it down to 80% (0.8) and add transparent padding to 100%.
  // 192 * 0.8 = 153.6 -> let's say scale down to 75% to be very safe.
  
  const innerSize = Math.round(size * 0.7);
  
  await sharp(inputPath)
    .resize(innerSize, innerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: Math.floor((size - innerSize) / 2),
      bottom: Math.ceil((size - innerSize) / 2),
      left: Math.floor((size - innerSize) / 2),
      right: Math.ceil((size - innerSize) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toFile(outputPath);
    
  console.log(`Generated ${outFilename}`);
}

async function main() {
  try {
    await createMaskableIcon(192, 'logo-192.png', 'logo-192-maskable.png');
    await createMaskableIcon(512, 'logo-512.png', 'logo-512-maskable.png');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
