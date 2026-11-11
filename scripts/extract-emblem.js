const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const LOGO_SRC = path.resolve(__dirname, '../public/brand/logo.png');
const USER_LOGO = 'C:/Users/Admin/.gemini/antigravity/brain/93a9d696-4146-4fcc-aa4f-1a05ba500371/.user_uploaded/media_1794383554535_6029a5c4.png';
const OUT_EMBLEM = path.resolve(__dirname, '../public/brand/emblem.png');

async function extract() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // Load the logo
  const logoData = fs.readFileSync(LOGO_SRC).toString('base64');
  const userLogoData = fs.existsSync(USER_LOGO) ? fs.readFileSync(USER_LOGO).toString('base64') : null;

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:transparent;">
        <canvas id="c"></canvas>
      </body>
    </html>
  `;
  await page.setContent(html);

  const emblemResult = await page.evaluate((b64Logo, b64User) => {
    return new Promise((resolve) => {
      const img = new Image();
      // Prefer high-res logo.png
      img.src = 'data:image/png;base64,' + (b64Logo || b64User);
      img.onload = () => {
        const canvas = document.getElementById('c');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imgData.data;

        // Find the bounding box of the emblem (the icon on the left of "Portfolio Pro")
        // We scan pixels that are blue/cyan/purple
        let minX = img.width, minY = img.height, maxX = 0, maxY = 0;
        
        // Scan only the left 35% of the image where the emblem is
        const searchWidth = Math.floor(img.width * 0.35);

        for (let y = 0; y < img.height; y++) {
          for (let x = 0; x < searchWidth; x++) {
            const idx = (y * img.width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];

            // If pixel is visible and not dark background (e.g. has color)
            // Look for blue/cyan/gradient colors
            if (a > 30 && (b > 100 || g > 100)) {
              if (x < minX) minX = x;
              if (y < minY) minY = y;
              if (x > maxX) maxX = x;
              if (y > maxY) maxY = y;
            }
          }
        }

        // If found, crop emblem onto a square canvas with padding
        if (maxX > minX && maxY > minY) {
          const emblemW = maxX - minX;
          const emblemH = maxY - minY;
          const maxDim = Math.max(emblemW, emblemH);
          
          // Create square canvas with ~15% padding
          const pad = Math.round(maxDim * 0.15);
          const sqSize = maxDim + (pad * 2);

          const outCanvas = document.createElement('canvas');
          outCanvas.width = sqSize;
          outCanvas.height = sqSize;
          const outCtx = outCanvas.getContext('2d');

          // Optional: draw dark navy rounded backing or transparent backing
          // Center the emblem
          const destX = pad + Math.round((maxDim - emblemW) / 2);
          const destY = pad + Math.round((maxDim - emblemH) / 2);

          outCtx.drawImage(
            canvas,
            minX, minY, emblemW, emblemH,
            destX, destY, emblemW, emblemH
          );

          resolve({
            success: true,
            box: { minX, minY, maxX, maxY, emblemW, emblemH },
            dataUrl: outCanvas.toDataURL('image/png')
          });
        } else {
          resolve({ success: false });
        }
      };
    });
  }, logoData, userLogoData);

  console.log('Emblem crop result:', emblemResult.box);

  if (emblemResult.success) {
    const base64Data = emblemResult.dataUrl.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync(OUT_EMBLEM, Buffer.from(base64Data, 'base64'));
    console.log('Saved exact emblem to:', OUT_EMBLEM);
  }

  await browser.close();
}

extract().catch(console.error);
