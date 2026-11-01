"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  TrendingUp,
  Search,
  Filter,
  ShieldCheck,
  Eye,
  X,
  Loader2,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Repeat,
} from "lucide-react";

interface Fund {
  id: string;
  name: string;
  nav: number;
}

interface ClientSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  maskedPan: string;
  pan: string;
  kycStatus: string;
  riskProfile: string;
  totalAum: number;
  totalCost: number;
  xirr: number;
  assignedAdvisor: string;
  activeSipCount: number;
  holdingCount: number;
}

interface Props {
  initialClients: ClientSummary[];
  advisorArn: string;
  funds: Fund[];
}

export function AdvisorDeskClient({ initialClients, advisorArn, funds }: Props) {
  const router = useRouter();
  const [clients, setClients] = useState<ClientSummary[]>(initialClients);
  const [search, setSearch] = useState("");
  const [filterKyc, setFilterKyc] = useState("ALL");

  // Modals
  const [onboardModal, setOnboardModal] = useState(false);
  const [transactModal, setTransactModal] = useState(false);
  const [selectedClientPortfolio, setSelectedClientPortfolio] = useState<ClientSummary | null>(null);

  // Onboard form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pan, setPan] = useState("");
  const [riskProfile, setRiskProfile] = useState("MODERATE");

  // Transact on behalf form
  const [targetClientId, setTargetClientId] = useState(initialClients[0]?.id || "");
  const [orderType, setOrderType] = useState<"SIP" | "PURCHASE">("SIP");
  const [targetFundId, setTargetFundId] = useState(funds[0]?.id || "");
  const [amount, setAmount] = useState(5000);
  const [sipDate, setSipDate] = useState(10);

  // Status/Messages
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const resetMessage = () => setMessage(null);

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.pan.toUpperCase().includes(search.toUpperCase());
    const matchesKyc = filterKyc === "ALL" || c.kycStatus === filterKyc;
    return matchesSearch && matchesKyc;
  });

  // Handle client onboarding
  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    resetMessage();

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          pan: pan.toUpperCase(),
          riskProfile,
          assignedAdvisor: advisorArn,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage({ type: "success", text: data.message });
      // Add newly onboarded client to state
      setClients((prev) => [
        {
          id: data.client.id,
          name: data.client.name,
          email: data.client.email,
          phone,
          maskedPan: data.client.maskedPan,
          pan: pan.toUpperCase(),
          kycStatus: data.client.kycStatus,
          riskProfile,
          totalAum: 0,
          totalCost: 0,
          xirr: 0,
          assignedAdvisor: advisorArn,
          activeSipCount: 0,
          holdingCount: 0,
        },
        ...prev,
      ]);

      setTimeout(() => {
        setOnboardModal(false);
        setName("");
        setEmail("");
        setPhone("");
        setPan("");
      }, 1500);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to onboard client" });
    } finally {
      setLoading(false);
    }
  };

  // Handle transact on behalf
  const handleTransactOnBehalf = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    resetMessage();

    try {
      if (orderType === "SIP") {
        const res = await fetch("/api/investments/sip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fundId: targetFundId,
            amount,
            sipDate,
            clientId: targetClientId,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setMessage({ type: "success", text: `Client Order Executed: ${data.message}` });
      } else {
        const res = await fetch("/api/investments/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "PURCHASE",
            fundId: targetFundId,
            amount,
            clientId: targetClientId,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setMessage({ type: "success", text: `Client Order Executed: ${data.message}` });
      }
      setTimeout(() => router.refresh(), 1500);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Execution error" });
    } finally {
      setLoading(false);
    }
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-[4px] border border-rule shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { resetMessage(); setOnboardModal(true); }}
            className="px-4 py-2 bg-navy hover:bg-navy-light text-gold text-xs font-bold rounded flex items-center gap-2 shadow transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Onboard New Client</span>
          </button>

          <button
            onClick={() => { resetMessage(); setTransactModal(true); }}
            className="px-4 py-2 bg-gold hover:bg-gold-dark text-navy text-xs font-bold rounded flex items-center gap-2 shadow transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Transact on Behalf of Client</span>
          </button>
        </div>

        {/* Distributor Isolation Badge */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-charcoal-muted">Isolated Multi-Tenant Partition:</span>
          <span className="font-mono font-bold text-navy bg-ivory px-2.5 py-1 rounded border border-rule">
            {advisorArn} ({clients.length} Clients Assigned)
          </span>
        </div>
      </div>

      {/* Client Roster & Search */}
      <div className="bg-white rounded-[4px] border border-rule shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rule pb-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-navy">Assigned Investor Clients</h3>
            <p className="text-xs text-charcoal-muted">
              Displaying solely your distributor-assigned investor folios and KYC standings.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, PAN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-rule rounded bg-ivory/40 focus:outline-none focus:border-gold w-48 sm:w-60"
              />
            </div>

            <select
              value={filterKyc}
              onChange={(e) => setFilterKyc(e.target.value)}
              className="py-1.5 px-2 text-xs border border-rule rounded bg-ivory/40 text-charcoal"
            >
              <option value="ALL">All KYC</option>
              <option value="VERIFIED">Verified</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredClients.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-500">
              No clients found matching the query or assigned to {advisorArn}.
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-ivory border-y border-rule font-serif text-navy">
                  <th className="p-3">Client Identity</th>
                  <th className="p-3">Masked PAN</th>
                  <th className="p-3 text-right">Portfolio AUM</th>
                  <th className="p-3 text-right">XIRR</th>
                  <th className="p-3 text-center">Active SIPs</th>
                  <th className="p-3 text-center">KYC Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-b border-rule/60 hover:bg-ivory/50">
                    <td className="p-3">
                      <div className="font-bold text-navy">{client.name}</div>
                      <div className="text-[11px] text-gray-500">{client.email} • {client.phone}</div>
                    </td>
                    <td className="p-3 font-mono font-semibold text-charcoal">{client.maskedPan}</td>
                    <td className="p-3 text-right font-mono font-bold text-navy">
                      {formatINR(client.totalAum)}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-700">
                      +{client.xirr}%
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 bg-ivory text-navy font-semibold rounded border border-rule text-[11px]">
                        {client.activeSipCount} SIPs
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          client.kycStatus === "VERIFIED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {client.kycStatus}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedClientPortfolio(client)}
                        className="px-2.5 py-1 bg-navy text-gold text-xs font-semibold rounded hover:bg-navy-light transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* =========================================================================
          1. ONBOARD NEW CLIENT MODAL
         ========================================================================= */}
      {onboardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[4px] border border-gold/60 shadow-classic-lg max-w-md w-full p-6 text-xs text-charcoal">
            <div className="flex justify-between items-center border-b border-rule pb-3 mb-4">
              <h3 className="font-serif text-base font-bold text-navy flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-gold" />
                <span>Onboard New Mutual Fund Investor</span>
              </h3>
              <button onClick={() => setOnboardModal(false)} className="text-gray-400 hover:text-navy">
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

            <form onSubmit={handleOnboard} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alok Verma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-rule rounded text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="alok@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-rule rounded text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Mobile (10 Digits) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="9820012345"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border border-rule rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">PAN Card Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    className="w-full p-2 border border-rule rounded text-xs uppercase font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Risk Profiling Band</label>
                <select
                  value={riskProfile}
                  onChange={(e) => setRiskProfile(e.target.value)}
                  className="w-full p-2 border border-rule rounded bg-white text-xs"
                >
                  <option value="CONSERVATIVE">Conservative</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="GROWTH_ORIENTED">Growth Oriented</option>
                  <option value="AGGRESSIVE">Aggressive</option>
                </select>
              </div>

              <div className="p-2.5 bg-ivory rounded border border-rule text-[11px] text-gray-600">
                Client will be mapped to advisor code: <strong>{advisorArn}</strong>. Default credentials generated automatically.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gold hover:bg-gold-dark text-navy font-bold rounded flex items-center justify-center gap-2 mt-4 shadow"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-navy" /> : "Complete Digital Onboarding"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. TRANSACT ON BEHALF OF CLIENT MODAL
         ========================================================================= */}
      {transactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[4px] border border-gold/60 shadow-classic-lg max-w-md w-full p-6 text-xs text-charcoal">
            <div className="flex justify-between items-center border-b border-rule pb-3 mb-4">
              <h3 className="font-serif text-base font-bold text-navy flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gold" />
                <span>Place Order on Behalf of Client</span>
              </h3>
              <button onClick={() => setTransactModal(false)} className="text-gray-400 hover:text-navy">
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

            <form onSubmit={handleTransactOnBehalf} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Select Client</label>
                <select
                  value={targetClientId}
                  onChange={(e) => setTargetClientId(e.target.value)}
                  className="w-full p-2 border border-rule rounded bg-white text-xs font-semibold"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.maskedPan}) — AUM: {formatINR(c.totalAum)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType("SIP")}
                  className={`flex-1 py-1.5 font-bold rounded border ${
                    orderType === "SIP" ? "bg-navy text-gold border-navy" : "bg-ivory text-charcoal border-rule"
                  }`}
                >
                  Monthly SIP
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType("PURCHASE")}
                  className={`flex-1 py-1.5 font-bold rounded border ${
                    orderType === "PURCHASE" ? "bg-navy text-gold border-navy" : "bg-ivory text-charcoal border-rule"
                  }`}
                >
                  Lumpsum Buy
                </button>
              </div>

              <div>
                <label className="block font-semibold mb-1">Select Mutual Fund</label>
                <select
                  value={targetFundId}
                  onChange={(e) => setTargetFundId(e.target.value)}
                  className="w-full p-2 border border-rule rounded bg-white text-xs"
                >
                  {funds.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} (NAV: ₹{f.nav.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  {orderType === "SIP" ? "Monthly SIP Amount (₹)" : "Lumpsum Amount (₹)"}
                </label>
                <input
                  type="number"
                  min={orderType === "SIP" ? 500 : 1000}
                  step={500}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full p-2 border border-rule rounded text-xs font-bold text-navy"
                />
              </div>

              {orderType === "SIP" && (
                <div>
                  <label className="block font-semibold mb-1">Debit Day of Month</label>
                  <select
                    value={sipDate}
                    onChange={(e) => setSipDate(Number(e.target.value))}
                    className="w-full p-2 border border-rule rounded bg-white text-xs"
                  >
                    {[1, 5, 7, 10, 15, 20, 25, 28].map((d) => (
                      <option key={d} value={d}>
                        {d}th of month
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-navy hover:bg-navy-light text-gold font-bold rounded flex items-center justify-center gap-2 mt-4 shadow"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-gold" /> : "Route Order to BSE StarMF"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. VIEW CLIENT PORTFOLIO MODAL
         ========================================================================= */}
      {selectedClientPortfolio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[4px] border border-gold/60 shadow-classic-lg max-w-lg w-full p-6 text-xs text-charcoal">
            <div className="flex justify-between items-center border-b border-rule pb-3 mb-4">
              <div>
                <h3 className="font-serif text-base font-bold text-navy">{selectedClientPortfolio.name}</h3>
                <span className="text-[11px] text-gray-500 font-mono">
                  PAN: {selectedClientPortfolio.maskedPan} • Advisor: {selectedClientPortfolio.assignedAdvisor}
                </span>
              </div>
              <button onClick={() => setSelectedClientPortfolio(null)} className="text-gray-400 hover:text-navy">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-3 bg-ivory rounded border border-rule">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Total AUM</span>
                <span className="font-serif font-bold text-navy text-sm">{formatINR(selectedClientPortfolio.totalAum)}</span>
              </div>
              <div className="p-3 bg-ivory rounded border border-rule">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Invested Cost</span>
                <span className="font-serif font-bold text-gray-700 text-sm">{formatINR(selectedClientPortfolio.totalCost)}</span>
              </div>
              <div className="p-3 bg-ivory rounded border border-rule">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">XIRR</span>
                <span className="font-serif font-bold text-emerald-700 text-sm">+{selectedClientPortfolio.xirr}%</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-rule/60">
                <span className="text-gray-500">Email Address:</span>
                <span className="font-semibold text-navy">{selectedClientPortfolio.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rule/60">
                <span className="text-gray-500">Phone Number:</span>
                <span className="font-semibold text-navy">{selectedClientPortfolio.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rule/60">
                <span className="text-gray-500">KYC Status:</span>
                <span className="font-bold text-emerald-700">{selectedClientPortfolio.kycStatus}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rule/60">
                <span className="text-gray-500">Risk Profile:</span>
                <span className="font-bold text-navy">{selectedClientPortfolio.riskProfile}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rule/60">
                <span className="text-gray-500">Active Mandates:</span>
                <span className="font-semibold text-navy">{selectedClientPortfolio.activeSipCount} Live SIPs</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => {
                  setTargetClientId(selectedClientPortfolio.id);
                  setSelectedClientPortfolio(null);
                  setTransactModal(true);
                }}
                className="px-4 py-2 bg-navy text-gold text-xs font-bold rounded hover:bg-navy-light"
              >
                Place Order for Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

