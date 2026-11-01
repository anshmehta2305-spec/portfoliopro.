"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, TrendingUp, Sparkles, ArrowUpDown, Shield } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface FundItem {
  id: string;
  amfiCode: string;
  name: string;
  category: string;
  amc: string;
  nav: number;
  navDate: string;
  oneYearReturn: number;
  threeYearReturn: number;
  fiveYearReturn: number;
  expenseRatio: number;
  aumCrores: number;
  riskLevel: string;
}

export default function FundExplorerPage() {
  const [funds, setFunds] = useState<FundItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedRisk, setSelectedRisk] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFunds() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (selectedCategory !== "ALL") params.append("category", selectedCategory);
        if (selectedRisk !== "ALL") params.append("risk", selectedRisk);

        const res = await fetch(`/api/funds?${params.toString()}`);
        const data = await res.json();
        if (data.funds) {
          setFunds(data.funds);
        }
      } catch (err) {
        console.error("Failed to load funds:", err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadFunds, 200);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedRisk]);

  const categories = ["ALL", "Large Cap", "Small Cap", "Flexi Cap", "Large & Mid Cap", "Hybrid", "Liquid"];
  const riskLevels = ["ALL", "Low", "Moderate", "Very High"];

  return (
    <div>
      <div className="bg-navy text-white py-16 border-b border-gold text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="px-3 py-1 bg-navy-light text-gold border border-gold/40 rounded text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>AMFI Daily NAV Integration</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold">
            Mutual Fund Scheme Explorer & Returns
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Filter across scheme categories, verify historic 1Y, 3Y, and 5Y CAGR returns, and inspect
            expense ratios across top Indian Asset Management Companies.
          </p>
        </div>
      </div>

      <Section background="ivory" withOrnament>
        {/* Search & Filter Bar */}
        <div className="bg-white p-6 rounded-[3px] border border-rule shadow-sm space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by scheme name, AMFI code (e.g. 119551), or AMC..."
                className="w-full pl-10 pr-4 py-2.5 text-xs border border-rule rounded focus:outline-none focus:border-gold text-charcoal bg-ivory/30"
              />
            </div>

            {/* Risk filter */}
            <div className="md:col-span-6 flex items-center justify-end gap-2 text-xs">
              <span className="text-charcoal-muted font-semibold flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-gold" /> Risk Level:
              </span>
              <div className="flex gap-1">
                {riskLevels.map((risk) => (
                  <button
                    key={risk}
                    onClick={() => setSelectedRisk(risk)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors ${
                      selectedRisk === risk
                        ? "bg-navy text-gold font-bold"
                        : "bg-ivory text-charcoal hover:bg-gray-200"
                    }`}
                  >
                    {risk}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-rule/60 text-xs">
            <span className="text-charcoal-muted font-semibold mr-2 shrink-0">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded whitespace-nowrap text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-gold text-navy font-bold shadow-sm"
                    : "bg-ivory text-charcoal hover:bg-ivory-dark"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded border border-rule overflow-x-auto shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-xs text-charcoal-muted">
              Loading mutual fund schemes...
            </div>
          ) : funds.length === 0 ? (
            <div className="p-12 text-center text-xs text-charcoal-muted">
              No matching funds found. Try adjusting your search query.
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-navy text-white font-serif">
                  <th className="p-3.5">Scheme Details</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5 text-right">Latest NAV</th>
                  <th className="p-3.5 text-right">1Y Return</th>
                  <th className="p-3.5 text-right">3Y CAGR</th>
                  <th className="p-3.5 text-right">5Y CAGR</th>
                  <th className="p-3.5 text-center">Risk Level</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {funds.map((f) => (
                  <tr
                    key={f.id}
                    className="border-b border-rule/60 hover:bg-ivory/50 transition-colors"
                  >
                    <td className="p-3.5 font-sans">
                      <div className="font-bold text-navy text-xs">{f.name}</div>
                      <div className="text-[11px] text-gray-500">
                        {f.amc} • Code: {f.amfiCode} • AUM: ₹{f.aumCrores.toLocaleString()} Cr
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 bg-ivory text-charcoal text-[11px] rounded border border-rule">
                        {f.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-bold text-navy font-sans">
                      ₹{f.nav.toFixed(2)}
                      <div className="text-[10px] text-gray-400 font-normal">{f.navDate}</div>
                    </td>
                    <td className="p-3.5 text-right font-bold text-emerald-700">
                      +{f.oneYearReturn}%
                    </td>
                    <td className="p-3.5 text-right font-bold text-emerald-700">
                      +{f.threeYearReturn}%
                    </td>
                    <td className="p-3.5 text-right font-bold text-emerald-700">
                      +{f.fiveYearReturn}%
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          f.riskLevel === "Very High"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : f.riskLevel === "Moderate"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {f.riskLevel}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link
                          href={`/fund-explorer/${f.id}`}
                          className="px-2.5 py-1 bg-navy text-gold text-xs font-semibold rounded hover:bg-navy-light transition-colors whitespace-nowrap"
                        >
                          View / Invest
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Section>
    </div>
  );
}

