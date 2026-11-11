const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const os = require('os');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EMBLEM_SVG_PATH = path.resolve(__dirname, '../public/brand/emblem.svg');
const PUBLIC_DIR = path.resolve(__dirname, '../public');

// Pack multiple PNG buffers into standard ICO format
function createIcoFromPngBuffers(pngBuffers) {
  // pngBuffers: array of { width, height, buffer }
  const count = pngBuffers.length;
  const headerSize = 6;
  const entrySize = 16;
  let offset = headerSize + (entrySize * count);

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(count, 4); // count of images

  const entries = [];
  const imageBlocks = [];

  for (const img of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // color palette count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // size of image in bytes
    entry.writeUInt32LE(offset, 12); // offset of image data

    entries.push(entry);
    imageBlocks.push(img.buffer);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...imageBlocks]);
}

async function generateFavicons() {
  console.log('Generating favicon suite from Portfolio Pro emblem.svg...');
  const svgContent = fs.readFileSync(EMBLEM_SVG_PATH, 'utf8');

  const tmpUserDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fav-profile-'));
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    userDataDir: tmpUserDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // HTML page embedding the exact SVG
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body, html { width: 100%; height: 100%; background: transparent; display: flex; align-items: center; justify-content: center; }
          svg { width: 100%; height: 100%; display: block; }
        </style>
      </head>
      <body>
        ${svgContent}
      </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });

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
    console.log(`Generated: ${item.name} (${item.size}x${item.size})`);

    if ([16, 32, 48].includes(item.size)) {
      pngBuffersForIco.push({ width: item.size, height: item.size, buffer: buf });
    }
  }

  // Generate multi-resolution favicon.ico
  const icoBuffer = createIcoFromPngBuffers(pngBuffersForIco);
  const icoPath = path.join(PUBLIC_DIR, 'favicon.ico');
  fs.writeFileSync(icoPath, icoBuffer);
  console.log(`Generated: favicon.ico (16x16, 32x32, 48x48) - ${icoBuffer.length} bytes`);

  // Also copy favicon.ico and emblem.svg to src/app/ so Next.js App Router serves it directly
  const appDir = path.resolve(__dirname, '../src/app');
  fs.copyFileSync(icoPath, path.join(appDir, 'favicon.ico'));
  fs.copyFileSync(path.join(PUBLIC_DIR, 'favicon-32x32.png'), path.join(appDir, 'icon.png'));
  fs.copyFileSync(path.join(PUBLIC_DIR, 'apple-touch-icon.png'), path.join(appDir, 'apple-icon.png'));
  console.log('Copied favicon.ico, icon.png, apple-icon.png to src/app/');

  await browser.close();
  console.log('All favicon icons successfully generated!');
}

generateFavicons().catch(err => {
  console.error('Failed to generate favicons:', err);
  process.exit(1);
});

