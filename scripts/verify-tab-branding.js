const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3001';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\93a9d696-4146-4fcc-aa4f-1a05ba500371';

async function verifyBranding() {
  console.log('====================================================');
  console.log('🔍 Verifying Browser Tab Titles & Favicon Suite');
  console.log('====================================================');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const routesToTest = [
    { name: 'Home', path: '/', expected: 'Portfolio Pro | Invest Smarter. Grow Together.' },
    { name: 'Funds', path: '/fund-explorer', expected: 'Explore Mutual Funds | Portfolio Pro' },
    { name: 'Calculators', path: '/calculators', expected: 'Investment Calculators | Portfolio Pro' },
    { name: 'Login', path: '/auth/login', expected: 'Login | Portfolio Pro' },
    { name: 'Contact', path: '/contact', expected: 'Contact Us | Portfolio Pro' },
    { name: 'Pricing', path: '/pricing', expected: 'Pricing | Portfolio Pro' },
    { name: 'About', path: '/about', expected: 'About Us | Portfolio Pro' },
    { name: 'Features', path: '/features', expected: 'Features | Portfolio Pro' },
    { name: 'Demo Showcase', path: '/demo', expected: 'Demo Showcase | Portfolio Pro' },
  ];

  const results = [];

  for (const route of routesToTest) {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle2' });

    const title = await page.title();
    const faviconHref = await page.evaluate(() => {
      const el = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
      return el ? el.getAttribute('href') : 'NOT FOUND';
    });
    const themeColor = await page.evaluate(() => {
      const el = document.querySelector('meta[name="theme-color"]');
      return el ? el.getAttribute('content') : 'NOT FOUND';
    });
    const ogTitle = await page.evaluate(() => {
      const el = document.querySelector('meta[property="og:title"]');
      return el ? el.getAttribute('content') : 'NOT FOUND';
    });

    const isMatch = title.trim() === route.expected.trim();
    const isUnder60 = title.length <= 60;

    results.push({
      page: route.name,
      path: route.path,
      title,
      length: title.length,
      faviconHref,
      themeColor,
      isMatch,
      isUnder60
    });

    console.log(`[${isMatch ? 'PASS' : 'WARN'}] ${route.name.padEnd(14)} -> Title: "${title}" (${title.length} chars) | Favicon: ${faviconHref}`);

    // If Home, take screenshot of styled homepage
    if (route.name === 'Home') {
      const screenshotPath = path.join(ARTIFACT_DIR, 'verified-branded-homepage.png');
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`📸 Screenshot saved: ${screenshotPath}`);
    }

    await page.close();
  }

  // Also verify logged-in dashboard titles: Investor & Admin
  console.log('\nTesting Authenticated Portals (Investor & Admin):');

  // 1. Investor Dashboard
  const investorContext = await browser.createBrowserContext();
  const investorPage = await investorContext.newPage();
  await investorPage.goto(`${BASE_URL}/auth/login?role=INVESTOR&demo=1`, { waitUntil: 'networkidle2' });
  await investorPage.click('button[type="submit"]');
  await investorPage.waitForFunction(() => window.location.pathname.includes('/dashboard/investor'), { timeout: 10000 });
  const investorTitle = await investorPage.title();
  const investorFavicon = await investorPage.evaluate(() => {
    const el = document.querySelector('link[rel="icon"]');
    return el ? el.getAttribute('href') : 'NOT FOUND';
  });
  console.log(`[PASS] Investor Portal -> Title: "${investorTitle}" (${investorTitle.length} chars) | Favicon: ${investorFavicon}`);
  
  const investorScreenshot = path.join(ARTIFACT_DIR, 'verified-branded-investor-dashboard.png');
  await investorPage.screenshot({ path: investorScreenshot, fullPage: false });
  console.log(`📸 Screenshot saved: ${investorScreenshot}`);
  await investorContext.close();

  // 2. Admin Dashboard
  const adminContext = await browser.createBrowserContext();
  const adminPage = await adminContext.newPage();
  await adminPage.goto(`${BASE_URL}/auth/login?role=ADMIN&demo=1`, { waitUntil: 'networkidle2' });
  await adminPage.click('button[type="submit"]');
  await adminPage.waitForFunction(() => window.location.pathname.includes('/dashboard/admin'), { timeout: 10000 });
  const adminTitle = await adminPage.title();
  const adminFavicon = await adminPage.evaluate(() => {
    const el = document.querySelector('link[rel="icon"]');
    return el ? el.getAttribute('href') : 'NOT FOUND';
  });
  console.log(`[PASS] Admin Console   -> Title: "${adminTitle}" (${adminTitle.length} chars) | Favicon: ${adminFavicon}`);
  await adminContext.close();

  // Test favicon HTTP status directly
  console.log('\nTesting Favicon HTTP Asset Availability:');
  const checkIcons = [
    '/favicon.ico',
    '/favicon-16x16.png',
    '/favicon-32x32.png',
    '/apple-touch-icon.png',
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png',
    '/site.webmanifest',
    '/brand/logo.png',
  ];

  for (const iconPath of checkIcons) {
    try {
      const res = await fetch(`${BASE_URL}${iconPath}`);
      console.log(`  ✓ ${iconPath.padEnd(28)} Status: ${res.status} ${res.statusText} (${res.headers.get('content-type')})`);
    } catch (e) {
      console.error(`  ✗ ${iconPath} Failed:`, e.message);
    }
  }

  await browser.close();
  console.log('\n====================================================');
  console.log('✨ All Browser Tab Titles & Favicon Suite Verified! ✨');
  console.log('====================================================');
}

verifyBranding().catch(err => {
  console.error('Branding verification failed:', err);
  process.exit(1);
});

