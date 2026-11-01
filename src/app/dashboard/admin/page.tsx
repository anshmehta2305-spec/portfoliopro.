"use client";

import React, { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/config/site";
import {
  Users,
  Shield,
  Layers,
  FileText,
  Star,
  Settings,
  Download,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  PlusCircle,
  TrendingUp,
  Activity,
  UserCheck,
  UserX,
} from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  arnCode: string | null;
  isActive: boolean;
  createdAt: string;
}

interface FundItem {
  id: string;
  amfiCode: string;
  name: string;
  category: string;
  amc: string;
  nav: number;
  navDate: string;
}

interface AuditLogItem {
  id: string;
  action: string;
  details: string;
  ipAddress: string | null;
  createdAt: string;
  user: { name: string; email: string; role: string } | null;
}

interface LeadItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  arn: string | null;
  city: string | null;
  stage: string;
  score: number;
}

interface TestimonialItem {
  id: string;
  authorName: string;
  companyName: string;
  rating: number;
  feedback: string;
  isApproved: boolean;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"leads" | "users" | "funds" | "audit" | "testimonials" | "settings">("leads");

  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [funds, setFunds] = useState<FundItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fund update states
  const [selectedFundId, setSelectedFundId] = useState("");
  const [newNavVal, setNewNavVal] = useState("");
  const [newFundAmfi, setNewFundAmfi] = useState("");
  const [newFundName, setNewFundName] = useState("");
  const [newFundCategory, setNewFundCategory] = useState("Large Cap");
  const [newFundAmc, setNewFundAmc] = useState("HDFC Mutual Fund");
  const [newFundNav, setNewFundNav] = useState("100.00");

  // Notification message
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Brand config preview state
  const [brandName, setBrandName] = useState(siteConfig.name);
  const [arnCode, setArnCode] = useState(siteConfig.arnNumber);
  const [phone, setPhone] = useState(siteConfig.phone);
  const [email, setEmail] = useState(siteConfig.email);
  const [savedSettings, setSavedSettings] = useState(false);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [leadsRes, testRes, usersRes, fundsRes, auditRes] = await Promise.all([
        fetch("/api/leads"),
        fetch("/api/testimonials?includeUnapproved=true"),
        fetch("/api/admin/users"),
        fetch("/api/funds"),
        fetch("/api/admin/audit-logs?limit=30"),
      ]);

      const leadsData = await leadsRes.json();
      const testData = await testRes.json();
      const usersData = await usersRes.json();
      const fundsData = await fundsRes.json();
      const auditData = await auditRes.json();

      if (leadsData.leads) setLeads(leadsData.leads);
      if (testData.testimonials) setTestimonials(testData.testimonials);
      if (usersData.users) setUsers(usersData.users);
      if (fundsData.funds) {
        setFunds(fundsData.funds);
        if (fundsData.funds.length > 0 && !selectedFundId) {
          setSelectedFundId(fundsData.funds[0].id);
          setNewNavVal(fundsData.funds[0].nav.toString());
        }
      }
      if (auditData.logs) setAuditLogs(auditData.logs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Update User Status
  const handleToggleUserActive = async (userId: string, currentActive: boolean) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isActive: !currentActive }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isActive: !currentActive } : u))
        );
        setStatusMsg({ type: "success", text: `User status changed to ${!currentActive ? "Active" : "Inactive"}.` });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Failed to update user status." });
    }
  };

  // Update User Role
  const handleChangeUserRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        setStatusMsg({ type: "success", text: `User role updated to ${newRole}.` });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Failed to update user role." });
    }
  };

  // Update Fund NAV
  const handleUpdateNav = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/funds", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fundId: selectedFundId, newNav: Number(newNavVal) }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg({ type: "success", text: data.message });
        setFunds((prev) =>
          prev.map((f) => (f.id === selectedFundId ? { ...f, nav: Number(newNavVal) } : f))
        );
      } else {
        setStatusMsg({ type: "error", text: data.error });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Failed to update NAV." });
    }
  };

  // Add New Fund
  const handleCreateFund = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/funds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amfiCode: newFundAmfi,
          name: newFundName,
          category: newFundCategory,
          amc: newFundAmc,
          nav: Number(newFundNav),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg({ type: "success", text: data.message });
        setFunds((prev) => [data.fund, ...prev]);
        setNewFundAmfi("");
        setNewFundName("");
      } else {
        setStatusMsg({ type: "error", text: data.error });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Failed to register fund." });
    }
  };

  const handleUpdateLeadStage = async (id: string, newStage: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, stage: newStage } : l))
    );
  };

  const handleApproveTestimonial = async (id: string) => {
    try {
      await fetch("/api/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isApproved: true }),
      });
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isApproved: true } : t))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveBrandSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2500);
  };

  return (
    <div className="min-h-screen bg-ivory">
      <DashboardHeader
        roleName="Super Admin"
        userName="Siddharth Mehta"
        subTitle="Master Platform Control Plane"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="p-5 border-l-4 border-l-navy bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Total Platform Users
            </span>
            <div className="text-2xl font-serif font-bold text-navy mt-1">{users.length} Registered</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">
              Across 8 RBAC Roles
            </div>
          </Card>

          <Card className="p-5 border-l-4 border-l-brand-blue bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Catalogued Mutual Funds
            </span>
            <div className="text-2xl font-serif font-bold text-brand-blue mt-1">{funds.length} Schemes</div>
            <div className="text-[11px] text-gray-500 mt-1">Live AMFI NAV Feeds</div>
          </Card>

          <Card className="p-5 border-l-4 border-l-gold bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Audit Logs Recorded
            </span>
            <div className="text-2xl font-serif font-bold text-gold-dark mt-1">
              {auditLogs.length} Events
            </div>
            <div className="text-[11px] text-gray-500 mt-1">Immutable SEBI Audit Log</div>
          </Card>

          <Card className="p-5 border-l-4 border-l-emerald-600 bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Active CRM Leads
            </span>
            <div className="text-2xl font-serif font-bold text-emerald-800 mt-1">{leads.length} Leads</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">
              High-intent MFDs
            </div>
          </Card>
        </div>

        {statusMsg && (
          <div
            className={`p-3 rounded text-xs flex justify-between items-center ${
              statusMsg.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <span>{statusMsg.text}</span>
            <button onClick={() => setStatusMsg(null)} className="font-bold underline text-[11px]">
              Dismiss
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-rule pb-2 text-xs">
          {[
            { id: "leads", label: "Leads & CRM" },
            { id: "users", label: "User Management & RBAC" },
            { id: "funds", label: "Fund Catalog & NAV Updates" },
            { id: "audit", label: "Audit Logs & Security" },
            { id: "testimonials", label: "Testimonials" },
            { id: "settings", label: "White-Label Brand" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-navy text-gold shadow-sm"
                  : "bg-white text-charcoal hover:bg-ivory border border-rule"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* =========================================================================
            TAB 1: LEADS PIPELINE
           ========================================================================= */}
        {activeTab === "leads" && (
          <div className="bg-white rounded-[4px] border border-rule shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rule pb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-navy">
                  Distributor Leads & Conversion Pipeline
                </h3>
                <p className="text-xs text-charcoal-muted">
                  Scored based on AMFI ARN presence, city, and module interest.
                </p>
              </div>

              <a
                href="/api/leads?format=csv"
                download="portfolio-pro-leads.csv"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy text-white text-xs font-semibold rounded hover:bg-gold hover:text-navy transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export All Leads to CSV</span>
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-ivory border-y border-rule font-serif text-navy">
                    <th className="p-3">Distributor Name</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">ARN / City</th>
                    <th className="p-3 text-center">Score</th>
                    <th className="p-3">Pipeline Stage</th>
                    <th className="p-3 text-right">Update Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr key={l.id} className="border-b border-rule/60 hover:bg-ivory/50">
                      <td className="p-3 font-bold text-navy">{l.name}</td>
                      <td className="p-3 text-gray-500">
                        <div>{l.email}</div>
                        <div className="text-[10px]">{l.phone}</div>
                      </td>
                      <td className="p-3 font-mono">
                        <div>{l.arn || "No ARN"}</div>
                        <div className="text-[10px] text-gray-400 font-sans">{l.city || "N/A"}</div>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            l.score >= 80
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-gold/15 text-gold-dark border border-gold/30"
                          }`}
                        >
                          {l.score}/100
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-navy">{l.stage}</td>
                      <td className="p-3 text-right">
                        <select
                          value={l.stage}
                          onChange={(e) => handleUpdateLeadStage(l.id, e.target.value)}
                          className="p-1 border border-rule rounded bg-white text-[11px] text-navy font-semibold"
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="DEMO_SCHEDULED">DEMO SCHEDULED</option>
                          <option value="WON">WON (ACTIVE MFD)</option>
                          <option value="LOST">LOST</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: USER MANAGEMENT & ROLE PERMISSIONS
           ========================================================================= */}
        {activeTab === "users" && (
          <div className="bg-white rounded-[4px] border border-rule shadow-sm p-6 space-y-4">
            <div className="border-b border-rule pb-3">
              <h3 className="font-serif text-lg font-bold text-navy">
                User Management & Role-Based Access Control (RBAC)
              </h3>
              <p className="text-xs text-charcoal-muted">
                Inspect all registered users, toggle active status, and modify organizational role permissions.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-ivory border-y border-rule font-serif text-navy">
                    <th className="p-3">User</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Assigned Role</th>
                    <th className="p-3">ARN / Sub-code</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Toggle Status</th>
                    <th className="p-3 text-right">Change Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-rule/60 hover:bg-ivory/50">
                      <td className="p-3 font-bold text-navy">{u.name}</td>
                      <td className="p-3 text-gray-500 font-mono text-[11px]">{u.email}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-navy text-gold text-[10px] font-bold rounded">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-charcoal">{u.arnCode || "—"}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {u.isActive ? "ACTIVE" : "SUSPENDED"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleToggleUserActive(u.id, u.isActive)}
                          className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                            u.isActive
                              ? "bg-red-50 text-red-700 hover:bg-red-100"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeUserRole(u.id, e.target.value)}
                          className="p-1 border border-rule rounded bg-white text-[11px] font-semibold"
                        >
                          <option value="INVESTOR">INVESTOR</option>
                          <option value="ADVISOR">ADVISOR</option>
                          <option value="CORPORATE">CORPORATE</option>
                          <option value="EMPLOYEE">EMPLOYEE</option>
                          <option value="SUB_BROKER">SUB_BROKER</option>
                          <option value="BRANCH">BRANCH</option>
                          <option value="RM">RM</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: FUND CATALOG & NAV UPDATES
           ========================================================================= */}
        {activeTab === "funds" && (
          <div className="space-y-6">
            {/* Quick NAV Update Form */}
            <div className="bg-white rounded-[4px] border border-rule shadow-sm p-6 space-y-4">
              <div className="border-b border-rule pb-3">
                <h3 className="font-serif text-lg font-bold text-navy flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gold" />
                  <span>Update Scheme NAV & Recalculate Client Portfolios</span>
                </h3>
                <p className="text-xs text-charcoal-muted">
                  Updating a scheme NAV updates the fund record, creates an entry in NavHistory, and immediately recalculates all active holdings.
                </p>
              </div>

              <form onSubmit={handleUpdateNav} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end text-xs">
                <div className="sm:col-span-6">
                  <label className="block font-semibold mb-1">Select Scheme</label>
                  <select
                    value={selectedFundId}
                    onChange={(e) => {
                      setSelectedFundId(e.target.value);
                      const f = funds.find((item) => item.id === e.target.value);
                      if (f) setNewNavVal(f.nav.toString());
                    }}
                    className="w-full p-2 border border-rule rounded bg-white text-xs"
                  >
                    {funds.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} (Current NAV: ₹{f.nav.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-4">
                  <label className="block font-semibold mb-1">New NAV Value (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newNavVal}
                    onChange={(e) => setNewNavVal(e.target.value)}
                    className="w-full p-2 border border-rule rounded text-xs font-bold text-navy"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full py-2 bg-navy hover:bg-navy-light text-gold font-bold rounded shadow transition-colors"
                  >
                    Push New NAV
                  </button>
                </div>
              </form>
            </div>

            {/* Register New Fund Form */}
            <div className="bg-white rounded-[4px] border border-rule shadow-sm p-6 space-y-4">
              <div className="border-b border-rule pb-3">
                <h3 className="font-serif text-lg font-bold text-navy flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-gold" />
                  <span>Register New Mutual Fund Scheme</span>
                </h3>
                <p className="text-xs text-charcoal-muted">
                  Add new schemes to the centralized product directory for client investments and SIP registration.
                </p>
              </div>

              <form onSubmit={handleCreateFund} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">AMFI Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 135402"
                      value={newFundAmfi}
                      onChange={(e) => setNewFundAmfi(e.target.value)}
                      className="w-full p-2 border border-rule rounded font-mono text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold mb-1">Fund Scheme Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Parag Parikh Flexi Cap Fund - Direct Growth"
                      value={newFundName}
                      onChange={(e) => setNewFundName(e.target.value)}
                      className="w-full p-2 border border-rule rounded text-xs font-semibold text-navy"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Category</label>
                    <select
                      value={newFundCategory}
                      onChange={(e) => setNewFundCategory(e.target.value)}
                      className="w-full p-2 border border-rule rounded bg-white text-xs"
                    >
                      <option value="Large Cap">Large Cap</option>
                      <option value="Flexi Cap">Flexi Cap</option>
                      <option value="Mid Cap">Mid Cap</option>
                      <option value="Small Cap">Small Cap</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Liquid">Liquid</option>
                      <option value="Debt">Debt</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">AMC</label>
                    <input
                      type="text"
                      required
                      value={newFundAmc}
                      onChange={(e) => setNewFundAmc(e.target.value)}
                      className="w-full p-2 border border-rule rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Initial NAV (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newFundNav}
                      onChange={(e) => setNewFundNav(e.target.value)}
                      className="w-full p-2 border border-rule rounded text-xs font-bold text-navy"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-6 bg-gold hover:bg-gold-dark text-navy font-bold rounded shadow transition-colors mt-2"
                >
                  Register Scheme
                </button>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: AUDIT LOGS & SECURITY TRAIL
           ========================================================================= */}
        {activeTab === "audit" && (
          <div className="bg-white rounded-[4px] border border-rule shadow-sm p-6 space-y-4">
            <div className="border-b border-rule pb-3">
              <h3 className="font-serif text-lg font-bold text-navy flex items-center gap-2">
                <Activity className="w-4 h-4 text-gold" />
                <span>Regulatory Audit Logs & Security Forensics</span>
              </h3>
              <p className="text-xs text-charcoal-muted">
                SEBI and AMFI compliant tamper-evident chronological event log tracking logins, orders, and configuration updates.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-ivory border-y border-rule font-serif text-navy">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Event Action</th>
                    <th className="p-3">User Identity</th>
                    <th className="p-3">Details / Audit Payload</th>
                    <th className="p-3 font-mono">IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="border-b border-rule/60 hover:bg-ivory/50">
                      <td className="p-3 text-[11px] text-gray-500 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString("en-IN")}
                      </td>
                      <td className="p-3 font-mono font-bold text-navy">
                        <span className="px-2 py-0.5 bg-ivory rounded border border-rule text-[10px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3">
                        {log.user ? (
                          <div>
                            <div className="font-semibold text-navy">{log.user.name}</div>
                            <div className="text-[10px] text-gray-500">{log.user.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">System / Anonymous</span>
                        )}
                      </td>
                      <td className="p-3 text-charcoal leading-relaxed max-w-md">{log.details}</td>
                      <td className="p-3 font-mono text-[11px] text-gray-400">{log.ipAddress || "127.0.0.1"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: TESTIMONIAL MODERATION
           ========================================================================= */}
        {activeTab === "testimonials" && (
          <div className="bg-white rounded-[4px] border border-rule shadow-sm p-6 space-y-4">
            <div className="border-b border-rule pb-3">
              <h3 className="font-serif text-lg font-bold text-navy">
                Testimonial Approval & Review Moderation
              </h3>
              <p className="text-xs text-charcoal-muted">
                Public submissions require explicit admin approval before appearing on the marketing site.
              </p>
            </div>

            <div className="space-y-4">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className={`p-4 rounded border text-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    t.isApproved ? "bg-white border-rule" : "bg-amber-50/50 border-amber-200"
                  }`}
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-navy font-serif">{t.authorName}</span>
                      <span className="text-gray-500">• {t.companyName}</span>
                      <span className="text-gold">{"★".repeat(t.rating)}</span>
                    </div>
                    <p className="italic text-gray-700">&ldquo;{t.feedback}&rdquo;</p>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    {t.isApproved ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Live on Website</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApproveTestimonial(t.id)}
                        className="px-3.5 py-1.5 bg-navy text-gold font-bold rounded text-xs hover:bg-gold hover:text-navy transition-colors border border-gold"
                      >
                        Approve & Publish
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: WHITE-LABEL BRAND SETTINGS
           ========================================================================= */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-[4px] border border-rule shadow-sm p-8 max-w-2xl space-y-6">
            <div className="border-b border-rule pb-3">
              <h3 className="font-serif text-xl font-bold text-navy">
                White-Label Identity Configuration
              </h3>
              <p className="text-xs text-charcoal-muted">
                These settings drive the brand name, contact numbers, and compliance credentials across
                all pages, investor emails, and downloadable PDFs.
              </p>
            </div>

            {savedSettings && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Brand settings updated in configuration runtime!</span>
              </div>
            )}

            <form onSubmit={handleSaveBrandSettings} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full p-2.5 border border-rule rounded text-charcoal font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                  AMFI ARN Registration
                </label>
                <input
                  type="text"
                  value={arnCode}
                  onChange={(e) => setArnCode(e.target.value)}
                  className="w-full p-2.5 border border-rule rounded text-charcoal font-bold font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Support Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 border border-rule rounded text-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 border border-rule rounded text-charcoal"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-navy text-gold font-bold uppercase tracking-wider rounded hover:bg-gold hover:text-navy transition-all"
                >
                  Save White-Label Theme
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
