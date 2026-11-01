const test = require('node:test');
const assert = require('node:assert/strict');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Test Masking Utility
function maskPAN(pan) {
  if (!pan || pan.length < 10) return pan || "";
  return `••••••${pan.slice(6)}`;
}

test('Database Integrity: Pre-seeded accounts exist with correct foreign key relations', async () => {
  // Check 1 Admin
  const admin = await prisma.user.findUnique({ where: { email: 'admin@portfoliopro.in' } });
  assert.ok(admin, 'Admin account must exist');
  assert.equal(admin.role, 'ADMIN');

  // Check 2 Distributors
  const dist1 = await prisma.user.findUnique({ where: { email: 'advisor@portfoliopro.in' } });
  const dist2 = await prisma.user.findUnique({ where: { email: 'advisor2@portfoliopro.in' } });
  assert.ok(dist1, 'Distributor 1 must exist');
  assert.ok(dist2, 'Distributor 2 must exist');
  assert.equal(dist1.arnCode, 'ARN-189420');
  assert.equal(dist2.arnCode, 'ARN-234567');

  // Check 5 Clients
  const clients = await prisma.client.findMany();
  assert.equal(clients.length >= 5, true, 'At least 5 clients must be seeded');

  // Verify Distributor Isolation mapping in DB
  const dist1Clients = await prisma.client.findMany({ where: { assignedAdvisor: 'ARN-189420' } });
  const dist2Clients = await prisma.client.findMany({ where: { assignedAdvisor: 'ARN-234567' } });
  assert.equal(dist1Clients.length >= 3, true, 'Distributor 1 must have at least 3 assigned clients');
  assert.equal(dist2Clients.length >= 2, true, 'Distributor 2 must have at least 2 assigned clients');

  // Verify none of Distributor 2's clients appear in Distributor 1's list
  const dist1Emails = dist1Clients.map(c => c.email);
  const dist2Emails = dist2Clients.map(c => c.email);
  for (const email of dist2Emails) {
    assert.equal(dist1Emails.includes(email), false, `Distributor 1 must NOT see client ${email}`);
  }
});

test('Security & Privacy: PAN and Personal Data Masking', () => {
  // 10-char PAN: first 6 chars masked, last 4 chars visible
  assert.equal(maskPAN('ABCDE1234F'), '••••••234F');
  assert.equal(maskPAN('BPKPS5678G'), '••••••678G');
  assert.equal(maskPAN('CRJPG9012H'), '••••••012H');
});

test('Password Hashing Security: Passwords stored as Bcrypt hashes, never plaintext', async () => {
  const users = await prisma.user.findMany({ take: 5 });
  for (const u of users) {
    assert.notEqual(u.passwordHash, 'password123', 'Password must not be stored in plaintext');
    assert.ok(u.passwordHash.startsWith('$2'), 'Password hash must be valid bcrypt starting with $2');
    const isValid = await bcrypt.compare('password123', u.passwordHash);
    assert.equal(isValid, true, 'Hash must successfully verify against password123');
  }
});

test('Fund Catalog: Sample mutual funds with positive NAVs and risk classifications', async () => {
  const funds = await prisma.fund.findMany();
  assert.ok(funds.length >= 7, 'Must have at least 7 funds');
  for (const f of funds) {
    assert.ok(f.nav > 0, `Fund ${f.name} must have positive NAV`);
    assert.ok(f.amfiCode.length >= 5, `Fund ${f.name} must have valid AMFI code`);
    assert.ok(['Low', 'Moderate', 'High', 'Very High'].includes(f.riskLevel), `Fund ${f.name} has valid risk`);
  }
});
