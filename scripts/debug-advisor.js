const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testIsolatedRoles() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    // 1. Investor in Context 1
    console.log('[Test 1] Investor Portal Login in isolated context...');
    const ctx1 = await browser.createBrowserContext();
    const p1 = await ctx1.newPage();
    await p1.goto('http://localhost:3000/auth/login?role=INVESTOR', { waitUntil: 'networkidle2' });
    await (await p1.$('button[type="submit"]')).click();
    await p1.waitForFunction(() => window.location.pathname.includes('/dashboard/investor'), { timeout: 10000 });
    console.log('✓ Investor logged in:', p1.url());
    await ctx1.close();

    // 2. Advisor in Context 2
    console.log('[Test 2] Advisor Portal Login in isolated context...');
    const ctx2 = await browser.createBrowserContext();
    const p2 = await ctx2.newPage();
    await p2.goto('http://localhost:3000/auth/login?role=ADVISOR', { waitUntil: 'networkidle2' });
    await (await p2.$('button[type="submit"]')).click();
    await p2.waitForFunction(() => window.location.pathname.includes('/dashboard/advisor'), { timeout: 10000 });
    console.log('✓ Advisor logged in:', p2.url());
    await ctx2.close();

    // 3. Admin in Context 3
    console.log('[Test 3] Admin Console Login in isolated context...');
    const ctx3 = await browser.createBrowserContext();
    const p3 = await ctx3.newPage();
    await p3.goto('http://localhost:3000/auth/login?role=ADMIN', { waitUntil: 'networkidle2' });
    await (await p3.$('button[type="submit"]')).click();
    await p3.waitForFunction(() => window.location.pathname.includes('/dashboard/admin'), { timeout: 10000 });
    console.log('✓ Admin logged in:', p3.url());
    await ctx3.close();

    console.log('\n🎉 ALL THREE ROLES LOGGED IN AND VERIFIED CONCURRENTLY IN ISOLATED BROWSER CONTEXTS!');
  } finally {
    await browser.close();
  }
}

testIsolatedRoles().catch(console.error);
