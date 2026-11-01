/**
 * Portfolio Pro - Trading & Platform Environment Flags
 * Manages Stage 1 (Showcase Preview) vs Stage 2 (Live Real-Money Trading)
 */

export const TRADING_CONFIG = {
  // Global flag: FALSE for Stage 1 (Showcase Preview), TRUE for Stage 2 (Live Broker Rails)
  isLiveTradingEnabled: process.env.NEXT_PUBLIC_LIVE_TRADING_ENABLED === "true",

  // AMFI & Regulatory credentials (configurable via env without code changes)
  amfiArn: process.env.NEXT_PUBLIC_AMFI_ARN || "",
  amfiEuin: process.env.NEXT_PUBLIC_AMFI_EUIN || "",
  bseMemberCode: process.env.NEXT_PUBLIC_BSE_MEMBER_CODE || "",
  nseBrokerCode: process.env.NEXT_PUBLIC_NSE_BROKER_CODE || "",

  // Gateways mode: 'sandbox' | 'production'
  bseNseMode: (process.env.BSE_NSE_MODE || "sandbox") as "sandbox" | "production",
  paymentGatewayMode: (process.env.PAYMENT_GATEWAY_MODE || "sandbox") as "sandbox" | "production",

  // Showcase private demo password
  demoPassword: process.env.DEMO_ACCESS_PASSWORD || "demomode2026",

  // Mandatory Regulatory Messages
  previewBannerText: "Demo / Preview Mode: No real financial transactions are processed. For distributor onboarding and client servicing, contact +91 97245 85704.",
  tradingDisabledNotice: "Online investing is coming soon. Please contact your registered distributor at +91 97245 85704 or submit an inquiry to invest offline.",
  statutoryRiskDisclaimer: "Mutual fund investments are subject to market risks, read all scheme related documents carefully.",
};

export function isLiveTradingEnabled(): boolean {
  return TRADING_CONFIG.isLiveTradingEnabled;
}

export function getAmfiArnDisplay(): string {
  if (TRADING_CONFIG.amfiArn && TRADING_CONFIG.amfiArn.trim() !== "") {
    return TRADING_CONFIG.amfiArn;
  }
  return "ARN Pending Activation";
}

export function getComplianceTextDisplay(): string {
  const arn = getAmfiArnDisplay();
  const euin = TRADING_CONFIG.amfiEuin ? ` | EUIN: ${TRADING_CONFIG.amfiEuin}` : "";
  return `AMFI-Registered Mutual Fund Distributor | ${arn}${euin}`;
}

