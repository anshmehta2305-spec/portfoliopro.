import React from "react";
import { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Users2, MessageSquare, Bell, Calendar, Sparkles, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Distributor CRM | Portfolio Pro",
  description:
    "Automate lead pipelines, SIP upcoming due alerts, birthday greetings, and tax-saving campaigns directly through official WhatsApp Cloud API.",
};

export default function CrmPage() {
  return (
    <div>
      <div className="bg-navy text-white py-16 border-b border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3 py-1 bg-navy-light text-gold border border-gold/40 rounded text-xs font-semibold uppercase tracking-wider">
            Client Lifecycle Management
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold">
            Distributor CRM & WhatsApp Automation
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Never lose a lead or forget a milestone. Automate pre-due SIP balance reminders, birthday
            wishes, and tax-saving nudges with verified WhatsApp messaging.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Button variant="gold" href="/book-demo">
              Schedule CRM Walkthrough
            </Button>
            <Button variant="secondary" href="/pricing" className="text-white border-gold hover:bg-gold/10">
              View CRM Plans
            </Button>
          </div>
        </div>
      </div>

      <Section background="ivory" withOrnament>
        <Heading
          badge="Advisory Automation"
          title="Turn Prospective Inquiries into Lifetime Portfolios"
          subtitle="Track prospective investors across visual Kanban pipelines from initial inquiry to won account."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="space-y-3">
            <div className="w-10 h-10 rounded bg-navy text-gold flex items-center justify-center">
              <Users2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-navy">Visual Sales Pipeline</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Track leads through New &gt; Contacted &gt; Demo Scheduled &gt; Won/Lost stages. Assign
              tasks and meeting logs to specific Relationship Managers.
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="w-10 h-10 rounded bg-navy text-gold flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-navy">Official WhatsApp Bot</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Send interactive WhatsApp messages with verified green tick sender identity. Clients can
              approve top-up investments with one tap.
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="w-10 h-10 rounded bg-navy text-gold flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-navy">Automated SIP Pre-Due Alerts</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Send courteous balance reminders 3 days prior to mandate deduction dates, reducing SIP
              dishonor and bounce rates by up to 75%.
            </p>
          </Card>
        </div>
      </Section>
    </div>
  );
}

