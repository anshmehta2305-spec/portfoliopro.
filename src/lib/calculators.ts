/**
 * Portfolio Pro - Financial Mathematical Computation Engine
 * Compliant with Indian Mutual Fund industry standards and latest budget tax provisions.
 */

// 1. SIP Calculator
export interface SipResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  yearlySchedule: { year: number; invested: number; value: number }[];
}

export function calculateSip(monthlyInvestment: number, annualReturnRate: number, years: number): SipResult {
  const p = Math.max(0, Number(monthlyInvestment) || 0);
  const r = Math.max(0, Number(annualReturnRate) || 0);
  const y = Math.max(0, Number(years) || 0);

  if (p === 0 || y === 0) {
    return { investedAmount: 0, estimatedReturns: 0, totalValue: 0, yearlySchedule: [] };
  }

  const monthlyRate = r / 12 / 100;
  const totalMonths = Math.round(y * 12);
  const yearlySchedule: { year: number; invested: number; value: number }[] = [];

  let accumulatedValue = 0;
  for (let m = 1; m <= totalMonths; m++) {
    if (monthlyRate === 0) {
      accumulatedValue += p;
    } else {
      accumulatedValue = (accumulatedValue + p) * (1 + monthlyRate);
    }
    if (m % 12 === 0) {
      const year = m / 12;
      yearlySchedule.push({
        year,
        invested: Math.round(p * m),
        value: Math.round(accumulatedValue),
      });
    }
  }

  const investedAmount = Math.round(p * totalMonths);
  const totalValue = Math.round(accumulatedValue);
  const estimatedReturns = Math.max(0, totalValue - investedAmount);

  return { investedAmount, estimatedReturns, totalValue, yearlySchedule };
}

// 2. Lumpsum Calculator
export interface LumpsumResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  yearlySchedule: { year: number; invested: number; value: number }[];
}

export function calculateLumpsum(totalInvestment: number, annualReturnRate: number, years: number): LumpsumResult {
  const p = Math.max(0, Number(totalInvestment) || 0);
  const r = Math.max(0, Number(annualReturnRate) || 0);
  const y = Math.max(0, Number(years) || 0);

  if (p === 0 || y === 0) {
    return { investedAmount: p, estimatedReturns: 0, totalValue: p, yearlySchedule: [] };
  }

  const yearlySchedule: { year: number; invested: number; value: number }[] = [];

  for (let yr = 1; yr <= y; yr++) {
    const val = p * Math.pow(1 + r / 100, yr);
    yearlySchedule.push({
      year: yr,
      invested: p,
      value: Math.round(val),
    });
  }

  const totalValue = Math.round(p * Math.pow(1 + r / 100, y));
  const estimatedReturns = Math.max(0, totalValue - p);

  return { investedAmount: p, estimatedReturns, totalValue, yearlySchedule };
}

// 3. Step-Up SIP Calculator
export interface StepUpSipResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  yearlySchedule: { year: number; monthlyContribution: number; invested: number; value: number }[];
}

export function calculateStepUpSip(
  initialMonthly: number,
  stepUpPercentage: number,
  annualReturnRate: number,
  years: number
): StepUpSipResult {
  const p = Math.max(0, Number(initialMonthly) || 0);
  const step = Math.max(0, Number(stepUpPercentage) || 0);
  const r = Math.max(0, Number(annualReturnRate) || 0);
  const y = Math.max(0, Number(years) || 0);

  if (p === 0 || y === 0) {
    return { investedAmount: 0, estimatedReturns: 0, totalValue: 0, yearlySchedule: [] };
  }

  const monthlyRate = r / 12 / 100;
  const yearlySchedule: { year: number; monthlyContribution: number; invested: number; value: number }[] = [];

  let currentMonthly = p;
  let totalInvested = 0;
  let accumulatedValue = 0;

  for (let yr = 1; yr <= y; yr++) {
    for (let m = 1; m <= 12; m++) {
      totalInvested += currentMonthly;
      if (monthlyRate === 0) {
        accumulatedValue += currentMonthly;
      } else {
        accumulatedValue = (accumulatedValue + currentMonthly) * (1 + monthlyRate);
      }
    }
    yearlySchedule.push({
      year: yr,
      monthlyContribution: Math.round(currentMonthly),
      invested: Math.round(totalInvested),
      value: Math.round(accumulatedValue),
    });
    currentMonthly = currentMonthly * (1 + step / 100);
  }

  const investedAmount = Math.round(totalInvested);
  const totalValue = Math.round(accumulatedValue);
  const estimatedReturns = Math.max(0, totalValue - investedAmount);

  return { investedAmount, estimatedReturns, totalValue, yearlySchedule };
}

// 4. SWP (Systematic Withdrawal Plan) Calculator
export interface SwpResult {
  totalInvested: number;
  totalWithdrawn: number;
  finalBalance: number;
  yearlySchedule: { year: number; withdrawn: number; balance: number }[];
}

export function calculateSwp(
  initialCorpus: number,
  monthlyWithdrawal: number,
  annualReturnRate: number,
  years: number
): SwpResult {
  const corpus = Math.max(0, Number(initialCorpus) || 0);
  const withdrawal = Math.max(0, Number(monthlyWithdrawal) || 0);
  const r = Math.max(0, Number(annualReturnRate) || 0);
  const y = Math.max(0, Number(years) || 0);

  const monthlyRate = r / 12 / 100;
  const totalMonths = Math.round(y * 12);
  const yearlySchedule: { year: number; withdrawn: number; balance: number }[] = [];

  let balance = corpus;
  let totalWithdrawn = 0;

  for (let m = 1; m <= totalMonths; m++) {
    balance = balance * (1 + monthlyRate);
    const actualWithdrawal = Math.min(balance, withdrawal);
    balance -= actualWithdrawal;
    totalWithdrawn += actualWithdrawal;

    if (m % 12 === 0) {
      yearlySchedule.push({
        year: m / 12,
        withdrawn: Math.round(totalWithdrawn),
        balance: Math.round(Math.max(0, balance)),
      });
    }
    if (balance <= 0) break;
  }

  return {
    totalInvested: corpus,
    totalWithdrawn: Math.round(totalWithdrawn),
    finalBalance: Math.round(Math.max(0, balance)),
    yearlySchedule,
  };
}

// 5. Goal Planner Calculator
export interface GoalPlannerResult {
  targetCorpus: number;
  requiredMonthlySip: number;
  requiredLumpsum: number;
  totalInvestedViaSip: number;
}

export function calculateGoalPlanner(targetCorpus: number, years: number, expectedReturnRate: number): GoalPlannerResult {
  const corpus = Math.max(0, Number(targetCorpus) || 0);
  const y = Math.max(1, Number(years) || 1);
  const r = Math.max(0, Number(expectedReturnRate) || 0);

  const monthlyRate = r / 12 / 100;
  const totalMonths = Math.round(y * 12);

  let requiredMonthlySip = 0;
  if (monthlyRate === 0) {
    requiredMonthlySip = Math.round(corpus / totalMonths);
  } else {
    // FV = P * [((1+i)^n - 1) / i] * (1+i)
    const factor = ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
    requiredMonthlySip = Math.round(corpus / factor);
  }

  // Lumpsum: PV = FV / (1+r)^y
  const requiredLumpsum = Math.round(corpus / Math.pow(1 + r / 100, y));

  return {
    targetCorpus: corpus,
    requiredMonthlySip,
    requiredLumpsum,
    totalInvestedViaSip: requiredMonthlySip * totalMonths,
  };
}

export function calculateGoalSIP({
  targetAmount,
  currentSavings = 0,
  yearsToGoal,
  expectedReturnPercent = 12,
}: {
  targetAmount: number;
  currentSavings?: number;
  yearsToGoal: number;
  expectedReturnPercent?: number;
}) {
  const years = Math.max(1, Number(yearsToGoal) || 1);
  const r = Math.max(0, Number(expectedReturnPercent) || 0);
  const futureValueOfSavings = currentSavings * Math.pow(1 + r / 100, years);
  const netCorpusNeeded = Math.max(0, targetAmount - futureValueOfSavings);
  const result = calculateGoalPlanner(netCorpusNeeded, years, r);
  return {
    requiredMonthlySIP: result.requiredMonthlySip,
    targetAmount,
    yearsToGoal: years,
  };
}

// 6. Retirement Planner Calculator
export interface RetirementResult {
  futureMonthlyExpenseAtRetirement: number;
  requiredCorpus: number;
  requiredMonthlySipToday: number;
}

export function calculateRetirement(
  currentAge: number,
  retirementAge: number,
  lifeExpectancy: number,
  currentMonthlyExpense: number,
  inflationRate: number,
  preRetirementReturn: number,
  postRetirementReturn: number
): RetirementResult {
  const yearsToRetire = Math.max(1, (Number(retirementAge) || 60) - (Number(currentAge) || 30));
  const retirementDurationYears = Math.max(1, (Number(lifeExpectancy) || 80) - (Number(retirementAge) || 60));
  const expense = Math.max(0, Number(currentMonthlyExpense) || 0);
  const inf = Math.max(0, Number(inflationRate) || 0);
  const preR = Math.max(0, Number(preRetirementReturn) || 0);
  const postR = Math.max(0, Number(postRetirementReturn) || 0);

  // Future monthly expense adjusted for inflation
  const futureMonthlyExpenseAtRetirement = Math.round(
    expense * Math.pow(1 + inf / 100, yearsToRetire)
  );

  // Real rate of return post-retirement
  const realPostRate = (1 + postR / 100) / (1 + inf / 100) - 1;
  const annualExpenseAtRetirement = futureMonthlyExpenseAtRetirement * 12;

  // Corpus needed using Present Value of Annuity formula
  let requiredCorpus: number;
  if (Math.abs(realPostRate) < 0.0001) {
    requiredCorpus = annualExpenseAtRetirement * retirementDurationYears;
  } else {
    requiredCorpus =
      annualExpenseAtRetirement * ((1 - Math.pow(1 + realPostRate, -retirementDurationYears)) / realPostRate);
  }
  requiredCorpus = Math.round(Math.max(0, requiredCorpus));

  // Monthly SIP needed to reach requiredCorpus
  const goal = calculateGoalPlanner(requiredCorpus, yearsToRetire, preR);

  return {
    futureMonthlyExpenseAtRetirement,
    requiredCorpus,
    requiredMonthlySipToday: goal.requiredMonthlySip,
  };
}

// 7. Education Planner Calculator
export interface EducationResult {
  currentCost: number;
  inflatedFutureCost: number;
  requiredMonthlySip: number;
}

export function calculateEducation(
  childCurrentAge: number,
  collegeAge: number,
  todayCost: number,
  educationInflationRate: number,
  expectedReturnRate: number
): EducationResult {
  const years = Math.max(1, (Number(collegeAge) || 18) - (Number(childCurrentAge) || 5));
  const cost = Math.max(0, Number(todayCost) || 0);
  const inf = Math.max(0, Number(educationInflationRate) || 0);
  const ret = Math.max(0, Number(expectedReturnRate) || 0);

  const inflatedFutureCost = Math.round(cost * Math.pow(1 + inf / 100, years));
  const goal = calculateGoalPlanner(inflatedFutureCost, years, ret);

  return {
    currentCost: cost,
    inflatedFutureCost,
    requiredMonthlySip: goal.requiredMonthlySip,
  };
}

// 8. Capital Gains Tax Calculator (Post-Budget 2024 updated rates)
export interface TaxResult {
  purchaseValue: number;
  saleValue: number;
  grossGain: number;
  taxType: "LTCG" | "STCG";
  taxRatePercent: number;
  exemptionLimit: number;
  taxableGain: number;
  taxPayable: number;
  netInHand: number;
}

export function calculateEquityTax(purchaseValue: number, saleValue: number, holdingPeriodMonths: number): TaxResult {
  const p = Math.max(0, Number(purchaseValue) || 0);
  const s = Math.max(0, Number(saleValue) || 0);
  const months = Math.max(0, Number(holdingPeriodMonths) || 0);
  const grossGain = Math.max(0, s - p);

  if (months > 12) {
    // LTCG: 12.5% tax rate, ₹1,25,000 exemption
    const exemptionLimit = 125000;
    const taxableGain = Math.max(0, grossGain - exemptionLimit);
    const taxPayable = Math.round(taxableGain * 0.125);
    return {
      purchaseValue: p,
      saleValue: s,
      grossGain,
      taxType: "LTCG",
      taxRatePercent: 12.5,
      exemptionLimit,
      taxableGain,
      taxPayable,
      netInHand: s - taxPayable,
    };
  } else {
    // STCG: 20% tax rate, 0 exemption
    const taxableGain = grossGain;
    const taxPayable = Math.round(taxableGain * 0.20);
    return {
      purchaseValue: p,
      saleValue: s,
      grossGain,
      taxType: "STCG",
      taxRatePercent: 20,
      exemptionLimit: 0,
      taxableGain,
      taxPayable,
      netInHand: s - taxPayable,
    };
  }
}

// 9. CAGR (Compound Annual Growth Rate) Calculator
export function calculateCAGR(beginningValue: number, endingValue: number, years: number): number {
  if (beginningValue <= 0 || endingValue <= 0 || years <= 0) return 0;
  const cagr = (Math.pow(endingValue / beginningValue, 1 / years) - 1) * 100;
  return Number(cagr.toFixed(2));
}

// 10. Absolute Return Calculator
export function calculateAbsoluteReturn(investedValue: number, currentValue: number): number {
  if (investedValue <= 0) return 0;
  const ret = ((currentValue - investedValue) / investedValue) * 100;
  return Number(ret.toFixed(2));
}

// 11. Inflation Calculator
export interface InflationResult {
  currentAmount: number;
  futureCost: number;
  purchasingPowerLossPercent: number;
}

export function calculateInflation(amount: number, annualInflationRate: number, years: number): InflationResult {
  const futureCost = Math.round(amount * Math.pow(1 + annualInflationRate / 100, years));
  const purchasingPowerValue = amount / Math.pow(1 + annualInflationRate / 100, years);
  const purchasingPowerLossPercent = Math.round(((amount - purchasingPowerValue) / (amount || 1)) * 100);

  return {
    currentAmount: amount,
    futureCost,
    purchasingPowerLossPercent,
  };
}

// 12. Brokerage & Commission Calculator
export interface BrokerageResult {
  totalAum: number;
  monthlyGrossCommission: number;
  annualGrossCommission: number;
  subBrokerPayout: number;
  netAdvisoryEarnings: number;
}

export function calculateBrokerage(
  equityAum: number,
  debtAum: number,
  hybridAum: number,
  liquidAum: number,
  subBrokerSharePercent: number = 0
): BrokerageResult {
  const equityTrail = 0.0085;
  const debtTrail = 0.0035;
  const hybridTrail = 0.0065;
  const liquidTrail = 0.0015;

  const annualGrossCommission = Math.round(
    equityAum * equityTrail + debtAum * debtTrail + hybridAum * hybridTrail + liquidAum * liquidTrail
  );
  const monthlyGrossCommission = Math.round(annualGrossCommission / 12);
  const subBrokerPayout = Math.round(annualGrossCommission * (subBrokerSharePercent / 100));
  const netAdvisoryEarnings = annualGrossCommission - subBrokerPayout;

  return {
    totalAum: equityAum + debtAum + hybridAum + liquidAum,
    monthlyGrossCommission,
    annualGrossCommission,
    subBrokerPayout,
    netAdvisoryEarnings,
  };
}

