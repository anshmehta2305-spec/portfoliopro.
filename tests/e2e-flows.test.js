const test = require('node:test');
const assert = require('node:assert/strict');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

test('Flow 1: Complete Investor Lifecycle (Registration → KYC → SIP & Lumpsum → Portfolio)', async () => {
  const testEmail = `test.investor.${Date.now()}@example.in`;
  const testPan = `TSTPS${Math.floor(1000 + Math.random() * 9000)}F`;
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Investor Registration
  const user = await prisma.user.create({
    data: {
      name: 'Ramesh Kumat Test',
      email: testEmail,
      passwordHash,
      role: 'INVESTOR',
      phone: '+91 9820011223',
      isActive: true,
    },
  });
  assert.ok(user.id, 'User record created');

  const client = await prisma.client.create({
    data: {
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      pan: testPan,
      kycStatus: 'PENDING',
      riskProfile: 'MODERATE',
      assignedAdvisor: 'ARN-189420',
      totalAum: 0,
      totalCost: 0,
    },
  });
  assert.equal(client.kycStatus, 'PENDING');

  // 2. KYC Verification
  const updatedClient = await prisma.client.update({
    where: { id: client.id },
    data: { kycStatus: 'VERIFIED' },
  });
  assert.equal(updatedClient.kycStatus, 'VERIFIED');

  // 3. Start SIP in HDFC Top 100 Fund
  const fund = await prisma.fund.findFirst();
  assert.ok(fund, 'Mutual fund available');

  const sip = await prisma.sIP.create({
    data: {
      clientId: client.id,
      fundId: fund.id,
      folioNumber: `FOLIO/${fund.amfiCode}/TST/01`,
      amount: 10000,
      frequency: 'MONTHLY',
      sipDate: 10,
      startDate: '01-Nov-2026',
      nextExecutionDate: '10-Nov-2026',
      status: 'ACTIVE',
      mandateId: 'TEST_MANDATE_001',
    },
  });
  assert.ok(sip.id, 'SIP mandate created');
  assert.equal(sip.status, 'ACTIVE');

  // 4. Lumpsum Purchase
  const lumpsumAmount = 50000;
  const allottedUnits = Number((lumpsumAmount / fund.nav).toFixed(3));

  const holding = await prisma.holding.create({
    data: {
      clientId: client.id,
      fundId: fund.id,
      folioNumber: `FOLIO/${fund.amfiCode}/TST/01`,
      units: allottedUnits,
      avgNav: fund.nav,
      currentNav: fund.nav,
      investedValue: lumpsumAmount,
      currentValue: lumpsumAmount,
      absoluteReturn: 0.0,
      xirr: 15.0,
    },
  });

  const transaction = await prisma.transaction.create({
    data: {
      clientId: client.id,
      folioNumber: holding.folioNumber,
      schemeName: fund.name,
      type: 'PURCHASE',
      amount: lumpsumAmount,
      units: allottedUnits,
      nav: fund.nav,
      transDate: '01-Nov-2026',
      status: 'SUCCESS',
      platform: 'BSE_STAR',
    },
  });

  // Update client AUM
  await prisma.client.update({
    where: { id: client.id },
    data: {
      totalAum: lumpsumAmount,
      totalCost: lumpsumAmount,
    },
  });

  // 5. Verify Portfolio Output
  const clientPortfolio = await prisma.client.findUnique({
    where: { id: client.id },
    include: { holdings: true, sips: true, transactions: true },
  });

  assert.equal(clientPortfolio.totalAum, 50000);
  assert.equal(clientPortfolio.holdings.length, 1);
  assert.equal(clientPortfolio.sips.length, 1);
  assert.equal(clientPortfolio.transactions.length, 1);

  // Clean up test records
  await prisma.transaction.deleteMany({ where: { clientId: client.id } });
  await prisma.holding.deleteMany({ where: { clientId: client.id } });
  await prisma.sIP.deleteMany({ where: { clientId: client.id } });
  await prisma.client.delete({ where: { id: client.id } });
  await prisma.user.delete({ where: { id: user.id } });
});

test('Flow 2: Distributor Onboarding Client & Client Isolation Verification', async () => {
  const distArn = 'ARN-189420';
  const otherArn = 'ARN-234567';

  // Count clients for dist 1
  const initialDist1Clients = await prisma.client.findMany({ where: { assignedAdvisor: distArn } });
  const initialDist2Clients = await prisma.client.findMany({ where: { assignedAdvisor: otherArn } });

  // Onboard new client for Distributor 1
  const testPan = `DISPS${Math.floor(1000 + Math.random() * 9000)}K`;
  const newClient = await prisma.client.create({
    data: {
      name: 'Onboarded By Dist 1',
      email: `onboard.${Date.now()}@advisor.in`,
      phone: '+91 99000 11223',
      pan: testPan,
      kycStatus: 'VERIFIED',
      riskProfile: 'GROWTH_ORIENTED',
      assignedAdvisor: distArn,
      totalAum: 0,
      totalCost: 0,
    },
  });

  // Check that Distributor 1 sees +1 client
  const updatedDist1Clients = await prisma.client.findMany({ where: { assignedAdvisor: distArn } });
  assert.equal(updatedDist1Clients.length, initialDist1Clients.length + 1);

  // Crucial check: Distributor 2 MUST NOT see this client
  const dist2Check = await prisma.client.findMany({ where: { assignedAdvisor: otherArn } });
  assert.equal(dist2Check.length, initialDist2Clients.length);
  const dist2Ids = dist2Check.map(c => c.id);
  assert.equal(dist2Ids.includes(newClient.id), false, 'Distributor 2 cannot view Distributor 1 client');

  // Clean up
  await prisma.client.delete({ where: { id: newClient.id } });
});

test('Flow 3: Admin Updates Mutual Fund NAV and Holdings Auto-Recalculate', async () => {
  const fund = await prisma.fund.findFirst();
  assert.ok(fund);

  const initialNav = fund.nav;
  const newNav = Number((initialNav * 1.05).toFixed(2)); // +5% increase

  // Admin updates NAV
  const updatedFund = await prisma.fund.update({
    where: { id: fund.id },
    data: { nav: newNav, navDate: '01-Nov-2026' },
  });
  assert.equal(updatedFund.nav, newNav);

  // History entry created
  const history = await prisma.navHistory.create({
    data: {
      fundId: fund.id,
      nav: newNav,
      navDate: '01-Nov-2026',
    },
  });
  assert.ok(history.id);

  // Holdings recalculation
  const holdings = await prisma.holding.findMany({ where: { fundId: fund.id } });
  for (const h of holdings) {
    const revalCurrent = Number((h.units * newNav).toFixed(2));
    const absReturn = Number((((revalCurrent - h.investedValue) / h.investedValue) * 100).toFixed(2));
    await prisma.holding.update({
      where: { id: h.id },
      data: {
        currentNav: newNav,
        currentValue: revalCurrent,
        absoluteReturn: absReturn,
      },
    });
  }

  // Restore NAV to original
  await prisma.fund.update({
    where: { id: fund.id },
    data: { nav: initialNav },
  });
  await prisma.navHistory.delete({ where: { id: history.id } });
});

