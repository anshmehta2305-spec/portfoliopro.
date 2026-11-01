import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Smartphone,
  Repeat,
  FileSpreadsheet,
  Coins,
  Bot,
  Users2,
  Lock,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { HeroCallbackForm } from "@/components/home/HeroCallbackForm";
import { PhoneMockup } from "@/components/home/PhoneMockup";
import { siteConfig } from "@/config/site";
import { featuresList } from "@/config/features";
import { faqs } from "@/config/faq";
import { db } from "@/lib/db";

export default async function HomePage() {
  // Fetch real blog posts and approved testimonials from database
  const blogPosts = await db.blogPost.findMany({
    where: { isPublished: true },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  const testimonials = await db.testimonial.findMany({
    where: { isApproved: true },
    take: 3,
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION WITH REQUEST A CALL BACK FORM */}
      <section className="relative bg-navy text-white pt-14 pb-20 md:pt-20 md:pb-28 overflow-hidden border-b-[3px] border-gold">
        {/* Subtle decorative gold line watermark */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#B08D57" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline, Value Proposition, Trust Badges (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-navy-light/90 border border-gold/40 rounded-[2px] text-xs font-semibold text-gold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>White-Label B2B Platform for MFDs & IFAs</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-white leading-[1.15] tracking-tight">
                Empower Your Advisory Firm with{" "}
                <span className="text-gold italic underline decoration-gold/50 underline-offset-4">
                  Institutional Wealth Tech
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-200 font-sans leading-relaxed max-w-2xl">
                Deliver a bank-grade mobile app and client portal under your own firm&apos;s name and
                logo. Automate 2-way BSE StarMF & NSE NMF order routing, CAS mailback reconciliation,
                and sub-broker trail commission distribution.
              </p>

              {/* Value checkmarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                  <span>100% White-Labeled (Your Logo, Your Domain)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                  <span>Instant e-Mandates & Video KYC Onboarding</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                  <span>Direct BSE StarMF & NSE NMF Execution Rails</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                  <span>Automated CAMS & KFintech CAS Reconciliation</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Button variant="gold" size="lg" href="/book-demo">
                  Schedule Live 1-on-1 Demo
                </Button>
                <Button variant="secondary" size="lg" href="/features" className="text-white border-gold hover:bg-gold/15">
                  Explore 12 Features
                </Button>
              </div>

              {/* AMFI Statutory Assurance */}
              <div className="pt-4 flex items-center gap-3 text-xs text-gray-400 border-t border-navy-light/60">
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span>Zero AUM cuts • Flat subscription pricing • ISO 27001 Certified Security</span>
              </div>
            </div>

            {/* Right Column: Hero Side "Request a Call Back" Form (5 cols) */}
            <div className="lg:col-span-5">
              <HeroCallbackForm />
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP & CLIENT STATS */}
      <div className="bg-white border-b border-rule py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-rule">
            <div className="p-3">
              <div className="font-serif text-2xl sm:text-3xl font-bold text-navy">₹18,500+ Cr</div>
              <div className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mt-1">
                AUM Monitored Daily
              </div>
            </div>
            <div className="p-3">
              <div className="font-serif text-2xl sm:text-3xl font-bold text-brand-blue">2,400+</div>
              <div className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mt-1">
                Active MFDs & IFAs
              </div>
            </div>
            <div className="p-3">
              <div className="font-serif text-2xl sm:text-3xl font-bold text-navy">4.8 Lakh+</div>
              <div className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mt-1">
                Monthly SIP Orders
              </div>
            </div>
            <div className="p-3">
              <div className="font-serif text-2xl sm:text-3xl font-bold text-gold-dark">99.99%</div>
              <div className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mt-1">
                Platform SLA Uptime
              </div>
            </div>
          </div>

          {/* Institutional Partner Rails Placeholder */}
          <div className="mt-8 pt-6 border-t border-rule/60 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-semibold uppercase tracking-wider text-charcoal-soft">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" /> BSE StarMF Gateway
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" /> NSE NMF II Engine
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" /> CAMS Auto-Mailback
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" /> KFintech Integrated
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" /> NPCI e-Mandate
            </span>
          </div>
        </div>
      </div>

      {/* 3. CORE FEATURE HIGHLIGHTS */}
      <Section background="ivory" withOrnament>
        <Heading
          badge="Enterprise Capabilities"
          title="Engineered Exclusively for India's Elite Wealth Distributors"
          subtitle="A unified operating system replacing 6 fragmented desktop tools. Everything you need to scale from ₹10 Crore to ₹500 Crore AUM."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresList.slice(0, 6).map((f) => (
            <Card key={f.id} hoverEffect className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold/15 text-gold-dark border border-gold/30">
                    {f.badge}
                  </span>
                  <div className="w-9 h-9 rounded bg-navy text-gold flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-serif text-lg font-bold text-navy mb-2">{f.title}</h3>
                <p className="text-xs text-charcoal-muted leading-relaxed mb-4">{f.shortDesc}</p>

                <ul className="space-y-1.5 border-t border-rule/60 pt-3 text-xs text-charcoal">
                  {f.capabilities.slice(0, 3).map((cap, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-gold font-bold">✓</span>
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 mt-4 border-t border-rule/50">
                <Link
                  href="/features"
                  className="text-xs font-bold text-brand-blue hover:text-navy inline-flex items-center gap-1 group"
                >
                  <span>Explore Feature Module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="navy" size="lg" href="/features">
            View All 12 Platform Modules & Specifications
          </Button>
        </div>
      </Section>

      {/* 4. HOW IT WORKS IN 4 STEPS */}
      <Section background="white" withOrnament>
        <Heading
          badge="Effortless Onboarding"
          title="How It Works: 4 Simple Steps to Digitization"
          subtitle="Transition your entire advisory operations to the cloud in less than 48 hours without business interruption."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Share Brand Assets",
              desc: "Provide your firm name, logo, brand colors, and domain. We generate your customized staging portal.",
            },
            {
              step: "02",
              title: "Import Historical Folios",
              desc: "Upload consolidated CAMS & KFintech CAS mailback files. Our migration engine auto-constructs investor folios.",
            },
            {
              step: "03",
              title: "Connect BSE / NSE Rails",
              desc: "Enter your MFD member credentials for BSE StarMF and NSE NMF II to enable live multi-asset execution.",
            },
            {
              step: "04",
              title: "Launch Branded Apps",
              desc: "Send personalized app download links to your investors with automated OTP or biometric authentication.",
            },
          ].map((item, idx) => (
            <div key={idx} className="relative p-6 bg-ivory rounded border border-rule text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-navy text-gold font-serif font-bold text-lg rounded-full flex items-center justify-center border-2 border-gold">
                {item.step}
              </div>
              <h4 className="font-serif text-base font-bold text-navy">{item.title}</h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 5. APP SHOWCASE WITH PHONE MOCKUPS */}
      <Section background="navy">
        <Heading
          badge="White-Label Showcase"
          title="Your Own Branded Investor App & Advisor Desk"
          subtitle="Give your clients a polished mobile experience that elevates your advisory brand above generic fintech aggregators."
          align="center"
          theme="dark"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Investor App Showcase */}
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-bold text-gold">The Investor App</h3>
              <p className="text-xs text-gray-300 max-w-sm">
                White-labeled for your clients. Features real-time portfolio valuation, biometric login,
                e-Mandate setup, and Goal GPS tracking.
              </p>
            </div>
            <PhoneMockup appType="investor" appName={siteConfig.name} />
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-navy-light border border-gold/40 rounded text-xs text-gray-300">
                Google Play Store Ready
              </div>
              <div className="px-4 py-2 bg-navy-light border border-gold/40 rounded text-xs text-gray-300">
                Apple App Store Ready
              </div>
            </div>
          </div>

          {/* Advisor Desk Showcase */}
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-bold text-gold">The Advisor CRM Desk</h3>
              <p className="text-xs text-gray-300 max-w-sm">
                Real-time AUM monitoring, upcoming SIP due calendar, BSE/NSE transaction approvals,
                and automated client birthday campaigns.
              </p>
            </div>
            <PhoneMockup appType="advisor" appName={siteConfig.name} />
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-navy-light border border-gold/40 rounded text-xs text-gray-300">
                Multi-RM Role Support
              </div>
              <div className="px-4 py-2 bg-navy-light border border-gold/40 rounded text-xs text-gray-300">
                BSE StarMF Auto-Sync
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 6. WALL OF TESTIMONIALS */}
      <Section background="ivory" withOrnament>
        <Heading
          badge="Client Endorsements"
          title="Trusted by Over 2,400 Financial Advisors Across India"
          subtitle="Discover how independent distributors and corporate advisory desks scale their practice with Portfolio Pro."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card key={t.id} className="flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-gold text-sm">
                  {"★".repeat(t.rating)}
                </div>
                <p className="font-serif italic text-xs text-charcoal leading-relaxed">
                  &ldquo;{t.feedback}&rdquo;
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-rule/60 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-navy font-serif">{t.authorName}</div>
                  <div className="text-[11px] text-charcoal-muted">
                    {t.designation}, {t.companyName}
                  </div>
                </div>
                <span className="text-[10px] text-gold-dark font-semibold bg-gold/15 px-2 py-0.5 rounded">
                  {t.location}
                </span>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/testimonials"
            className="text-xs font-bold text-brand-blue hover:text-navy underline underline-offset-4"
          >
            Read All Client Case Studies & Submit a Review →
          </Link>
        </div>
      </Section>

      {/* 7. LATEST INDUSTRY BLOG INSIGHTS */}
      <Section background="white">
        <Heading
          badge="Knowledge Desk"
          title="Actionable Playbooks for Mutual Fund Distributors"
          subtitle="Stay updated on regulatory AMFI circulars, taxation rules, and modern marketing workflows."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} hoverEffect className="flex flex-col justify-between">
              <div className="space-y-3">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-navy text-gold rounded-[2px]">
                  {post.category}
                </span>
                <h3 className="font-serif text-base font-bold text-navy hover:text-brand-blue leading-snug">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-xs text-charcoal-muted line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-rule/50 flex items-center justify-between text-[11px] text-gray-500">
                <span>{post.readTime}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-bold text-brand-blue hover:text-navy flex items-center gap-1"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* 8. FAQ ACCORDION */}
      <Section background="ivory" withOrnament>
        <Heading
          badge="Common Queries"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about white-labeling, data privacy, and transaction execution."
          align="center"
        />

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.slice(0, 6).map((faq, i) => (
            <div key={i} className="p-5 bg-white rounded border border-rule shadow-sm space-y-2">
              <h4 className="font-serif text-sm font-bold text-navy flex items-center gap-2">
                <span className="text-gold font-sans font-bold">Q.</span>
                <span>{faq.question}</span>
              </h4>
              <p className="text-xs text-charcoal-muted leading-relaxed pl-5 font-sans">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* 9. FINAL CALL TO ACTION */}
      <section className="bg-navy py-16 text-white text-center border-t border-gold relative">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-navy-light border border-gold/40 rounded text-xs text-gold uppercase tracking-wider font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Ready to Elevate Your Distribution Firm?</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">
            Begin Your 14-Day White-Label Onboarding Today
          </h2>
          <p className="text-sm text-gray-300 max-w-xl mx-auto">
            Join 2,400+ leading MFDs who manage over ₹18,500 Crore AUM on Portfolio Pro. No setup
            fees, no transaction commission cuts.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button variant="gold" size="lg" href="/book-demo">
              Schedule Your Private Walkthrough
            </Button>
            <Button variant="secondary" size="lg" href="/pricing" className="text-white border-gold hover:bg-gold/15">
              Compare Subscription Plans
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

