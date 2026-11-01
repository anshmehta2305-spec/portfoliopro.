"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  PlusCircle,
  Repeat,
  ArrowRightLeft,
  ArrowDownCircle,
  TrendingUp,
  UserCheck,
  Bell,
  X,
  Loader2,
  CheckCircle2,
  Target,
  Edit3,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Fund {
  id: string;
  name: string;
  nav: number;
  category: string;
}

interface Holding {
  id: string;
  folioNumber: string;
  units: number;
  currentNav: number;
  currentValue: number;
  fund: Fund;
}

interface InvestorActionModalsProps {
  clientId: string;
  kycStatus: string;
  holdings: Holding[];
  funds: Fund[];
  clientName: string;
  clientPan: string;
  clientPhone: string;
  riskProfile: string;
}

export function InvestorActionModals({
  clientId,
  kycStatus,
  holdings,
  funds,
  clientName,
  clientPan,
  clientPhone,
  riskProfile,
}: InvestorActionModalsProps) {
  const router = useRouter();

  // Modal visibility states
  const [transactModal, setTransactModal] = useState(false);
  const [kycModal, setKycModal] = useState(false);
  const [goalModal, setGoalModal] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [notifModal, setNotifModal] = useState(false);

  // Transact form states
  const [transactTab, setTransactTab] = useState<"SIP" | "PURCHASE" | "REDEMPTION" | "SWITCH">("SIP");
  const [selectedFundId, setSelectedFundId] = useState(funds[0]?.id || "");
  const [amount, setAmount] = useState(5000);
  const [sipDate, setSipDate] = useState(10);
  const [selectedHoldingId, setSelectedHoldingId] = useState(holdings[0]?.id || "");
  const [destFundId, setDestFundId] = useState(funds[1]?.id || "");
  const [unitsToRedeem, setUnitsToRedeem] = useState<number | "">("");

  // KYC flow states
  const [kycStep, setKycStep] = useState(1);
  const [aadhaar, setAadhaar] = useState("9876 5432 1098");
  const [otp, setOtp] = useState("123456");
  const [bankAcc, setBankAcc] = useState("50100234567890");
  const [ifsc, setIfsc] = useState("HDFC0000123");

  // Goal form states
  const [goalTitle, setGoalTitle] = useState("");
  const [goalCategory, setGoalCategory] = useState("RETIREMENT");
  const [goalTarget, setGoalTarget] = useState(2500000);
  const [goalCurrent, setGoalCurrent] = useState(100000);
  const [goalYear, setGoalYear] = useState(2035);

  // Profile form states
  const [editPhone, setEditPhone] = useState(clientPhone);
  const [editRisk, setEditRisk] = useState(riskProfile);

  // Notifications state
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(2);

  // General loading/message states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const resetMessage = () => setMessage(null);

  // --- 1. TRANSACT SUBMISSION ---
  const handleTransact = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    resetMessage();

    try {
      if (transactTab === "SIP") {
        const res = await fetch("/api/investments/sip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fundId: selectedFundId, amount, sipDate, clientId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setMessage({ type: "success", text: data.message });
      } else {
        const res = await fetch("/api/investments/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: transactTab,
            fundId: selectedFundId,
            destFundId,
            amount,
            units: unitsToRedeem || undefined,
            holdingId: selectedHoldingId,
            clientId,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setMessage({ type: "success", text: data.message });
      }
      setTimeout(() => router.refresh(), 1500);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Execution error" });
    } finally {
      setLoading(false);
    }
  };

  // --- 2. KYC COMPLETION SUBMISSION ---
  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    resetMessage();

    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kycStatus: "VERIFIED" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage({ type: "success", text: "DigiLocker KYC & Bank verification completed successfully! Status updated to VERIFIED." });
      setTimeout(() => {
        setKycModal(false);
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "KYC verification error" });
    } finally {
      setLoading(false);
    }
  };

  // --- 3. GOAL SUBMISSION ---
  const handleGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    resetMessage();

    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: goalTitle,
          category: goalCategory,
          targetAmount: goalTarget,
          currentAmount: goalCurrent,
          targetYear: goalYear,
          clientId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage({ type: "success", text: data.message });
      setTimeout(() => {
        setGoalModal(false);
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to create goal" });
    } finally {
      setLoading(false);
    }
  };

  // --- 4. PROFILE UPDATE SUBMISSION ---
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    resetMessage();

    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: editPhone,
          riskProfile: editRisk,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage({ type: "success", text: "Profile settings updated successfully." });
      setTimeout(() => {
        setProfileModal(false);
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };

  // Load notifications
  const openNotifications = async () => {
    setNotifModal(true);
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(0);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-4 rounded-[4px] border border-rule shadow-sm">
      {/* Left: Quick Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => { resetMessage(); setTransactModal(true); }}
          className="px-3.5 py-1.5 bg-navy hover:bg-navy-light text-gold text-xs font-bold rounded flex items-center gap-1.5 shadow transition-colors"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Transact (Buy / SIP / Redeem)</span>
        </button>

        <button
          onClick={() => { resetMessage(); setGoalModal(true); }}
          className="px-3.5 py-1.5 bg-ivory hover:bg-gold/20 text-navy border border-rule text-xs font-bold rounded flex items-center gap-1.5 transition-colors"
        >
          <Target className="w-3.5 h-3.5 text-gold" />
          <span>Add Financial Goal</span>
        </button>

        <button
          onClick={() => { resetMessage(); setProfileModal(true); }}
          className="px-3.5 py-1.5 bg-ivory hover:bg-gold/20 text-navy border border-rule text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5 text-gray-500" />
          <span>Edit Profile</span>
        </button>

        {kycStatus !== "VERIFIED" && (
          <button
            onClick={() => { resetMessage(); setKycModal(true); }}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded flex items-center gap-1.5 shadow animate-pulse"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Complete Digital KYC</span>
          </button>
        )}
      </div>

      {/* Right: Notifications Bell */}
      <div className="flex items-center gap-3">
        <button
          onClick={openNotifications}
          className="relative p-2 text-navy hover:bg-ivory rounded border border-rule transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4 text-navy" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* =========================================================================
          1. TRANSACT MODAL (SIP, LUMPSUM, REDEEM, SWITCH)
         ========================================================================= */}
      {transactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[4px] border border-gold/60 shadow-classic-lg max-w-lg w-full p-6 text-xs text-charcoal">
            <div className="flex justify-between items-center border-b border-rule pb-3 mb-4">
              <h3 className="font-serif text-base font-bold text-navy flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gold" />
                <span>Execute Mutual Fund Order</span>
              </h3>
              <button onClick={() => setTransactModal(false)} className="text-gray-400 hover:text-navy">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab selector */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-ivory rounded border border-rule mb-4 font-semibold text-center">
              <button
                type="button"
                onClick={() => { setTransactTab("SIP"); resetMessage(); }}
                className={`py-1.5 rounded transition-colors ${transactTab === "SIP" ? "bg-navy text-gold shadow-sm" : "hover:text-navy"}`}
              >
                SIP
              </button>
              <button
                type="button"
                onClick={() => { setTransactTab("PURCHASE"); resetMessage(); }}
                className={`py-1.5 rounded transition-colors ${transactTab === "PURCHASE" ? "bg-navy text-gold shadow-sm" : "hover:text-navy"}`}
              >
                Lumpsum
              </button>
              <button
                type="button"
                onClick={() => { setTransactTab("REDEMPTION"); resetMessage(); }}
                className={`py-1.5 rounded transition-colors ${transactTab === "REDEMPTION" ? "bg-navy text-gold shadow-sm" : "hover:text-navy"}`}
              >
                Redeem
              </button>
              <button
                type="button"
                onClick={() => { setTransactTab("SWITCH"); resetMessage(); }}
                className={`py-1.5 rounded transition-colors ${transactTab === "SWITCH" ? "bg-navy text-gold shadow-sm" : "hover:text-navy"}`}
              >
                Switch
              </button>
            </div>

            {message && (
              <div
                className={`p-3 rounded mb-4 text-xs ${
                  message.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleTransact} className="space-y-3">
              {/* Scheme selection (for SIP & Lumpsum) */}
              {(transactTab === "SIP" || transactTab === "PURCHASE") && (
                <div>
                  <label className="block font-semibold mb-1">Select Scheme</label>
                  <select
                    value={selectedFundId}
                    onChange={(e) => setSelectedFundId(e.target.value)}
                    className="w-full p-2 border border-rule rounded bg-white text-xs"
                  >
                    {funds.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} (NAV: ₹{f.nav.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Source Holding selection (for Redeem & Switch) */}
              {(transactTab === "REDEMPTION" || transactTab === "SWITCH") && (
                <div>
                  <label className="block font-semibold mb-1">Select Existing Holding</label>
                  <select
                    value={selectedHoldingId}
                    onChange={(e) => setSelectedHoldingId(e.target.value)}
                    className="w-full p-2 border border-rule rounded bg-white text-xs"
                  >
                    {holdings.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.fund.name} — {h.units.toFixed(2)} units (₹{h.currentValue.toLocaleString("en-IN")})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Destination fund (for Switch) */}
              {transactTab === "SWITCH" && (
                <div>
                  <label className="block font-semibold mb-1">Switch Destination Scheme</label>
                  <select
                    value={destFundId}
                    onChange={(e) => setDestFundId(e.target.value)}
                    className="w-full p-2 border border-rule rounded bg-white text-xs"
                  >
                    {funds.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} (NAV: ₹{f.nav.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Amount */}
              {transactTab !== "REDEMPTION" && (
                <div>
                  <label className="block font-semibold mb-1">
                    {transactTab === "SIP" ? "Monthly Installment (₹)" : "Investment Amount (₹)"}
                  </label>
                  <input
                    type="number"
                    min={transactTab === "SIP" ? 500 : 1000}
                    step={500}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full p-2 border border-rule rounded text-xs font-bold text-navy"
                  />
                </div>
              )}

              {/* Execution day (for SIP) */}
              {transactTab === "SIP" && (
                <div>
                  <label className="block font-semibold mb-1">Debit Day of Month</label>
                  <select
                    value={sipDate}
                    onChange={(e) => setSipDate(Number(e.target.value))}
                    className="w-full p-2 border border-rule rounded bg-white text-xs"
                  >
                    {[1, 5, 7, 10, 15, 20, 25, 28].map((d) => (
                      <option key={d} value={d}>
                        {d}th of every month
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Units to redeem */}
              {transactTab === "REDEMPTION" && (
                <div>
                  <label className="block font-semibold mb-1">Units or Amount to Redeem</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Units (e.g. 10.5)"
                      step="any"
                      value={unitsToRedeem}
                      onChange={(e) => {
                        setUnitsToRedeem(Number(e.target.value));
                        setAmount(0);
                      }}
                      className="p-2 border border-rule rounded text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Amount in ₹"
                      value={amount || ""}
                      onChange={(e) => {
                        setAmount(Number(e.target.value));
                        setUnitsToRedeem("");
                      }}
                      className="p-2 border border-rule rounded text-xs font-semibold text-navy"
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1 block">
                    Redemption proceeds credit to registered bank account in T+2 working days.
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-navy hover:bg-navy-light text-gold font-bold rounded flex items-center justify-center gap-2 mt-4 shadow"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-gold" /> : "Confirm Order via BSE StarMF"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. DIGITAL KYC FLOW MODAL
         ========================================================================= */}
      {kycModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[4px] border border-gold/60 shadow-classic-lg max-w-md w-full p-6 text-xs text-charcoal">
            <div className="flex justify-between items-center border-b border-rule pb-3 mb-4">
              <h3 className="font-serif text-base font-bold text-navy flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span>SEBI / KRA Digital KYC Verification</span>
              </h3>
              <button onClick={() => setKycModal(false)} className="text-gray-400 hover:text-navy">
                <X className="w-4 h-4" />
              </button>
            </div>

            {message && (
              <div
                className={`p-3 rounded mb-4 text-xs ${
                  message.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleKycSubmit} className="space-y-3">
              <div>
                <label className="block text-gray-500 text-[11px]">PAN Verified via Income Tax Dept:</label>
                <div className="font-mono font-bold text-navy text-sm">{clientPan}</div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Aadhaar Number (DigiLocker)</label>
                <input
                  type="text"
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)}
                  className="w-full p-2 border border-rule rounded text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Aadhaar OTP (Simulation)</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full p-2 border border-rule rounded text-xs font-mono text-center tracking-widest font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Bank Account No.</label>
                  <input
                    type="text"
                    value={bankAcc}
                    onChange={(e) => setBankAcc(e.target.value)}
                    className="w-full p-2 border border-rule rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    className="w-full p-2 border border-rule rounded text-xs font-mono uppercase"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200 text-[11px] text-emerald-800">
                Penny-drop verification confirmed. Name match on bank account: <strong>{clientName}</strong> (100% Match).
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gold hover:bg-gold-dark text-navy font-bold rounded flex items-center justify-center gap-2 mt-4 shadow"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-navy" /> : "Verify & Authorize KYC"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. ADD FINANCIAL GOAL MODAL
         ========================================================================= */}
      {goalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[4px] border border-gold/60 shadow-classic-lg max-w-md w-full p-6 text-xs text-charcoal">
            <div className="flex justify-between items-center border-b border-rule pb-3 mb-4">
              <h3 className="font-serif text-base font-bold text-navy flex items-center gap-2">
                <Target className="w-4 h-4 text-gold" />
                <span>Create New Financial Goal</span>
              </h3>
              <button onClick={() => setGoalModal(false)} className="text-gray-400 hover:text-navy">
                <X className="w-4 h-4" />
              </button>
            </div>

            {message && (
              <div
                className={`p-3 rounded mb-4 text-xs ${
                  message.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleGoalSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Goal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dream Luxury Home / Child Ivy League"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full p-2 border border-rule rounded text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value)}
                    className="w-full p-2 border border-rule rounded bg-white text-xs"
                  >
                    <option value="RETIREMENT">Retirement</option>
                    <option value="EDUCATION">Higher Education</option>
                    <option value="HOME">Dream Home</option>
                    <option value="WEALTH">Wealth Creation</option>
                    <option value="EMERGENCY">Emergency Fund</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Target Year</label>
                  <input
                    type="number"
                    min={new Date().getFullYear() + 1}
                    max={2060}
                    value={goalYear}
                    onChange={(e) => setGoalYear(Number(e.target.value))}
                    className="w-full p-2 border border-rule rounded text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Target Corpus (₹)</label>
                  <input
                    type="number"
                    step={50000}
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(Number(e.target.value))}
                    className="w-full p-2 border border-rule rounded text-xs font-bold text-navy"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Current Savings (₹)</label>
                  <input
                    type="number"
                    step={10000}
                    value={goalCurrent}
                    onChange={(e) => setGoalCurrent(Number(e.target.value))}
                    className="w-full p-2 border border-rule rounded text-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-ivory rounded border border-rule text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Horizon:</span>
                  <span className="font-semibold text-navy">{goalYear - new Date().getFullYear()} Years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Required Monthly SIP (at 12%):</span>
                  <span className="font-bold text-emerald-700">
                    ₹{Math.max(500, Math.round((goalTarget - goalCurrent) / ((goalYear - new Date().getFullYear()) * 12 * 1.5))).toLocaleString("en-IN")}/mo
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-navy hover:bg-navy-light text-gold font-bold rounded flex items-center justify-center gap-2 mt-4 shadow"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-gold" /> : "Save & Track Goal"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          4. EDIT PROFILE MODAL
         ========================================================================= */}
      {profileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[4px] border border-gold/60 shadow-classic-lg max-w-md w-full p-6 text-xs text-charcoal">
            <div className="flex justify-between items-center border-b border-rule pb-3 mb-4">
              <h3 className="font-serif text-base font-bold text-navy flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-gold" />
                <span>Investor Profile & Risk Settings</span>
              </h3>
              <button onClick={() => setProfileModal(false)} className="text-gray-400 hover:text-navy">
                <X className="w-4 h-4" />
              </button>
            </div>

            {message && (
              <div
                className={`p-3 rounded mb-4 text-xs ${
                  message.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-3">
              <div>
                <label className="block text-gray-500 text-[11px]">Client Legal Name</label>
                <div className="font-semibold text-navy text-xs">{clientName}</div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Registered Mobile Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full p-2 border border-rule rounded text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Risk Profiling Band</label>
                <select
                  value={editRisk}
                  onChange={(e) => setEditRisk(e.target.value)}
                  className="w-full p-2 border border-rule rounded bg-white text-xs font-semibold"
                >
                  <option value="CONSERVATIVE">Conservative (Debt & Liquid Focus)</option>
                  <option value="MODERATE">Moderate (Balanced Advantage & Hybrid)</option>
                  <option value="GROWTH_ORIENTED">Growth Oriented (Large & Midcap)</option>
                  <option value="AGGRESSIVE">Aggressive (Small Cap & Sectoral Focus)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-navy hover:bg-navy-light text-gold font-bold rounded flex items-center justify-center gap-2 mt-4 shadow"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-gold" /> : "Save Profile Updates"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. NOTIFICATIONS MODAL
         ========================================================================= */}
      {notifModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[4px] border border-gold/60 shadow-classic-lg max-w-md w-full p-6 text-xs text-charcoal">
            <div className="flex justify-between items-center border-b border-rule pb-3 mb-4">
              <h3 className="font-serif text-base font-bold text-navy flex items-center gap-2">
                <Bell className="w-4 h-4 text-gold" />
                <span>Account Notifications & Alerts</span>
              </h3>
              <button onClick={() => setNotifModal(false)} className="text-gray-400 hover:text-navy">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-xs">
                  No unread notifications at this time.
                </div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="p-3 bg-ivory rounded border border-rule space-y-1">
                    <div className="font-bold text-navy flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                      <span>{n.title}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-gray-400 block pt-1">
                      {new Date(n.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-rule pt-3 mt-4 text-right">
              <button
                onClick={() => setNotifModal(false)}
                className="px-4 py-1.5 bg-navy text-gold text-xs font-semibold rounded hover:bg-navy-light"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

