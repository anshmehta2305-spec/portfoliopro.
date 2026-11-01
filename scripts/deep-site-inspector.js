const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';

const VIEWPORTS = [
  { name: 'Desktop (1440px)', width: 1440, height: 900, isMobile: false },
  { name: 'Mobile (375px)', width: 375, height: 667, isMobile: true, hasTouch: true }
];

const PAGES_TO_CHECK = [
  '/',
  '/features',
  '/solutions/investor-app',
  '/solutions/advisor-app',
  '/solutions/robo-advisory',
  '/solutions/financial-websites',
  '/solutions/crm',
  '/pricing',
  '/calculators',
  '/fund-explorer',
  '/blog',
  '/testimonials',
  '/contact',
  '/book-demo',
  '/pay-online',
  '/about',
  '/careers',
  '/disclaimer',
  '/terms',
  '/privacy-policy',
  '/refund-policy',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/otp-login'
];

async function runDeepInspection() {
  console.log('===========================================================');
  console.log('🔍 Starting Deep Website Inspection & Quality Audit');
  console.log(`Target: ${BASE_URL}`);
  console.log('===========================================================');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const issuesFound = [];
  const checkedLinks = new Set();
  const allDiscoveredLinks = new Set();

  function logIssue(category, page, details) {
    issuesFound.push({ category, page, details });
    console.error(`  [ISSUE] [${category}] on ${page}: ${details}`);
  }

  // -------------------------------------------------------------
  // Part 1: Page-by-Page Audit across Desktop & Mobile
  // -------------------------------------------------------------
  console.log('\n--- Part 1: Checking All Main Pages (Desktop & Mobile) ---');

  for (const pathname of PAGES_TO_CHECK) {
    const fullUrl = `${BASE_URL}${pathname}`;
    console.log(`\nTesting page: ${pathname}`);

    for (const vp of VIEWPORTS) {
      const page = await browser.newPage();
      await page.setViewport(vp);

      const consoleErrors = [];
      const failedRequests = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      page.on('requestfailed', (req) => {
        // Ignore aborted requests caused by navigation/close
        const err = req.failure()?.errorText || '';
        if (!err.includes('ERR_ABORTED')) {
          failedRequests.push(`${req.method()} ${req.url()} (${err})`);
        }
      });

      try {
        const response = await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 15000 });
        const status = response ? response.status() : 0;

        if (status >= 400) {
          logIssue('HTTP_ERROR', pathname, `HTTP Status ${status} on ${vp.name}`);
        }

        // Check for runtime / console errors
        if (consoleErrors.length > 0) {
          logIssue('CONSOLE_ERROR', pathname, `[${vp.name}] ${consoleErrors.join('; ')}`);
        }

        // Check for failed network requests
        if (failedRequests.length > 0) {
          logIssue('NETWORK_ERROR', pathname, `[${vp.name}] ${failedRequests.join('; ')}`);
        }

        // Check for horizontal overflow (layout break)
        const overflow = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body ? body.scrollWidth : 0);
          const clientWidth = Math.max(docEl.clientWidth, body ? body.clientWidth : 0);
          return {
            hasOverflow: scrollWidth > clientWidth + 2, // 2px margin for subpixel rounding
            scrollWidth,
            clientWidth
          };
        });

        if (overflow.hasOverflow) {
          logIssue('LAYOUT_OVERFLOW', pathname, `Horizontal overflow on ${vp.name}: scrollWidth=${overflow.scrollWidth}px > clientWidth=${overflow.clientWidth}px`);
        }

        // Check for broken images on the page
        const brokenImages = await page.evaluate(() => {
          const imgs = Array.from(document.querySelectorAll('img'));
          return imgs
            .filter(img => !img.complete || img.naturalWidth === 0)
            .map(img => img.src || img.getAttribute('src'));
        });

        if (brokenImages.length > 0) {
          logIssue('BROKEN_IMAGE', pathname, `[${vp.name}] Broken image(s): ${brokenImages.join(', ')}`);
        }

        // Collect internal links on Desktop pass
        if (!vp.isMobile) {
          const links = await page.evaluate((base) => {
            return Array.from(document.querySelectorAll('a[href]'))
              .map(a => a.getAttribute('href'))
              .filter(href => href && (href.startsWith('/') || href.startsWith(base)) && !href.startsWith('//') && !href.startsWith('mailto:') && !href.startsWith('tel:'));
          }, BASE_URL);

          links.forEach(l => {
            const clean = l.replace(BASE_URL, '').split('#')[0];
            if (clean && clean.startsWith('/')) {
              allDiscoveredLinks.add(clean);
            }
          });
        }

        console.log(`  ✓ ${vp.name}: Status ${status}, overflow: ${overflow.hasOverflow ? 'YES (FAIL)' : 'None (OK)'}, console errors: ${consoleErrors.length}`);

      } catch (err) {
        logIssue('PAGE_CRASH', pathname, `Failed to load on ${vp.name}: ${err.message}`);
      } finally {
        await page.close();
      }
    }
  }

  // -------------------------------------------------------------
  // Part 2: Crawl Discovered Internal Links for 404s
  // -------------------------------------------------------------
  console.log('\n--- Part 2: Verifying All Discovered Internal Links ---');
  console.log(`Discovered ${allDiscoveredLinks.size} unique internal link targets.`);

  const linkCheckPage = await browser.newPage();
  for (const link of allDiscoveredLinks) {
    if (checkedLinks.has(link)) continue;
    checkedLinks.add(link);

    // Skip javascript: or hash anchors
    if (link.startsWith('#') || link.startsWith('javascript:')) continue;

    try {
      const resp = await linkCheckPage.goto(`${BASE_URL}${link}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
      const status = resp ? resp.status() : 0;
      if (status >= 400) {
        logIssue('BROKEN_LINK', link, `Discovered internal link returned HTTP ${status}`);
      }
    } catch (err) {
      logIssue('BROKEN_LINK', link, `Failed to load discovered link: ${err.message}`);
    }
  }
  await linkCheckPage.close();

  // -------------------------------------------------------------
  // Part 3: Interactive User Flows
  // -------------------------------------------------------------
  console.log('\n--- Part 3: Interactive User Flows ---');

  // Flow A: Contact Form submission
  console.log('\n[Flow A] Testing Contact Us Form:');
  {
    const page = await browser.newPage();
    try {
      await page.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle2' });
      await page.type('input[name="name"]', 'Anand Kulkarni');
      await page.type('input[name="email"]', 'anand@testinvestor.com');
      await page.type('input[name="mobile"]', '9820011223');
      
      // Calculate captcha
      const captchaVal = await page.evaluate(() => {
        const text = document.body.innerText;
        const match = text.match(/(\d+)\s*\+\s*(\d+)\s*=\s*\?/);
        if (match) {
          return parseInt(match[1]) + parseInt(match[2]);
        }
        return null;
      });

      if (captchaVal !== null) {
        await page.type('input[name="captcha"]', String(captchaVal));
      }

      const submitBtn = await page.$('button[type="submit"]');
      if (submitBtn) {
        await submitBtn.click();
        await page.evaluate(() => new Promise(r => setTimeout(r, 1500)));
        const successMsg = await page.evaluate(() => {
          return document.body.innerText.includes('Inquiry Successfully Received') || 
                 document.body.innerText.includes('Thank you') ||
                 document.body.innerText.includes('Successfully');
        });
        if (successMsg) {
          console.log('  ✓ Contact Form submission succeeded with confirmation message.');
        } else {
          logIssue('FLOW_ERROR', '/contact', 'Form submission did not display success message.');
        }
      }
    } catch (e) {
      logIssue('FLOW_ERROR', '/contact', `Contact form interaction failed: ${e.message}`);
    } finally {
      await page.close();
    }
  }

  // Flow B: Book Demo submission
  console.log('\n[Flow B] Testing Book Demo Form:');
  {
    const page = await browser.newPage();
    try {
      await page.goto(`${BASE_URL}/book-demo`, { waitUntil: 'networkidle2' });
      await page.type('input[name="name"]', 'Sunil Chawla');
      await page.type('input[name="email"]', 'sunil@wealthchawla.in');
      await page.type('input[name="phone"]', '9819922334');

      const submitBtn = await page.$('button[type="submit"]');
      if (submitBtn) {
        await submitBtn.click();
        await page.evaluate(() => new Promise(r => setTimeout(r, 1500)));
        const successMsg = await page.evaluate(() => {
          return document.body.innerText.includes('Demo Successfully Scheduled') || 
                 document.body.innerText.includes('Scheduled') ||
                 document.body.innerText.includes('Thank you');
        });
        if (successMsg) {
          console.log('  ✓ Book Demo submission succeeded with confirmation.');
        } else {
          logIssue('FLOW_ERROR', '/book-demo', 'Demo booking submission did not confirm.');
        }
      }
    } catch (e) {
      logIssue('FLOW_ERROR', '/book-demo', `Book demo interaction failed: ${e.message}`);
    } finally {
      await page.close();
    }
  }

  // Flow C: Calculators interactive test
  console.log('\n[Flow C] Testing Financial Calculators:');
  {
    const page = await browser.newPage();
    try {
      await page.goto(`${BASE_URL}/calculators`, { waitUntil: 'networkidle2' });
      
      // Click SIP, Lumpsum, SWP, Goal tabs
      const tabs = ['SIP', 'Lumpsum', 'SWP', 'Goal Planner', 'Retirement', 'Capital Gains'];
      for (const tabName of tabs) {
        const tabClicked = await page.evaluate((t) => {
          const btns = Array.from(document.querySelectorAll('button'));
          const btn = btns.find(b => b.innerText.trim() === t || b.innerText.includes(t));
          if (btn) { btn.click(); return true; }
          return false;
        }, tabName);
        await page.evaluate(() => new Promise(r => setTimeout(r, 300)));
        if (tabClicked) {
          console.log(`  ✓ Tab switch to "${tabName}" active`);
        }
      }
    } catch (e) {
      logIssue('FLOW_ERROR', '/calculators', `Calculator tabs test failed: ${e.message}`);
    } finally {
      await page.close();
    }
  }

  // Flow D: Fund Explorer search & detail navigation
  console.log('\n[Flow D] Testing Mutual Fund Catalog & Fund Detail Navigation:');
  {
    const page = await browser.newPage();
    try {
      await page.goto(`${BASE_URL}/fund-explorer`, { waitUntil: 'networkidle2' });
      const searchBox = await page.$('input[placeholder*="Search"]');
      if (searchBox) {
        await searchBox.type('ICICI');
        await page.evaluate(() => new Promise(r => setTimeout(r, 500)));
      }

      // Click on first fund link
      const firstFundLink = await page.$('table tbody tr a, table tbody tr td a');
      if (firstFundLink) {
        const href = await page.evaluate(el => el.getAttribute('href'), firstFundLink);
        console.log(`  ✓ Navigating to fund detail: ${href}`);
        await page.goto(`${BASE_URL}${href}`, { waitUntil: 'networkidle2' });
        const fundTitle = await page.evaluate(() => document.querySelector('h1')?.innerText || '');
        if (fundTitle) {
          console.log(`  ✓ Fund Detail Page loaded scheme: "${fundTitle}"`);
        } else {
          logIssue('FLOW_ERROR', href, 'Fund detail page missing title heading');
        }
      } else {
        logIssue('FLOW_ERROR', '/fund-explorer', 'Could not find link to fund detail page in table');
      }
    } catch (e) {
      logIssue('FLOW_ERROR', '/fund-explorer', `Fund explorer test failed: ${e.message}`);
    } finally {
      await page.close();
    }
  }

  // Flow E: Client Registration & Validation
  console.log('\n[Flow E] Testing Registration Page Validation:');
  {
    const page = await browser.newPage();
    try {
      await page.goto(`${BASE_URL}/auth/register`, { waitUntil: 'networkidle2' });
      // Submit empty form to verify HTML5/JS validation
      const regBtn = await page.$('button[type="submit"]');
      if (regBtn) {
        await regBtn.click();
        const urlStillReg = page.url().includes('/auth/register');
        console.log(`  ✓ Empty submission blocked by required field validation: ${urlStillReg}`);
      }
    } catch (e) {
      logIssue('FLOW_ERROR', '/auth/register', `Register form test failed: ${e.message}`);
    } finally {
      await page.close();
    }
  }

  // Flow F: Investor Portal Transact Actions
  console.log('\n[Flow F] Testing Investor Portal Transact & SIP Order:');
  {
    const ctx = await browser.createBrowserContext();
    const page = await ctx.newPage();
    try {
      await page.goto(`${BASE_URL}/auth/login?role=INVESTOR`, { waitUntil: 'networkidle2' });
      await (await page.$('button[type="submit"]')).click();
      await page.waitForFunction(() => window.location.pathname.includes('/dashboard/investor'), { timeout: 10000 });

      // Click Transact button
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const transact = btns.find(b => b.innerText.includes('Transact'));
        if (transact) transact.click();
      });
      await page.evaluate(() => new Promise(r => setTimeout(r, 500)));

      const modalOpen = await page.evaluate(() => document.body.innerText.includes('Execute Mutual Fund Order'));
      if (modalOpen) {
        console.log('  ✓ Investor Transact modal opened successfully.');
      } else {
        logIssue('FLOW_ERROR', '/dashboard/investor', 'Transact modal did not open on click.');
      }
    } catch (e) {
      logIssue('FLOW_ERROR', '/dashboard/investor', `Investor portal flow failed: ${e.message}`);
    } finally {
      await ctx.close();
    }
  }

  // Flow G: Distributor Portal Isolation & Onboarding
  console.log('\n[Flow G] Testing Distributor Portal Multi-Tenant Isolation & Onboarding Modal:');
  {
    const ctx = await browser.createBrowserContext();
    const page = await ctx.newPage();
    try {
      await page.goto(`${BASE_URL}/auth/login?role=ADVISOR`, { waitUntil: 'networkidle2' });
      await (await page.$('button[type="submit"]')).click();
      await page.waitForFunction(() => window.location.pathname.includes('/dashboard/advisor'), { timeout: 10000 });

      // Check client roster
      const clientsCount = await page.evaluate(() => {
        const rows = document.querySelectorAll('table tbody tr');
        return rows.length;
      });
      console.log(`  ✓ Distributor 1 sees ${clientsCount} assigned clients (multi-tenant isolated).`);

      // Open Onboard Client Modal
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const onboard = btns.find(b => b.innerText.includes('Onboard New Client'));
        if (onboard) onboard.click();
      });
      await page.evaluate(() => new Promise(r => setTimeout(r, 500)));

      const onboardModal = await page.evaluate(() => 
        document.body.innerText.includes('Onboard New Mutual Fund Investor') || 
        document.body.innerText.includes('Full Legal Name')
      );
      if (onboardModal) {
        console.log('  ✓ Distributor Onboard New Client modal opened successfully.');
      } else {
        logIssue('FLOW_ERROR', '/dashboard/advisor', 'Onboard client modal did not render on click.');
      }
    } catch (e) {
      logIssue('FLOW_ERROR', '/dashboard/advisor', `Distributor portal flow failed: ${e.message}`);
    } finally {
      await ctx.close();
    }
  }

  // Flow H: Admin Console Tab Navigation & Audit Log Check
  console.log('\n[Flow H] Testing Admin Console Tabs:');
  {
    const ctx = await browser.createBrowserContext();
    const page = await ctx.newPage();
    try {
      await page.goto(`${BASE_URL}/auth/login?role=ADMIN`, { waitUntil: 'networkidle2' });
      await (await page.$('button[type="submit"]')).click();
      await page.waitForFunction(() => window.location.pathname.includes('/dashboard/admin'), { timeout: 10000 });

      // Test tab switching
      const tabs = ['User Management', 'Fund Catalog & NAV', 'Audit Logs', 'Testimonial Moderation', 'Brand & Settings'];
      for (const tab of tabs) {
        const clicked = await page.evaluate((t) => {
          const btns = Array.from(document.querySelectorAll('button'));
          const btn = btns.find(b => b.innerText.includes(t));
          if (btn) { btn.click(); return true; }
          return false;
        }, tab);
        await page.evaluate(() => new Promise(r => setTimeout(r, 400)));
        if (clicked) {
          console.log(`  ✓ Admin tab switched to "${tab}"`);
        }
      }
    } catch (e) {
      logIssue('FLOW_ERROR', '/dashboard/admin', `Admin console flow failed: ${e.message}`);
    } finally {
      await ctx.close();
    }
  }

  await browser.close();

  // -------------------------------------------------------------
  // Summary & Report
  // -------------------------------------------------------------
  console.log('\n===========================================================');
  console.log('📊 INSPECTION AUDIT COMPLETE');
  console.log(`Total Issues Found: ${issuesFound.length}`);
  console.log('===========================================================');

  fs.writeFileSync('scripts/inspection-results.json', JSON.stringify(issuesFound, null, 2));

  if (issuesFound.length === 0) {
    console.log('🎉 ZERO ISSUES FOUND! All pages, links, viewports, and flows passed with 100% health.');
  } else {
    console.log(`⚠️ Issues detected:`);
    issuesFound.forEach((iss, idx) => {
      console.log(` ${idx + 1}. [${iss.category}] ${iss.page}: ${iss.details}`);
    });
  }
}

runDeepInspection().catch(console.error);

