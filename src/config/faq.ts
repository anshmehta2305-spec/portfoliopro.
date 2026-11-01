export interface FAQItem {
  question: string;
  answer: string;
  category: "General" | "Transactions" | "Data & Security" | "Pricing & Migration";
}

export const faqs: FAQItem[] = [
  {
    category: "General",
    question: "What is Portfolio Pro and who is it built for?",
    answer: "Portfolio Pro is an institutional-grade, white-label SaaS platform built specifically for Mutual Fund Distributors (MFDs), Independent Financial Advisors (IFAs), and wealth management firms in India. It empowers you to give your clients a bank-grade mobile app and web portal branded with your firm's name, logo, and colors, while providing you with back-office automation, BSE/NSE transaction execution, and comprehensive CRM tools.",
  },
  {
    category: "General",
    question: "Can I use my own logo, company name, and custom website domain?",
    answer: "Yes, 100%. Portfolio Pro is completely white-labeled. Your investors will only see your firm's branding, logo, and colors across the mobile applications (Android and iOS), web portal, email notifications, and downloadable PDF reports. On the Professional and Enterprise plans, you can host the investor portal under your own custom domain (e.g., portal.yourwealthadvisory.com).",
  },
  {
    category: "Transactions",
    question: "How does order execution work with BSE StarMF and NSE NMF II?",
    answer: "Portfolio Pro provides certified 2-way adapter integrations with both BSE StarMF and NSE NMF II. When an order (Lumpsum, SIP, STP, SWP, or Switch) is placed either by you or requested by the investor, an instant payment link or approval request is dispatched to the client via WhatsApp, SMS, and Email. Once approved via UPI AutoPay, NetBanking, or e-Mandate, units are allotted and reconciled automatically.",
  },
  {
    category: "Transactions",
    question: "Can investors set up paperless e-Mandates directly from the app?",
    answer: "Yes. Our platform integrates directly with NPCI e-Mandate rails. Investors can authenticate their bank account and establish recurring SIP mandates in under 60 seconds using Debit Card or NetBanking credentials without physical paperwork or courier delays.",
  },
  {
    category: "Data & Security",
    question: "How do you handle CAMS and KFintech data synchronization?",
    answer: "Portfolio Pro features an automated mailback ingestion engine. You can configure your CAMS and KFintech distributor logins to email daily transaction feeds (WBR2, WBR9, WBR49) directly to your secure Portfolio Pro ingestion mailbox. The system parses these files overnight and reconciles all off-platform and on-platform client folios before 8:00 AM every business day.",
  },
  {
    category: "Data & Security",
    question: "Is client financial data secure and compliant with SEBI guidelines?",
    answer: "We treat data privacy and security with bank-grade rigor. All data in transit is encrypted using TLS 1.3 with 256-bit AES encryption at rest. Databases are hosted in Tier-4 MEITY-empanelled data centers physically located within India. We adhere strictly to AMFI and SEBI cybersecurity circulars with role-based access control, session timeouts, and immutable audit logs.",
  },
  {
    category: "Pricing & Migration",
    question: "Can I migrate historical portfolio data from my existing software?",
    answer: "Yes. Our dedicated onboarding team provides end-to-end data migration assistance from legacy software (such as Wealth Elite, Investwell, AssetPlus, or custom Excel sheets). By uploading your consolidated CAMS & KFintech CAS mailback files, your clients' historical purchase dates, NAVs, and units will be seamlessly reconstructed with accurate XIRR and capital gains records.",
  },
  {
    category: "Pricing & Migration",
    question: "Are there any hidden transaction fees or commissions taken on AUM?",
    answer: "Never. Portfolio Pro operates strictly on a predictable software subscription model. We do not deduct any percentage from your AUM, trail commissions, or transaction volumes. 100% of your AMC brokerage and trail revenues remain exclusively yours.",
  },
];

