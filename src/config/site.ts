export interface SiteConfig {
  name: string;
  tagline: string;
  companyName: string;
  address: string;
  cityState: string;
  email: string;
  salesEmail: string;
  supportEmail: string;
  phone: string;
  whatsapp: string;
  whatsappUrl: string;
  arnNumber: string;
  complianceText: string;
  riskDisclaimer: string;
  navLinks: {
    label: string;
    href: string;
    children?: { label: string; href: string; description?: string }[];
  }[];
  loginRoles: {
    id: string;
    label: string;
    description: string;
    badge: string;
    dashboardPath: string;
  }[];
  social: {
    linkedin: string;
    twitter: string;
    youtube: string;
    facebook: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Portfolio Pro",
  tagline: "Invest Smarter. Grow Together.",
  companyName: "Portfolio Pro Technologies Private Limited",
  address: "233, Shaktinagar, Shaktinath, Gujarat Housing Board",
  cityState: "Bharuch, Gujarat 392001",
  email: "contact@portfoliopro.in",
  salesEmail: "sales@portfoliopro.in",
  supportEmail: "support@portfoliopro.in",
  phone: "+91 (022) 6890-4400",
  whatsapp: "+91 97245 85704",
  whatsappUrl: "https://wa.me/919724585704?text=Hello%20Portfolio%20Pro%20team,%20I%20am%20interested%20in%20the%20white-label%20platform%20demo.",
  arnNumber: "ARN-189420",
  complianceText: "AMFI-registered Mutual Fund Distributor, ARN-189420 | EUIN: E382910 | BSE StarMF Member: 12345 | NSE NMF II Broker: NMF8823",
  riskDisclaimer: "Mutual fund investments are subject to market risks. Read all scheme related documents carefully before investing.",

  navLinks: [
    { label: "Home", href: "/" },
    { label: "Features", href: "/features" },
    {
      label: "Solutions",
      href: "/solutions/investor-app",
      children: [
        { label: "Investor App & Portal", href: "/solutions/investor-app", description: "White-labeled web and mobile app for your retail and HNI investors." },
        { label: "Advisor Desk & Back-Office", href: "/solutions/advisor-app", description: "Comprehensive CRM, brokerage reconciliation & transaction console." },
        { label: "Robo Advisory & Rebalancing", href: "/solutions/robo-advisory", description: "Model portfolios, goal planning GPS, and risk profiling algorithms." },
        { label: "Financial Websites for MFDs", href: "/solutions/financial-websites", description: "SEO-optimized, AMFI-compliant websites for independent distributors." },
        { label: "Distributor CRM & Automation", href: "/solutions/crm", description: "Automated WhatsApp nudges, lead pipeline, and birthday campaigns." },
      ],
    },
    { label: "Pricing", href: "/pricing" },
    { label: "Calculators", href: "/calculators" },
    { label: "Fund Explorer", href: "/fund-explorer" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Pay Online", href: "/pay-online" },
  ],

  loginRoles: [
    {
      id: "INVESTOR",
      label: "Investor Portal",
      description: "Track your family portfolio, view XIRR, and execute orders online.",
      badge: "Clients",
      dashboardPath: "/dashboard/investor",
    },
    {
      id: "ADVISOR",
      label: "IFA / Advisor Desk",
      description: "Manage client folios, monitor SIP book, and view business MIS.",
      badge: "Distributor",
      dashboardPath: "/dashboard/advisor",
    },
    {
      id: "CORPORATE",
      label: "Corporate (ARN)",
      description: "Enterprise group reporting for multi-entity corporate distributors.",
      badge: "Enterprise",
      dashboardPath: "/dashboard/corporate",
    },
    {
      id: "EMPLOYEE",
      label: "Back-office Employee",
      description: "Operations console for CAMS/KFintech reconciliation and service requests.",
      badge: "Operations",
      dashboardPath: "/dashboard/employee",
    },
    {
      id: "SUB_BROKER",
      label: "Sub-broker Portal",
      description: "Mapped investor accounts, brokerage distribution, and sub-broking MIS.",
      badge: "Partner",
      dashboardPath: "/dashboard/sub-broker",
    },
    {
      id: "BRANCH",
      label: "Branch Office",
      description: "Branch-level targets, local RM supervision, and client servicing.",
      badge: "Branch",
      dashboardPath: "/dashboard/branch",
    },
    {
      id: "RM",
      label: "Relationship Manager (RM)",
      description: "Assigned client portfolio reviews, daily meeting notes, and leads.",
      badge: "RM Desk",
      dashboardPath: "/dashboard/rm",
    },
    {
      id: "ADMIN",
      label: "Platform Admin",
      description: "Master console: Manage users, plans, billing, white-label branding.",
      badge: "Super Admin",
      dashboardPath: "/dashboard/admin",
    },
  ],

  social: {
    linkedin: "https://linkedin.com/company/portfoliopro",
    twitter: "https://twitter.com/portfoliopro",
    youtube: "https://youtube.com/@portfoliopro",
    facebook: "https://facebook.com/portfoliopro",
  },
};

