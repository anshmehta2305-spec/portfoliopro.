const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const os = require('os');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SOURCE_IMG = 'C:/Users/Admin/.gemini/antigravity/brain/93a9d696-4146-4fcc-aa4f-1a05ba500371/.user_uploaded/media_1794385155925_8a57f136.png';
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const APP_DIR = path.resolve(__dirname, '../src/app');

function createIcoFromPngBuffers(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6;
  const entrySize = 16;
  let offset = headerSize + (entrySize * count);

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const entries = [];
  const imageBlocks = [];

  for (const img of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(img.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);

    entries.push(entry);
    imageBlocks.push(img.buffer);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...imageBlocks]);
}

async function run() {
  console.log('Loading source:', SOURCE_IMG);
  const imgBase64 = fs.readFileSync(SOURCE_IMG).toString('base64');

  const tmpUserDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fav-trans-'));
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    userDataDir: tmpUserDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent('<!DOCTYPE html><html><body><canvas id="c"></canvas></body></html>');

  const info = await page.evaluate((b64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = 'data:image/png;base64,' + b64;
      img.onload = () => {
        const c = document.getElementById('c');
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imgData.data;

        // Sample background color from corner (0, 0)
        const cornerR = data[0];
        const cornerG = data[1];
        const cornerB = data[2];
        const cornerA = data[3];

        let minX = img.width, minY = img.height, maxX = 0, maxY = 0;

        for (let y = 0; y < img.height; y++) {
          for (let x = 0; x < img.width; x++) {
            const idx = (y * img.width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];

            // Check if pixel is NOT background (if background is white: r>240, g>240, b>240, or alpha == 0)
            const isWhite = r > 240 && g > 240 && b > 240;
            const isTransparent = a < 20;

            if (!isWhite && !isTransparent) {
              if (x < minX) minX = x;
              if (y < minY) minY = y;
              if (x > maxX) maxX = x;
              if (y > maxY) maxY = y;
            }
          }
        }

        resolve({
          width: img.width,
          height: img.height,
          corner: [cornerR, cornerG, cornerB, cornerA],
          minX, minY, maxX, maxY,
          emblemW: maxX - minX,
          emblemH: maxY - minY
        });
      };
    });
  }, imgBase64);

  console.log('Detected emblem on white/transparent:', info);

  // Now create TRANSPARENT favicon with the emblem isolated
  // We make all white/near-white pixels completely transparent!
  const renderHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body, html { width: 100%; height: 100%; background: transparent; overflow: hidden; }
          canvas { width: 100%; height: 100%; display: block; }
        </style>
      </head>
      <body>
        <canvas id="out"></canvas>
        <script>
          const img = new Image();
          img.src = "data:image/png;base64,${imgBase64}";
          img.onload = () => {
            const srcCanvas = document.createElement("canvas");
            srcCanvas.width = img.width;
            srcCanvas.height = img.height;
            const sCtx = srcCanvas.getContext("2d");
            sCtx.drawImage(img, 0, 0);

            // Bounding box
            const sx = ${info.minX};
            const sy = ${info.minY};
            const sw = ${info.emblemW};
            const sh = ${info.emblemH};

            // Crop to temporary canvas
            const cropCanvas = document.createElement("canvas");
            cropCanvas.width = sw;
            cropCanvas.height = sh;
            const cCtx = cropCanvas.getContext("2d");
            cCtx.drawImage(srcCanvas, sx, sy, sw, sh, 0, 0, sw, sh);

            // Make white background transparent
            const imgData = cCtx.getImageData(0, 0, sw, sh);
            const d = imgData.data;
            for (let i = 0; i < d.length; i += 4) {
              const r = d[i];
              const g = d[i + 1];
              const b = d[i + 2];
              // If near white, make transparent with soft feathering
              if (r > 240 && g > 240 && b > 240) {
                d[i + 3] = 0;
              } else if (r > 210 && g > 210 && b > 210) {
                const whiteness = (r + g + b) / 3;
                const factor = (240 - whiteness) / 30; // 0 to 1
                d[i + 3] = Math.round(d[i + 3] * Math.max(0, Math.min(1, factor)));
              }
            }
            cCtx.putImageData(imgData, 0, 0);

            // Draw onto 512x512 transparent canvas
            const outCanvas = document.getElementById("out");
            outCanvas.width = 512;
            outCanvas.height = 512;
            const oCtx = outCanvas.getContext("2d");
            oCtx.clearRect(0, 0, 512, 512);

            // Scale to fill ~92% for maximum visibility and sharpness in browser tabs
            const targetSize = 512 * 0.92;
            const scale = Math.min(targetSize / sw, targetSize / sh);
            const dw = sw * scale;
            const dh = sh * scale;
            const dx = (512 - dw) / 2;
            const dy = (512 - dh) / 2;

            oCtx.drawImage(cropCanvas, 0, 0, sw, sh, dx, dy, dw, dh);
            window.__DONE = true;
          };
        </script>
      </body>
    </html>
  `;

  await page.setContent(renderHtml);
  await page.waitForFunction(() => window.__DONE === true);

  // Generate transparent 512x512 emblem.png
  await page.setViewport({ width: 512, height: 512, deviceScaleFactor: 1 });
  const masterBuf = await page.screenshot({
    omitBackground: true,
    clip: { x: 0, y: 0, width: 512, height: 512 }
  });
  fs.writeFileSync(path.join(PUBLIC_DIR, 'brand/emblem.png'), masterBuf);
  console.log('Saved transparent master emblem: public/brand/emblem.png (512x512)');

  // Generate all sizes transparently
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 }
  ];

  const pngBuffersForIco = [];

  for (const item of sizes) {
    await page.setViewport({ width: item.size, height: item.size, deviceScaleFactor: 1 });
    const outPath = path.join(PUBLIC_DIR, item.name);
    const buf = await page.screenshot({
      omitBackground: true,
      clip: { x: 0, y: 0, width: item.size, height: item.size }
    });
    fs.writeFileSync(outPath, buf);
    console.log(`Generated: ${item.name} (${item.size}x${item.size}) - transparent`);

    if ([16, 32, 48].includes(item.size)) {
      pngBuffersForIco.push({ width: item.size, height: item.size, buffer: buf });
    }
  }

  // Generate transparent multi-res favicon.ico
  const icoBuffer = createIcoFromPngBuffers(pngBuffersForIco);
  const icoPath = path.join(PUBLIC_DIR, 'favicon.ico');
  fs.writeFileSync(icoPath, icoBuffer);
  console.log(`Generated: favicon.ico - ${icoBuffer.length} bytes (transparent)`);

  // Sync to src/app/
  fs.copyFileSync(icoPath, path.join(APP_DIR, 'favicon.ico'));
  fs.copyFileSync(path.join(PUBLIC_DIR, 'favicon-32x32.png'), path.join(APP_DIR, 'icon.png'));
  fs.copyFileSync(path.join(PUBLIC_DIR, 'apple-touch-icon.png'), path.join(APP_DIR, 'apple-icon.png'));
  console.log('Synced transparent icons to src/app/');

  await browser.close();
  console.log('Transparent favicon generation complete!');
}

run().catch(console.error);
