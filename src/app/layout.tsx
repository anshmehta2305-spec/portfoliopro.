import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { PreviewModeBanner } from "@/components/layout/PreviewModeBanner";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { LiveChatWidget } from "@/components/chat/LiveChatWidget";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://portfoliopro.in"),
  title: {
    default: "Portfolio Pro | Invest Smarter. Grow Together.",
    template: "%s",
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
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://portfoliopro.in",
    title: "Portfolio Pro | Invest Smarter. Grow Together.",
    description: "Bank-grade white-label software and client portal for Mutual Fund Distributors and IFAs in India.",
    siteName: "Portfolio Pro",
    images: [
      {
        url: "/brand/logo.png",
        width: 1200,
        height: 630,
        alt: "Portfolio Pro - Wealth Tech Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio Pro | Invest Smarter. Grow Together.",
    description: "Bank-grade white-label software and client portal for Mutual Fund Distributors and IFAs in India.",
    images: ["/brand/logo.png"],
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
        <meta name="theme-color" content="#1D5FB5" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-ivory text-charcoal font-sans antialiased selection:bg-gold selection:text-white">
        <LanguageProvider>
          <PreviewModeBanner />
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

