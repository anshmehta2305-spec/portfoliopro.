const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const os = require('os');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SOURCE_IMG = 'C:/Users/Admin/.gemini/antigravity/brain/93a9d696-4146-4fcc-aa4f-1a05ba500371/.user_uploaded/media_1794384577613_409d00b8.png';
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

async function processEmblem() {
  console.log('Processing pure emblem from source:', SOURCE_IMG);
  const imgBase64 = fs.readFileSync(SOURCE_IMG).toString('base64');

  const tmpUserDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fav-clean-'));
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    userDataDir: tmpUserDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(`<!DOCTYPE html><html><body><canvas id="c"></canvas></body></html>`);

  // Analyze and extract the emblem exactly
  const cropInfo = await page.evaluate((b64) => {
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

        // Sample background color from the 4 corners
        const bgR = (data[0] + data[(img.width - 1) * 4] + data[((img.height - 1) * img.width) * 4] + data[(img.height * img.width - 1) * 4]) / 4;
        const bgG = (data[1] + data[(img.width - 1) * 4 + 1] + data[((img.height - 1) * img.width) * 4 + 1] + data[(img.height * img.width - 1) * 4 + 1]) / 4;
        const bgB = (data[2] + data[(img.width - 1) * 4 + 2] + data[((img.height - 1) * img.width) * 4 + 2] + data[(img.height * img.width - 1) * 4 + 2]) / 4;

        let minX = img.width, minY = img.height, maxX = 0, maxY = 0;

        for (let y = 0; y < img.height; y++) {
          for (let x = 0; x < img.width; x++) {
            const idx = (y * img.width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];

            // Color distance from background
            const dist = Math.sqrt(
              Math.pow(r - bgR, 2) +
              Math.pow(g - bgG, 2) +
              Math.pow(b - bgB, 2)
            );

            // If significantly different from background
            if (a > 30 && dist > 18) {
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
          minX, minY, maxX, maxY,
          emblemW: maxX - minX,
          emblemH: maxY - minY,
          bg: { r: Math.round(bgR), g: Math.round(bgG), b: Math.round(bgB) }
        });
      };
    });
  }, imgBase64);

  console.log('Detected emblem bounds:', cropInfo);

  // Now create an HTML page with the emblem centered on a square canvas with background
  const bgHex = '#' + [cropInfo.bg.r, cropInfo.bg.g, cropInfo.bg.b].map(x => x.toString(16).padStart(2, '0')).join('');
  console.log('Background Hex:', bgHex);

  const renderHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body, html { width: 100%; height: 100%; background: ${bgHex}; display: flex; align-items: center; justify-content: center; overflow: hidden; }
          #canvas {
            width: 100%;
            height: 100%;
            display: block;
          }
        </style>
      </head>
      <body>
        <canvas id="canvas"></canvas>
        <script>
          const img = new Image();
          img.src = "data:image/png;base64,${imgBase64}";
          img.onload = () => {
            const canvas = document.getElementById("canvas");
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext("2d");
            
            // Fill background with exact navy
            ctx.fillStyle = "${bgHex}";
            ctx.fillRect(0, 0, 512, 512);

            // Emblem bounds from source
            const sx = ${cropInfo.minX};
            const sy = ${cropInfo.minY};
            const sw = ${cropInfo.emblemW};
            const sh = ${cropInfo.emblemH};

            // Scale to fit nicely with ~10% padding
            const targetSize = 512 * 0.82;
            const scale = Math.min(targetSize / sw, targetSize / sh);
            const dw = sw * scale;
            const dh = sh * scale;
            const dx = (512 - dw) / 2;
            const dy = (512 - dh) / 2;

            ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
            window.__DONE = true;
          };
        </script>
      </body>
    </html>
  `;

  await page.setContent(renderHtml);
  await page.waitForFunction(() => window.__DONE === true);

  // Also save a master 512x512 emblem.png
  await page.setViewport({ width: 512, height: 512, deviceScaleFactor: 1 });
  const masterBuf = await page.screenshot({ clip: { x: 0, y: 0, width: 512, height: 512 } });
  fs.writeFileSync(path.join(PUBLIC_DIR, 'brand/emblem.png'), masterBuf);
  console.log('Saved master emblem: public/brand/emblem.png (512x512)');

  // Generate all sizes
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
      clip: { x: 0, y: 0, width: item.size, height: item.size }
    });
    fs.writeFileSync(outPath, buf);
    console.log(`Generated: ${item.name} (${item.size}x${item.size})`);

    if ([16, 32, 48].includes(item.size)) {
      pngBuffersForIco.push({ width: item.size, height: item.size, buffer: buf });
    }
  }

  // Generate multi-res favicon.ico
  const icoBuffer = createIcoFromPngBuffers(pngBuffersForIco);
  const icoPath = path.join(PUBLIC_DIR, 'favicon.ico');
  fs.writeFileSync(icoPath, icoBuffer);
  console.log(`Generated: favicon.ico - ${icoBuffer.length} bytes`);

  // Copy to src/app/
  fs.copyFileSync(icoPath, path.join(APP_DIR, 'favicon.ico'));
  fs.copyFileSync(path.join(PUBLIC_DIR, 'favicon-32x32.png'), path.join(APP_DIR, 'icon.png'));
  fs.copyFileSync(path.join(PUBLIC_DIR, 'apple-touch-icon.png'), path.join(APP_DIR, 'apple-icon.png'));
  console.log('Synced favicon.ico, icon.png, apple-icon.png to src/app/');

  await browser.close();
  console.log('Processing complete!');
}

processEmblem().catch(console.error);

