export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number; // discounted rate per year
  isPopular?: boolean;
  idealFor: string;
  ctaText: string;
  features: string[];
}

export interface PricingComparisonCategory {
  category: string;
  features: {
    name: string;
    starter: boolean | string;
    professional: boolean | string;
    enterprise: boolean | string;
  }[];
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter MFD",
    tagline: "Designed for solo IFAs and emerging distributors establishing their digital presence.",
    monthlyPrice: 2499,
    yearlyPrice: 24990, // ~2 months free
    idealFor: "Up to ₹25 Cr AUM | 1-300 Active Investors",
    ctaText: "Start with Starter",
    features: [
      "Up to 300 Active Investors",
      "White-Label Web Portal with Custom Logo",
      "BSE StarMF & NSE NMF II Integration",
      "Automated CAS Import (CAMS & KFintech)",
      "Standard Capital Gain & Portfolio Reports",
      "Basic Email Campaigns & Birthday Wishes",
      "Standard SSL & Cloud Daily Backup",
      "Email & Chat Support (24h SLA)",
    ],
  },
  {
    id: "professional",
    name: "Professional Advisor",
    tagline: "The complete platform for high-velocity distributors and growing advisory teams.",
    monthlyPrice: 5999,
    yearlyPrice: 59990,
    isPopular: true,
    idealFor: "₹25 Cr to ₹150 Cr AUM | Up to 1,500 Investors",
    ctaText: "Upgrade to Professional",
    features: [
      "Up to 1,500 Active Investors",
      "White-Label Web Portal + Branded Android & iOS Apps",
      "Direct 2-way BSE StarMF & NSE NMF Execution",
      "Robo Advisory & Model Portfolio Rebalancing Engine",
      "Digital Video KYC & Instant e-Sign Onboarding",
      "CRM Pipeline with Automated WhatsApp Bot Reminders",
      "40+ Advanced Visual Client Reports & Solvency Charts",
      "Multi-User Access (Up to 5 Relationship Managers)",
      "Priority Phone & Dedicated RM Support (4h SLA)",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Wealth Firm",
    tagline: "Full-spectrum wealth tech infrastructure for national brokerages and corporate ARNs.",
    monthlyPrice: 14999,
    yearlyPrice: 149990,
    idealFor: "> ₹150 Cr AUM | Unlimited Investors & Teams",
    ctaText: "Talk to Enterprise Team",
    features: [
      "Unlimited Active Investors & Folios",
      "Custom Domain, Full White-Labeling & Custom App Splash",
      "Multi-Tier Hierarchy: Admin, Sub-Brokers, Branches, RMs",
      "Automated Trail Brokerage Reconciliation & Broker Invoicing",
      "Multi-Asset Integration: MF, PMS, AIF, Stocks, FDs, Bonds, NPS",
      "Custom API Webhooks & ERP Accounting Sync",
      "Dedicated Cloud Instance with 99.99% SLA Guarantee",
      "Dedicated Key Account Manager & 24/7 VIP Hotline",
    ],
  },
];

export const pricingComparison: PricingComparisonCategory[] = [
  {
    category: "Client Capacity & Infrastructure",
    features: [
      { name: "Active Investor Accounts", starter: "Up to 300", professional: "Up to 1,500", enterprise: "Unlimited" },
      { name: "White-Label Web Portal", starter: true, professional: true, enterprise: true },
      { name: "Branded Android & iOS Mobile Apps", starter: false, professional: true, enterprise: true },
      { name: "Custom Domain (e.g. portal.yourfirm.com)", starter: false, professional: "Optional Add-on", enterprise: true },
      { name: "Cloud Daily Backups & Disaster Recovery", starter: true, professional: true, enterprise: "Dedicated Cluster" },
    ],
  },
  {
    category: "Transaction & Execution Rails",
    features: [
      { name: "BSE StarMF Gateway Integration", starter: true, professional: true, enterprise: true },
      { name: "NSE NMF II Gateway Integration", starter: true, professional: true, enterprise: true },
      { name: "e-Mandate & UPI AutoPay Setup", starter: true, professional: true, enterprise: true },
      { name: "Direct Client Payment Links via WhatsApp", starter: false, professional: true, enterprise: true },
      { name: "Bulk Rebalance Order Routing", starter: false, professional: true, enterprise: true },
    ],
  },
  {
    category: "Multi-Asset & Reporting",
    features: [
      { name: "Mutual Fund Portfolio Tracking", starter: true, professional: true, enterprise: true },
      { name: "Direct Equity, SGB, NPS & Fixed Deposits", starter: "Basic", professional: true, enterprise: true },
      { name: "PMS & AIF Consolidated Dossiers", starter: false, professional: false, enterprise: true },
      { name: "Grandfathered Capital Gains (12.5% LTCG / 20% STCG)", starter: true, professional: true, enterprise: true },
      { name: "Portfolio Overlap & Concentration Audit", starter: false, professional: true, enterprise: true },
    ],
  },
  {
    category: "Automation & Operations",
    features: [
      { name: "Automated CAS / RTA Mailback Sync", starter: true, professional: true, enterprise: true },
      { name: "Trail Brokerage Reconciliation", starter: false, professional: "Standard", enterprise: "Advanced Multi-Tier" },
      { name: "Sub-Broker & RM Revenue Splitting", starter: false, professional: false, enterprise: true },
      { name: "Official WhatsApp Cloud API Automation", starter: false, professional: true, enterprise: true },
      { name: "Robo-Advisory Model Portfolios", starter: false, professional: true, enterprise: true },
    ],
  },
  {
    category: "User Hierarchy & Support",
    features: [
      { name: "User Seats (Staff / RMs)", starter: "1 Admin", professional: "Up to 5 RMs", enterprise: "Unlimited RMs & Branches" },
      { name: "Branch & Sub-Broker Segregated Views", starter: false, professional: false, enterprise: true },
      { name: "Audit Trail & Compliance Logging", starter: "30 Days", professional: "1 Year", enterprise: "7 Years (SEBI Standard)" },
      { name: "Support Channels", starter: "Email (24h)", professional: "Priority Phone (4h)", enterprise: "Dedicated Account Mgr (1h)" },
    ],
  },
];

