const http = require('http');

function fetchUrl(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path,
        method: options.method || 'GET',
        headers: options.headers || {},
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body,
          });
        });
      }
    );

    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runHttpTests() {
  console.log('----------------------------------------------------');
  console.log('🚀 Running Portfolio Pro Comprehensive HTTP & QA Audit');
  console.log('----------------------------------------------------');

  let passed = 0;
  let failed = 0;

  function assertTest(name, condition, details = '') {
    if (condition) {
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${name} ${details ? `(${details})` : ''}`);
      failed++;
    }
  }

  // 1. Public Marketing Routes
  const publicRoutes = [
    '/',
    '/about',
    '/solutions/investor-app',
    '/solutions/advisor-app',
    '/solutions/robo-advisory',
    '/solutions/financial-websites',
    '/solutions/crm',
    '/features',
    '/pricing',
    '/calculators',
    '/fund-explorer',
    '/blog',
    '/testimonials',
    '/contact',
    '/pay-online',
    '/disclaimer',
    '/terms',
    '/privacy-policy',
    '/refund-policy',
  ];

  console.log('\n[Phase 1] Testing Public Marketing Routes:');
  for (const route of publicRoutes) {
    const res = await fetchUrl(route);
    assertTest(`Route ${route} returns 200 OK`, res.statusCode === 200, `Got ${res.statusCode}`);
  }

  // 2. Auth Routes
  console.log('\n[Phase 2] Testing Auth Pages:');
  const authRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/otp-login',
  ];

  for (const route of authRoutes) {
    const res = await fetchUrl(route);
    assertTest(`Auth Route ${route} returns 200 OK`, res.statusCode === 200, `Got ${res.statusCode}`);
  }

  // 3. Security & Middleware RBAC Protection
  console.log('\n[Phase 3] Testing RBAC Route Protection & Security Headers:');
  const protectedRoutes = [
    '/dashboard/admin',
    '/dashboard/advisor',
    '/dashboard/investor',
    '/dashboard/corporate',
  ];

  for (const route of protectedRoutes) {
    const res = await fetchUrl(route);
    const isRedirectToLogin =
      (res.statusCode === 307 || res.statusCode === 302) &&
      res.headers.location &&
      res.headers.location.includes('/auth/login');
    assertTest(
      `Unauthenticated ${route} redirects to /auth/login`,
      isRedirectToLogin,
      `Status: ${res.statusCode}, Location: ${res.headers.location}`
    );
  }

  // Security Headers verification
  const homeRes = await fetchUrl('/');
  assertTest('Security Header: X-Frame-Options is DENY', homeRes.headers['x-frame-options'] === 'DENY');
  assertTest('Security Header: X-Content-Type-Options is nosniff', homeRes.headers['x-content-type-options'] === 'nosniff');
  assertTest('Security Header: Referrer-Policy is present', !!homeRes.headers['referrer-policy']);

  // Admin API RBAC Protection (Unauthenticated /api/admin/* should return 403 Forbidden)
  console.log('\n[Phase 4] Testing API RBAC Enforcement:');
  const adminApiRes = await fetchUrl('/api/admin/users');
  assertTest('Unauthenticated /api/admin/users returns 403 Forbidden', adminApiRes.statusCode === 403);

  const adminFundsRes = await fetchUrl('/api/admin/funds', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { amfiCode: '999999', name: 'Test' },
  });
  assertTest('Unauthenticated POST /api/admin/funds returns 403 Forbidden', adminFundsRes.statusCode === 403);

  // 4. API Endpoints Functional Checks
  console.log('\n[Phase 5] Testing Public & Transactional API Endpoints:');
  const fundsRes = await fetchUrl('/api/funds');
  assertTest('/api/funds returns 200 OK', fundsRes.statusCode === 200);
  const fundsJson = JSON.parse(fundsRes.body);
  assertTest('/api/funds returns mutual funds array', Array.isArray(fundsJson.funds) && fundsJson.funds.length >= 7);

  // Registration Validation
  const badRegisterRes = await fetchUrl('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { name: 'A', email: 'invalid-email', password: '123' },
  });
  assertTest('Registration rejects invalid payload with 400 Bad Request', badRegisterRes.statusCode === 400);

  // Leads submission
  const leadRes = await fetchUrl('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      name: 'QA Audit Lead',
      email: 'qa.lead@example.com',
      phone: '9820011223',
      city: 'Mumbai',
      arn: 'ARN-999999',
      interestedIn: ['Investor Portal', 'BSE StarMF'],
    },
  });
  assertTest('Lead submission returns 201 Created', leadRes.statusCode === 201);

  // Demo booking submission
  const demoRes = await fetchUrl('/api/demo-booking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      name: 'QA Demo Request',
      email: 'qa.demo@example.com',
      phone: '9820011223',
      selectedDate: '2026-11-10',
      selectedSlot: '11:00 AM - 11:45 AM IST',
    },
  });
  assertTest('Demo booking returns 201 Created', demoRes.statusCode === 201);

  console.log('\n----------------------------------------------------');
  console.log(`Audit Summary: ${passed} Passed, ${failed} Failed`);
  console.log('----------------------------------------------------');

  if (failed > 0) {
    process.exit(1);
  }
}

runHttpTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

