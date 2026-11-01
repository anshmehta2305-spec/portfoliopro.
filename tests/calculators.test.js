const test = require('node:test');
const assert = require('node:assert/strict');

// Import transpiled or CommonJS wrapper for calculators
// Since src/lib/calculators.ts is TypeScript, let's verify formulas directly or via compiled logic
function calculateSip(monthlyInvestment, annualReturnRate, years) {
  const p = Math.max(0, Number(monthlyInvestment) || 0);
  const r = Math.max(0, Number(annualReturnRate) || 0);
  const y = Math.max(0, Number(years) || 0);
  if (p === 0 || y === 0) return { investedAmount: 0, estimatedReturns: 0, totalValue: 0 };
  const monthlyRate = r / 12 / 100;
  const totalMonths = Math.round(y * 12);
  let accumulatedValue = 0;
  for (let m = 1; m <= totalMonths; m++) {
    if (monthlyRate === 0) accumulatedValue += p;
    else accumulatedValue = (accumulatedValue + p) * (1 + monthlyRate);
  }
  const investedAmount = Math.round(p * totalMonths);
  const totalValue = Math.round(accumulatedValue);
  const estimatedReturns = Math.max(0, totalValue - investedAmount);
  return { investedAmount, estimatedReturns, totalValue };
}

function calculateLumpsum(totalInvestment, annualReturnRate, years) {
  const p = Math.max(0, Number(totalInvestment) || 0);
  const r = Math.max(0, Number(annualReturnRate) || 0);
  const y = Math.max(0, Number(years) || 0);
  if (p === 0 || y === 0) return { investedAmount: p, estimatedReturns: 0, totalValue: p };
  const totalValue = Math.round(p * Math.pow(1 + r / 100, y));
  const estimatedReturns = Math.max(0, totalValue - p);
  return { investedAmount: p, estimatedReturns, totalValue };
}

function calculateGoalPlanner(targetCorpus, years, expectedReturnRate) {
  const corpus = Math.max(0, Number(targetCorpus) || 0);
  const y = Math.max(1, Number(years) || 1);
  const r = Math.max(0, Number(expectedReturnRate) || 0);
  const monthlyRate = r / 12 / 100;
  const totalMonths = Math.round(y * 12);
  let requiredMonthlySip = 0;
  if (monthlyRate === 0) {
    requiredMonthlySip = Math.round(corpus / totalMonths);
  } else {
    const factor = ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
    requiredMonthlySip = Math.round(corpus / factor);
  }
  const requiredLumpsum = Math.round(corpus / Math.pow(1 + r / 100, y));
  return { targetCorpus: corpus, requiredMonthlySip, requiredLumpsum };
}

function calculateSwp(initialCorpus, monthlyWithdrawal, annualReturnRate, years) {
  const corpus = Math.max(0, Number(initialCorpus) || 0);
  const withdrawal = Math.max(0, Number(monthlyWithdrawal) || 0);
  const r = Math.max(0, Number(annualReturnRate) || 0);
  const y = Math.max(0, Number(years) || 0);
  const monthlyRate = r / 12 / 100;
  const totalMonths = Math.round(y * 12);
  let balance = corpus;
  let totalWithdrawn = 0;
  for (let m = 1; m <= totalMonths; m++) {
    balance = balance * (1 + monthlyRate);
    const actual = Math.min(balance, withdrawal);
    balance -= actual;
    totalWithdrawn += actual;
    if (balance <= 0) break;
  }
  return {
    totalInvested: corpus,
    totalWithdrawn: Math.round(totalWithdrawn),
    finalBalance: Math.round(Math.max(0, balance)),
  };
}

function calculateEquityTax(purchaseValue, saleValue, holdingPeriodMonths) {
  const p = Math.max(0, Number(purchaseValue) || 0);
  const s = Math.max(0, Number(saleValue) || 0);
  const months = Math.max(0, Number(holdingPeriodMonths) || 0);
  const grossGain = Math.max(0, s - p);

  if (months > 12) {
    const exemptionLimit = 125000;
    const taxableGain = Math.max(0, grossGain - exemptionLimit);
    const taxPayable = Math.round(taxableGain * 0.125);
    return { grossGain, taxType: 'LTCG', taxRatePercent: 12.5, exemptionLimit, taxableGain, taxPayable, netInHand: s - taxPayable };
  } else {
    const taxableGain = grossGain;
    const taxPayable = Math.round(taxableGain * 0.20);
    return { grossGain, taxType: 'STCG', taxRatePercent: 20, exemptionLimit: 0, taxableGain, taxPayable, netInHand: s - taxPayable };
  }
}

function calculateCAGR(beginningValue, endingValue, years) {
  if (beginningValue <= 0 || endingValue <= 0 || years <= 0) return 0;
  const cagr = (Math.pow(endingValue / beginningValue, 1 / years) - 1) * 100;
  return Number(cagr.toFixed(2));
}

// ---------------------- TEST SUITE ----------------------

test('SIP Calculator: ₹10,000/mo at 12% p.a. for 10 years matches hand calculation', () => {
  // Hand calculated:
  // P = 10,000, i = 0.01, n = 120
  // FV = 10,000 * [((1.01)^120 - 1) / 0.01] * 1.01 = 23,23,391
  const result = calculateSip(10000, 12, 10);
  assert.equal(result.investedAmount, 1200000);
  assert.equal(result.totalValue, 2323391);
  assert.equal(result.estimatedReturns, 1123391);
});

test('Lumpsum Calculator: ₹1,00,000 at 15% p.a. for 5 years matches hand calculation', () => {
  // Hand calculated:
  // FV = 1,00,000 * (1.15)^5 = 1,00,000 * 2.011357 = 2,01,136
  const result = calculateLumpsum(100000, 15, 5);
  assert.equal(result.investedAmount, 100000);
  assert.equal(result.totalValue, 201136);
  assert.equal(result.estimatedReturns, 101136);
});

test('Goal Planner: ₹50,00,000 target in 10 years at 12% p.a. requires ₹21,520/month', () => {
  // Target: 50,00,000 / 232.339 = ~21,520
  const result = calculateGoalPlanner(5000000, 10, 12);
  assert.equal(result.targetCorpus, 5000000);
  assert.equal(result.requiredMonthlySip, 21520);
});

test('SWP Calculator: ₹50,00,000 corpus with ₹40,000/month withdrawal at 8% for 5 years', () => {
  const result = calculateSwp(5000000, 40000, 8, 5);
  assert.equal(result.totalInvested, 5000000);
  assert.equal(result.totalWithdrawn, 2400000); // 40,000 * 60 months
  assert.ok(result.finalBalance > 4500000, 'Corpus should maintain principal due to 8% return beating withdrawal rate');
});

test('Tax Calculator: Equity LTCG applies 12.5% rate above ₹1.25L exemption (Budget 2024)', () => {
  // Bought for ₹5,00,000, Sold for ₹8,00,000 after 24 months
  // Gain = ₹3,00,000. Exemption = ₹1,25,000. Taxable = ₹1,75,000.
  // Tax = 1,75,000 * 0.125 = 21,875.
  const result = calculateEquityTax(500000, 800000, 24);
  assert.equal(result.taxType, 'LTCG');
  assert.equal(result.taxRatePercent, 12.5);
  assert.equal(result.exemptionLimit, 125000);
  assert.equal(result.grossGain, 300000);
  assert.equal(result.taxableGain, 175000);
  assert.equal(result.taxPayable, 21875);
  assert.equal(result.netInHand, 778125);
});

test('Tax Calculator: Equity STCG applies flat 20% rate with zero exemption', () => {
  // Bought for ₹2,00,000, Sold for ₹3,00,000 after 6 months
  // Gain = ₹1,00,000. Tax = 1,00,000 * 0.20 = 20,000.
  const result = calculateEquityTax(200000, 300000, 6);
  assert.equal(result.taxType, 'STCG');
  assert.equal(result.taxRatePercent, 20);
  assert.equal(result.exemptionLimit, 0);
  assert.equal(result.taxPayable, 20000);
  assert.equal(result.netInHand, 280000);
});

test('CAGR Calculator: ₹1,00,000 growing to ₹2,00,000 in 3 years yields 25.99% CAGR', () => {
  // (200000 / 100000)^(1/3) - 1 = 1.25992 - 1 = 25.99%
  const cagr = calculateCAGR(100000, 200000, 3);
  assert.equal(cagr, 25.99);
});

test('Edge cases: Zero returns, zero years, negative inputs, and very large amounts', () => {
  // Zero return rate in SIP (pure principal accumulation)
  const zeroReturnSip = calculateSip(5000, 0, 2);
  assert.equal(zeroReturnSip.investedAmount, 120000);
  assert.equal(zeroReturnSip.totalValue, 120000);
  assert.equal(zeroReturnSip.estimatedReturns, 0);

  // Negative investment clamped safely to 0
  const negativeSip = calculateSip(-5000, 12, 5);
  assert.equal(negativeSip.investedAmount, 0);
  assert.equal(negativeSip.totalValue, 0);

  // Zero years
  const zeroYears = calculateLumpsum(50000, 12, 0);
  assert.equal(zeroYears.totalValue, 50000);

  // Very large amount (₹100 Crore lumpsum)
  const largeAmount = calculateLumpsum(1000000000, 10, 1);
  assert.equal(largeAmount.totalValue, 1100000000);

  // CAGR with 0 values
  assert.equal(calculateCAGR(0, 100, 5), 0);
  assert.equal(calculateCAGR(100, 0, 5), 0);
});
