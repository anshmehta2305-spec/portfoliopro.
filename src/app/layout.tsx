import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { LiveChatWidget } from "@/components/chat/LiveChatWidget";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://portfoliopro.in"),
  title: {
    default: "Portfolio Pro | White-Label Mutual Fund Software & Wealth Tech for MFDs",
    template: "%s | Portfolio Pro",
  },
  description:
    "Empower your advisory firm with Portfolio Pro. White-labeled investor mobile app & portal, BSE StarMF & NSE NMF transaction execution, CAS mailback reconciliation, and robo-advisory rebalancing for Indian MFDs & IFAs.",
  keywords: [
    "white label mutual fund software",
    "MFD software India",
    "IFA wealth management platform",
    "BSE StarMF integration",
    "NSE NMF II mobile app",
    "CAS mailback reconciliation",
    "mutual fund distributor software",
    "Robo advisory India",
    "AMFI compliant financial website",
  ],
  authors: [{ name: "Portfolio Pro Technologies" }],
  icons: {
    icon: "/brand/emblem.svg",
    apple: "/brand/emblem.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://portfoliopro.in",
    title: "Portfolio Pro | White-Label Wealth Management Platform for MFDs",
    description: "Bank-grade white-label software for Mutual Fund Distributors and IFAs in India.",
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio Pro | White-Label Wealth Tech for MFDs",
    description: "Invest Smarter. Grow Together. The complete multi-asset platform for Indian financial distributors.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.companyName,
    url: "https://portfoliopro.in",
    logo: "https://portfoliopro.in/brand/emblem.svg",
    description: "Institutional white-label mutual fund software and wealth management platform for MFDs and IFAs.",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressLocality: "Bharuch",
      addressRegion: "Gujarat",
      postalCode: "392001",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      contactType: "Customer Support",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.twitter,
      siteConfig.social.youtube,
    ],
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-ivory text-charcoal font-sans antialiased selection:bg-gold selection:text-white">
        <LanguageProvider>
          <UtilityBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieBanner />
          <LiveChatWidget />
        </LanguageProvider>
      </body>
    </html>
  );
}

