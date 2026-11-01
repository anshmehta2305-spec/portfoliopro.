import React from "react";
import { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { Briefcase, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers & Engineering Openings | Portfolio Pro",
  description: "Join Portfolio Pro in Mumbai and Bengaluru as we engineer the infrastructure powering India's wealth management industry.",
};

export default function CareersPage() {
  const openings = [
    {
      title: "Senior Full-Stack Engineer (Next.js / Node.js)",
      team: "Platform Core",
      location: "Bharuch / Hybrid",
      exp: "4-7 Years",
      desc: "Architect resilient high-frequency order routing gateways connecting to BSE StarMF and NSE NMF II.",
    },
    {
      title: "Wealth Domain Product Manager",
      team: "Advisory Desk",
      location: "Bharuch / Remote",
      exp: "5+ Years",
      desc: "Drive our multi-asset reporting suite, trail brokerage reconciliation, and robo-advisory engines.",
    },
    {
      title: "Solutions Architect & Client Onboarding Lead",
      team: "Customer Success",
      location: "Bengaluru / Pune",
      exp: "3-5 Years",
      desc: "Work with premier IFAs and corporate ARN desks to migrate historical CAMS & KFintech databases seamlessly.",
    },
  ];

  return (
    <div>
      <div className="bg-navy text-white py-16 border-b border-gold text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="px-3 py-1 bg-navy-light text-gold border border-gold/40 rounded text-xs font-semibold uppercase tracking-wider">
            Join Our Team
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold">
            Build the Rails of India&apos;s Financial Future
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            We are looking for engineers, financial analysts, and customer champions passionate about
            transforming how millions of Indians invest.
          </p>
        </div>
      </div>

      <Section background="ivory" withOrnament>
        <div className="max-w-4xl mx-auto space-y-6">
          <h3 className="font-serif text-2xl font-bold text-navy mb-4">Current Open Positions</h3>

          <div className="space-y-4">
            {openings.map((job, idx) => (
              <Card key={idx} hoverEffect className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-navy text-gold px-2 py-0.5 rounded">
                      {job.team}
                    </span>
                    <span className="text-xs text-gray-500">• {job.location} • {job.exp}</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-navy">{job.title}</h4>
                  <p className="text-xs text-charcoal-muted leading-relaxed">{job.desc}</p>
                </div>

                <div className="shrink-0">
                  <a
                    href={`mailto:${siteConfig.email}?subject=Application for ${job.title}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-blue text-white text-xs font-bold rounded hover:bg-navy transition-all"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}

