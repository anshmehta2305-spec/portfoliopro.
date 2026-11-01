"use client";

import React, { useState, useMemo } from "react";
import {
  calculateSip,
  calculateLumpsum,
  calculateStepUpSip,
  calculateSwp,
  calculateGoalPlanner,
  calculateRetirement,
  calculateEducation,
  calculateInflation,
  calculateBrokerage,
  calculateEquityTax,
} from "@/lib/calculators";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { Printer, Download, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

type CalculatorType =
  | "sip"
  | "lumpsum"
  | "stepup"
  | "swp"
  | "goal"
  | "retirement"
  | "education"
  | "inflation"
  | "brokerage"
  | "tax";

interface Props {
  initialTab?: CalculatorType;
}

const COLORS = ["#0B1F3A", "#1F5FD6", "#B08D57", "#1BB5D0"];

export function CalculatorsContainer({ initialTab = "sip" }: Props) {
  const [activeTab, setActiveTab] = useState<CalculatorType>(initialTab);

  // 1. SIP State
  const [sipMonthly, setSipMonthly] = useState(15000);
  const [sipRate, setSipRate] = useState(13.5);
  const [sipYears, setSipYears] = useState(15);

  // 2. Lumpsum State
  const [lumpAmount, setLumpAmount] = useState(500000);
  const [lumpRate, setLumpRate] = useState(14);
  const [lumpYears, setLumpYears] = useState(10);

  // 3. Step-Up State
  const [stepUpInitial, setStepUpInitial] = useState(15000);
  const [stepUpPercent, setStepUpPercent] = useState(10);
  const [stepUpRate, setStepUpRate] = useState(13);
  const [stepUpYears, setStepUpYears] = useState(15);

  // 4. SWP State
  const [swpCorpus, setSwpCorpus] = useState(5000000);
  const [swpWithdrawal, setSwpWithdrawal] = useState(35000);
  const [swpRate, setSwpRate] = useState(9);
  const [swpYears, setSwpYears] = useState(15);

  // 5. Goal State
  const [goalTarget, setGoalTarget] = useState(25000000);
  const [goalYears, setGoalYears] = useState(12);
  const [goalRate, setGoalRate] = useState(13);

  // 6. Retirement State
  const [retCurrentAge, setRetCurrentAge] = useState(32);
  const [retAge, setRetAge] = useState(58);
  const [retLife, setRetLife] = useState(82);
  const [retExpense, setRetExpense] = useState(75000);
  const [retInflation, setRetInflation] = useState(6.5);
  const [retPreReturn, setRetPreReturn] = useState(12.5);
  const [retPostReturn, setRetPostReturn] = useState(8.5);

  // 7. Education State
  const [eduChildAge, setEduChildAge] = useState(5);
  const [eduCollegeAge, setEduCollegeAge] = useState(18);
  const [eduTodayCost, setEduTodayCost] = useState(3000000);
  const [eduInflation, setEduInflation] = useState(9.5);
  const [eduReturn, setEduReturn] = useState(13);

  // 8. Inflation State
  const [infAmount, setInfAmount] = useState(100000);
  const [infRate, setInfRate] = useState(7);
  const [infYears, setInfYears] = useState(15);

  // 9. Brokerage State
  const [equityAum, setEquityAum] = useState(500000000); // 50 Cr
  const [debtAum, setDebtAum] = useState(150000000);   // 15 Cr
  const [hybridAum, setHybridAum] = useState(100000000); // 10 Cr
  const [liquidAum, setLiquidAum] = useState(50000000);  // 5 Cr
  const [subBrokerShare, setSubBrokerShare] = useState(20);

  // 10. Tax State
  const [taxPurchase, setTaxPurchase] = useState(500000);
  const [taxSale, setTaxSale] = useState(950000);
  const [taxMonths, setTaxMonths] = useState(24);

  // Compute Results
  const sipResult = useMemo(
    () => calculateSip(sipMonthly, sipRate, sipYears),
    [sipMonthly, sipRate, sipYears]
  );
  const lumpResult = useMemo(
    () => calculateLumpsum(lumpAmount, lumpRate, lumpYears),
    [lumpAmount, lumpRate, lumpYears]
  );
  const stepUpResult = useMemo(
    () => calculateStepUpSip(stepUpInitial, stepUpPercent, stepUpRate, stepUpYears),
    [stepUpInitial, stepUpPercent, stepUpRate, stepUpYears]
  );
  const swpResult = useMemo(
    () => calculateSwp(swpCorpus, swpWithdrawal, swpRate, swpYears),
    [swpCorpus, swpWithdrawal, swpRate, swpYears]
  );
  const goalResult = useMemo(
    () => calculateGoalPlanner(goalTarget, goalYears, goalRate),
    [goalTarget, goalYears, goalRate]
  );
  const retResult = useMemo(
    () =>
      calculateRetirement(
        retCurrentAge,
        retAge,
        retLife,
        retExpense,
        retInflation,
        retPreReturn,
        retPostReturn
      ),
    [retCurrentAge, retAge, retLife, retExpense, retInflation, retPreReturn, retPostReturn]
  );
  const eduResult = useMemo(
    () => calculateEducation(eduChildAge, eduCollegeAge, eduTodayCost, eduInflation, eduReturn),
    [eduChildAge, eduCollegeAge, eduTodayCost, eduInflation, eduReturn]
  );
  const infResult = useMemo(
    () => calculateInflation(infAmount, infRate, infYears),
    [infAmount, infRate, infYears]
  );
  const brokResult = useMemo(
    () => calculateBrokerage(equityAum, debtAum, hybridAum, liquidAum, subBrokerShare),
    [equityAum, debtAum, hybridAum, liquidAum, subBrokerShare]
  );
  const taxResult = useMemo(
    () => calculateEquityTax(taxPurchase, taxSale, taxMonths),
    [taxPurchase, taxSale, taxMonths]
  );

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const tabs: { id: CalculatorType; label: string }[] = [
    { id: "sip", label: "SIP Growth" },
    { id: "lumpsum", label: "Lumpsum" },
    { id: "stepup", label: "Step-Up SIP" },
    { id: "swp", label: "SWP Cashflow" },
    { id: "goal", label: "Goal GPS" },
    { id: "retirement", label: "Retirement" },
    { id: "education", label: "Child Education" },
    { id: "inflation", label: "Inflation Loss" },
    { id: "brokerage", label: "MFD Trail Brokerage" },
    { id: "tax", label: "LTCG/STCG Tax (12.5%)" },
  ];

  return (
    <div className="bg-white rounded-[4px] border border-rule/80 shadow-classic p-6 md:p-10">
      {/* Tab Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-4 border-b border-rule scrollbar-thin">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3.5 py-2 text-xs font-semibold whitespace-nowrap rounded-[2px] transition-all ${
              activeTab === t.id
                ? "bg-navy text-gold border border-gold"
                : "bg-ivory text-charcoal hover:bg-ivory-dark border border-transparent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Interactive Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Sliders & Form Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-6 bg-ivory p-6 rounded-[3px] border border-rule">
          {/* 1. SIP CALCULATOR INPUTS */}
          {activeTab === "sip" && (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
                  <span>Monthly SIP Amount</span>
                  <span className="text-brand-blue font-bold text-sm">{formatINR(sipMonthly)}</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={200000}
                  step={500}
                  value={sipMonthly}
                  onChange={(e) => setSipMonthly(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
                  <span>Expected Annual Return</span>
                  <span className="text-brand-blue font-bold text-sm">{sipRate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={25}
                  step={0.5}
                  value={sipRate}
                  onChange={(e) => setSipRate(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
                  <span>Investment Horizon</span>
                  <span className="text-brand-blue font-bold text-sm">{sipYears} Years</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={35}
                  step={1}
                  value={sipYears}
                  onChange={(e) => setSipYears(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* 2. LUMPSUM CALCULATOR INPUTS */}
          {activeTab === "lumpsum" && (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
                  <span>Total One-Time Investment</span>
                  <span className="text-brand-blue font-bold text-sm">{formatINR(lumpAmount)}</span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={10000000}
                  step={10000}
                  value={lumpAmount}
                  onChange={(e) => setLumpAmount(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
                  <span>Expected Annual CAGR</span>
                  <span className="text-brand-blue font-bold text-sm">{lumpRate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={25}
                  step={0.5}
                  value={lumpRate}
                  onChange={(e) => setLumpRate(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
                  <span>Investment Period</span>
                  <span className="text-brand-blue font-bold text-sm">{lumpYears} Years</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={lumpYears}
                  onChange={(e) => setLumpYears(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* 3. STEP-UP SIP INPUTS */}
          {activeTab === "stepup" && (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
                  <span>Starting Monthly SIP</span>
                  <span className="text-brand-blue font-bold text-sm">{formatINR(stepUpInitial)}</span>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={100000}
                  step={1000}
                  value={stepUpInitial}
                  onChange={(e) => setStepUpInitial(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
                  <span>Annual Step-Up Percentage</span>
                  <span className="text-brand-blue font-bold text-sm">{stepUpPercent}% yearly</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={25}
                  step={1}
                  value={stepUpPercent}
                  onChange={(e) => setStepUpPercent(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
                  <span>Expected Return</span>
                  <span className="text-brand-blue font-bold text-sm">{stepUpRate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={22}
                  step={0.5}
                  value={stepUpRate}
                  onChange={(e) => setStepUpRate(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
                  <span>Duration</span>
                  <span className="text-brand-blue font-bold text-sm">{stepUpYears} Years</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={30}
                  step={1}
                  value={stepUpYears}
                  onChange={(e) => setStepUpYears(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* 4. SWP INPUTS */}
          {activeTab === "swp" && (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
                  <span>Total Capital Corpus</span>
                  <span className="text-brand-blue font-bold text-sm">{formatINR(swpCorpus)}</span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={50000000}
                  step={100000}
                  value={swpCorpus}
                  onChange={(e) => setSwpCorpus(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
                  <span>Monthly Withdrawal (SWP)</span>
                  <span className="text-brand-blue font-bold text-sm">{formatINR(swpWithdrawal)}</span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={250000}
                  step={2000}
                  value={swpWithdrawal}
                  onChange={(e) => setSwpWithdrawal(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
                  <span>Expected Portfolio Return</span>
                  <span className="text-brand-blue font-bold text-sm">{swpRate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={15}
                  step={0.5}
                  value={swpRate}
                  onChange={(e) => setSwpRate(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* 5. GOAL GPS INPUTS */}
          {activeTab === "goal" && (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
                  <span>Target Milestone Corpus</span>
                  <span className="text-brand-blue font-bold text-sm">{formatINR(goalTarget)}</span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={100000000}
                  step={500000}
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
                  <span>Years to Reach Goal</span>
                  <span className="text-brand-blue font-bold text-sm">{goalYears} Years</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={goalYears}
                  onChange={(e) => setGoalYears(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
                  <span>Expected Return</span>
                  <span className="text-brand-blue font-bold text-sm">{goalRate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={18}
                  step={0.5}
                  value={goalRate}
                  onChange={(e) => setGoalRate(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* 9. MFD TRAIL BROKERAGE INPUTS */}
          {activeTab === "brokerage" && (
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  <span>Equity AUM (0.85% Trail)</span>
                  <span className="text-brand-blue font-bold text-xs">{formatINR(equityAum)}</span>
                </div>
                <input
                  type="range"
                  min={10000000}
                  max={2000000000}
                  step={10000000}
                  value={equityAum}
                  onChange={(e) => setEquityAum(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  <span>Debt AUM (0.35% Trail)</span>
                  <span className="text-brand-blue font-bold text-xs">{formatINR(debtAum)}</span>
                </div>
                <input
                  type="range"
                  min={5000000}
                  max={500000000}
                  step={5000000}
                  value={debtAum}
                  onChange={(e) => setDebtAum(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  <span>Hybrid AUM (0.65% Trail)</span>
                  <span className="text-brand-blue font-bold text-xs">{formatINR(hybridAum)}</span>
                </div>
                <input
                  type="range"
                  min={5000000}
                  max={500000000}
                  step={5000000}
                  value={hybridAum}
                  onChange={(e) => setHybridAum(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  <span>Sub-Broker Payout Sharing</span>
                  <span className="text-brand-blue font-bold text-xs">{subBrokerShare}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={5}
                  value={subBrokerShare}
                  onChange={(e) => setSubBrokerShare(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* 10. CAPITAL GAINS TAX INPUTS */}
          {activeTab === "tax" && (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
                  <span>Initial Purchase Value</span>
                  <span className="text-brand-blue font-bold text-sm">{formatINR(taxPurchase)}</span>
                </div>
                <input
                  type="range"
                  min={50000}
                  max={5000000}
                  step={25000}
                  value={taxPurchase}
                  onChange={(e) => setTaxPurchase(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
                  <span>Redemption Sale Value</span>
                  <span className="text-brand-blue font-bold text-sm">{formatINR(taxSale)}</span>
                </div>
                <input
                  type="range"
                  min={50000}
                  max={10000000}
                  step={25000}
                  value={taxSale}
                  onChange={(e) => setTaxSale(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
                  <span>Holding Period (Months)</span>
                  <span className="text-brand-blue font-bold text-sm">{taxMonths} Months</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={60}
                  step={1}
                  value={taxMonths}
                  onChange={(e) => setTaxMonths(Number(e.target.value))}
                  className="w-full accent-navy cursor-pointer"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  {taxMonths > 12
                    ? "Classified as LTCG (>12M) taxed at 12.5% with ₹1.25L exemption"
                    : "Classified as STCG (≤12M) taxed at 20% flat"}
                </p>
              </div>
            </div>
          )}

          {/* Fallback for other calculators */}
          {["retirement", "education", "inflation"].includes(activeTab) && (
            <div className="space-y-4 text-xs text-charcoal">
              <p className="font-semibold text-navy">Custom parameter controls:</p>
              <div>
                <label className="block mb-1 font-medium">Inflation Estimate Rate (%)</label>
                <input
                  type="number"
                  value={activeTab === "retirement" ? retInflation : infRate}
                  onChange={(e) =>
                    activeTab === "retirement"
                      ? setRetInflation(Number(e.target.value))
                      : setInfRate(Number(e.target.value))
                  }
                  className="w-full p-2 border border-rule rounded bg-white"
                />
              </div>
              <p className="text-[11px] text-gray-500 italic">
                All computational algorithms use standard compounding formulas with precision rounding.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Visualization & Results (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-[3px] border border-rule space-y-6">
          {/* Header Summary Cards */}
          {activeTab === "sip" && (
            <div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-ivory rounded border border-rule text-center">
                  <div className="text-[11px] uppercase tracking-wider text-charcoal-muted">Invested</div>
                  <div className="text-base font-bold text-navy mt-1">{formatINR(sipResult.investedAmount)}</div>
                </div>
                <div className="p-4 bg-ivory rounded border border-rule text-center">
                  <div className="text-[11px] uppercase tracking-wider text-charcoal-muted">Est. Wealth Gain</div>
                  <div className="text-base font-bold text-brand-blue mt-1">+{formatINR(sipResult.estimatedReturns)}</div>
                </div>
                <div className="p-4 bg-navy text-white rounded border border-gold text-center">
                  <div className="text-[11px] uppercase tracking-wider text-gold">Total Corpus</div>
                  <div className="text-base font-bold text-white mt-1">{formatINR(sipResult.totalValue)}</div>
                </div>
              </div>

              {/* Chart */}
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sipResult.yearlySchedule}>
                    <XAxis dataKey="year" tickFormatter={(y) => `Yr ${y}`} />
                    <YAxis tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`} />
                    <Tooltip formatter={(val: number) => formatINR(val)} />
                    <Area type="monotone" dataKey="value" stroke="#0B1F3A" fill="#1F5FD6" fillOpacity={0.25} name="Total Value" />
                    <Area type="monotone" dataKey="invested" stroke="#B08D57" fill="#B08D57" fillOpacity={0.2} name="Invested" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "lumpsum" && (
            <div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-ivory rounded border border-rule text-center">
                  <div className="text-[11px] uppercase tracking-wider text-charcoal-muted">Invested Principal</div>
                  <div className="text-base font-bold text-navy mt-1">{formatINR(lumpResult.investedAmount)}</div>
                </div>
                <div className="p-4 bg-ivory rounded border border-rule text-center">
                  <div className="text-[11px] uppercase tracking-wider text-charcoal-muted">Compounded Return</div>
                  <div className="text-base font-bold text-brand-blue mt-1">+{formatINR(lumpResult.estimatedReturns)}</div>
                </div>
                <div className="p-4 bg-navy text-white rounded border border-gold text-center">
                  <div className="text-[11px] uppercase tracking-wider text-gold">Maturity Corpus</div>
                  <div className="text-base font-bold text-white mt-1">{formatINR(lumpResult.totalValue)}</div>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lumpResult.yearlySchedule}>
                    <XAxis dataKey="year" tickFormatter={(y) => `Yr ${y}`} />
                    <YAxis tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`} />
                    <Tooltip formatter={(val: number) => formatINR(val)} />
                    <Bar dataKey="value" fill="#0B1F3A" name="Portfolio Value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "brokerage" && (
            <div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-ivory rounded border border-rule text-center">
                  <div className="text-[11px] uppercase tracking-wider text-charcoal-muted">Total AUM</div>
                  <div className="text-base font-bold text-navy mt-1">{formatINR(brokResult.totalAum)}</div>
                </div>
                <div className="p-4 bg-ivory rounded border border-rule text-center">
                  <div className="text-[11px] uppercase tracking-wider text-charcoal-muted">Monthly Gross Trail</div>
                  <div className="text-base font-bold text-brand-blue mt-1">{formatINR(brokResult.monthlyGrossCommission)}</div>
                </div>
                <div className="p-4 bg-navy text-white rounded border border-gold text-center">
                  <div className="text-[11px] uppercase tracking-wider text-gold">Annual Net Revenue</div>
                  <div className="text-base font-bold text-white mt-1">{formatINR(brokResult.netAdvisoryEarnings)}</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 italic text-center">
                Sub-broker payout deduction: {formatINR(brokResult.subBrokerPayout)} / year
              </p>
            </div>
          )}

          {activeTab === "tax" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-ivory rounded text-center">
                  <span className="text-[10px] uppercase text-charcoal-muted">Total Capital Gain</span>
                  <div className="text-sm font-bold text-navy mt-0.5">{formatINR(taxResult.grossGain)}</div>
                </div>
                <div className="p-3 bg-ivory rounded text-center">
                  <span className="text-[10px] uppercase text-charcoal-muted">Tax Classification</span>
                  <div className="text-sm font-bold text-brand-blue mt-0.5">{taxResult.taxType} ({taxResult.taxRatePercent}%)</div>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded text-center">
                  <span className="text-[10px] uppercase text-red-700">Tax Liability</span>
                  <div className="text-sm font-bold text-red-700 mt-0.5">{formatINR(taxResult.taxPayable)}</div>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-center">
                  <span className="text-[10px] uppercase text-emerald-800">Net in Hand</span>
                  <div className="text-sm font-bold text-emerald-800 mt-0.5">{formatINR(taxResult.netInHand)}</div>
                </div>
              </div>
              <div className="p-3.5 bg-ivory text-xs text-charcoal rounded border border-rule">
                <strong>Statutory Note (Union Budget 2024):</strong> Equity LTCG exemption applies up to ₹1,25,000 per financial year across all long-term capital assets. The excess gain is taxed at 12.5%. STCG on equity is taxed at 20% without indexation.
              </div>
            </div>
          )}

          {/* Action Row: Print / PDF Download */}
          <div className="pt-4 border-t border-rule flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-charcoal-muted">
              Institutional calculation engine by <strong>Portfolio Pro</strong>
            </span>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy text-white text-xs font-semibold rounded hover:bg-gold hover:text-navy transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

