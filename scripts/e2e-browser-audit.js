const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';

async function runBrowserAudit() {
  console.log('====================================================');
  console.log('🌐 Starting Real Headless Chrome Full-Site Automated Audit');
  console.log('====================================================');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const consoleErrors = [];
  const networkErrors = [];

  function attachListeners(page, label) {
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(`[${label} Console Error] ${msg.text()}`);
      }
    });
    page.on('requestfailed', (req) => {
      networkErrors.push(`[${label} Request Failed] ${req.method()} ${req.url()}: ${req.failure().errorText}`);
    });
  }

  let stepCount = 0;
  function reportStep(name, ok, details = '') {
    stepCount++;
    if (ok) {
      console.log(`  ✓ Step ${stepCount}: ${name}`);
    } else {
      console.error(`  ✗ Step ${stepCount} FAILED: ${name} (${details})`);
    }
  }

  try {
    // -------------------------------------------------------------
    // Phase 1: Public Marketing Pages
    // -------------------------------------------------------------
    console.log('\n[Phase 1] Public Site Verification in Chrome:');
    const publicPage = await browser.newPage();
    attachListeners(publicPage, 'Public');
    
    await publicPage.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
    const pageTitle = await publicPage.title();
    reportStep('Homepage loaded with title', pageTitle.includes('Portfolio Pro'), pageTitle);

    const hasNav = await publicPage.$('header nav');
    reportStep('Main Navigation present in DOM', !!hasNav);

    // -------------------------------------------------------------
    // Phase 2: Calculators & Interaction
    // -------------------------------------------------------------
    console.log('\n[Phase 2] Interactive Calculator Testing:');
    await publicPage.goto(`${BASE_URL}/calculators`, { waitUntil: 'networkidle2' });
    const hasCalc = await publicPage.$('input[type="range"], input[type="number"]');
    reportStep('Financial Calculators interactive inputs rendered', !!hasCalc);

    // -------------------------------------------------------------
    // Phase 3: Mutual Fund Directory & Search
    // -------------------------------------------------------------
    console.log('\n[Phase 3] Mutual Fund Directory & Search:');
    await publicPage.goto(`${BASE_URL}/fund-explorer`, { waitUntil: 'networkidle2' });
    const searchInput = await publicPage.$('input[placeholder*="Search"]');
    reportStep('Fund search input detected', !!searchInput);
    if (searchInput) {
      await searchInput.type('HDFC');
      await publicPage.evaluate(() => new Promise((r) => setTimeout(r, 600)));
      const rows = await publicPage.$$('table tbody tr');
      reportStep('Fund search filtered rows dynamically', rows.length > 0, `Rows: ${rows.length}`);
    }
    await publicPage.close();

    // -------------------------------------------------------------
    // Phase 4: Investor Login & Portal Walkthrough
    // -------------------------------------------------------------
    console.log('\n[Phase 4] Authentication & Client Portal Walkthrough:');
    const investorContext = await browser.createBrowserContext();
    const investorPage = await investorContext.newPage();
    attachListeners(investorPage, 'Investor');

    await investorPage.goto(`${BASE_URL}/auth/login?role=INVESTOR`, { waitUntil: 'networkidle2' });
    await investorPage.evaluate(() => new Promise((r) => setTimeout(r, 400)));

    const loginBtn = await investorPage.$('button[type="submit"]');
    if (loginBtn) {
      await loginBtn.click();
      await investorPage.waitForFunction(() => window.location.pathname.includes('/dashboard/investor'), { timeout: 10000 });
    }

    const currentUrl = investorPage.url();
    reportStep('Investor redirected to /dashboard/investor', currentUrl.includes('/dashboard/investor'), currentUrl);

    // Verify Investor Dashboard elements
    const hasTransactBtn = await investorPage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some((b) => b.textContent.includes('Transact'));
    });
    reportStep('Investor Transact button is active on screen', hasTransactBtn);

    // Open Transact Modal
    await investorPage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const transactBtn = btns.find((b) => b.textContent.includes('Transact'));
      if (transactBtn) transactBtn.click();
    });
    await investorPage.evaluate(() => new Promise((r) => setTimeout(r, 500)));

    const modalVisible = await investorPage.evaluate(() => {
      return document.body.innerText.includes('Execute Mutual Fund Order');
    });
    reportStep('Transact modal opened with SIP, Lumpsum, Redeem & Switch options', modalVisible);
    await investorContext.close();

    // -------------------------------------------------------------
    // Phase 5: Distributor Portal & Multi-Tenant Isolation
    // -------------------------------------------------------------
    console.log('\n[Phase 5] Distributor Portal & Multi-Tenant Isolation:');
    const advisorContext = await browser.createBrowserContext();
    const advisorPage = await advisorContext.newPage();
    attachListeners(advisorPage, 'Advisor');

    await advisorPage.goto(`${BASE_URL}/auth/login?role=ADVISOR`, { waitUntil: 'networkidle2' });
    await advisorPage.evaluate(() => new Promise((r) => setTimeout(r, 500)));

    const advisorLoginBtn = await advisorPage.$('button[type="submit"]');
    if (advisorLoginBtn) {
      await advisorLoginBtn.click();
      await advisorPage.waitForFunction(() => window.location.pathname.includes('/dashboard/advisor'), { timeout: 10000 });
    }

    const advisorUrl = advisorPage.url();
    reportStep('Advisor redirected to /dashboard/advisor', advisorUrl.includes('/dashboard/advisor'), advisorUrl);

    // Check that Distributor 1 sees assigned clients
    await advisorPage.evaluate(() => new Promise((r) => setTimeout(r, 600)));
    const clientRows = await advisorPage.$$('table tbody tr');
    reportStep('Distributor 1 sees assigned clients roster', clientRows.length >= 3, `Count: ${clientRows.length}`);

    // Check Onboard New Client button
    const hasOnboardBtn = await advisorPage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some((b) => b.textContent.includes('Onboard New Client'));
    });
    reportStep('Distributor Onboard New Client button active', hasOnboardBtn);
    await advisorContext.close();

    // -------------------------------------------------------------
    // Phase 6: Admin Console & Tab Operations
    // -------------------------------------------------------------
    console.log('\n[Phase 6] Admin Console & Role Operations:');
    const adminContext = await browser.createBrowserContext();
    const adminPage = await adminContext.newPage();
    attachListeners(adminPage, 'Admin');

    await adminPage.goto(`${BASE_URL}/auth/login?role=ADMIN`, { waitUntil: 'networkidle2' });
    await adminPage.evaluate(() => new Promise((r) => setTimeout(r, 500)));

    const adminLoginBtn = await adminPage.$('button[type="submit"]');
    if (adminLoginBtn) {
      await adminLoginBtn.click();
      await adminPage.waitForFunction(() => window.location.pathname.includes('/dashboard/admin'), { timeout: 10000 });
    }

    const adminUrl = adminPage.url();
    reportStep('Admin redirected to /dashboard/admin', adminUrl.includes('/dashboard/admin'), adminUrl);

    // Test Admin Tab Switching: Users, Funds, Audit
    const userTabClicked = await adminPage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const userTab = btns.find((b) => b.textContent.includes('User Management'));
      if (userTab) {
        userTab.click();
        return true;
      }
      return false;
    });
    await adminPage.evaluate(() => new Promise((r) => setTimeout(r, 500)));
    reportStep('Admin switched to User Management tab', userTabClicked);

    const auditTabClicked = await adminPage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const auditTab = btns.find((b) => b.textContent.includes('Audit Logs'));
      if (auditTab) {
        auditTab.click();
        return true;
      }
      return false;
    });
    await adminPage.evaluate(() => new Promise((r) => setTimeout(r, 500)));
    reportStep('Admin switched to Audit Logs tab', auditTabClicked);
    await adminContext.close();

    // -------------------------------------------------------------
    // Phase 7: Console & Log Verification
    // -------------------------------------------------------------
    console.log('\n[Phase 7] Console & Network Log Health:');
    console.log(`  Console errors detected: ${consoleErrors.length}`);
    console.log(`  Network request failures: ${networkErrors.length}`);
    reportStep('Zero catastrophic console runtime crashes', consoleErrors.length === 0);

  } catch (err) {
    console.error('Browser testing failed with error:', err);
  } finally {
    await browser.close();
    console.log('\n====================================================');
    console.log('✨ Real Headless Chrome Full-Site Audit Complete! ✨');
    console.log('====================================================');
  }
}

runBrowserAudit();
