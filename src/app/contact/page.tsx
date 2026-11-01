"use client";

import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, MessageCircle, CheckCircle2, Shield, Loader2 } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/config/site";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [arn, setArn] = useState("");
  const [city, setCity] = useState("");
  const [interestedIn, setInterestedIn] = useState<string[]>([
    "Investor Web & Mobile App",
    "BSE StarMF Execution",
  ]);

  // Math Captcha
  const [captchaNum1, setCaptchaNum1] = useState(7);
  const [captchaNum2, setCaptchaNum2] = useState(6);
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Generate random single-digit numbers for math captcha
    setCaptchaNum1(Math.floor(Math.random() * 8) + 2);
    setCaptchaNum2(Math.floor(Math.random() * 8) + 1);
  }, []);

  const toggleInterest = (item: string) => {
    if (interestedIn.includes(item)) {
      setInterestedIn(interestedIn.filter((i) => i !== item));
    } else {
      setInterestedIn([...interestedIn, item]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !mobile.trim()) {
      setError("Please fill in Name, Email, and Mobile");
      return;
    }

    if (parseInt(captchaAnswer) !== captchaNum1 + captchaNum2) {
      setError(`Security check failed. Please solve: ${captchaNum1} + ${captchaNum2}`);
      return;
    }

    if (interestedIn.length === 0) {
      setError("Please select at least one module you are interested in");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          mobile,
          arn,
          city,
          interestedIn,
          source: "CONTACT_PAGE",
        }),
      });

      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Unable to submit request. Please reach us via direct phone or WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const serviceOptions = [
    "Investor Web & Mobile App",
    "BSE StarMF & NSE NMF II Integration",
    "Robo Advisory & Rebalancing",
    "CAS Auto-Sync & Trail Brokerage",
    "Financial Website for MFD",
    "WhatsApp Automation & CRM",
  ];

  return (
    <div>
      <div className="bg-navy text-white py-16 border-b border-gold text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="px-3 py-1 bg-navy-light text-gold border border-gold/40 rounded text-xs font-semibold uppercase tracking-wider">
            Advisory Engagement Desk
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold">
            Get in Touch with our Wealth Tech Team
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discuss your firm&apos;s migration, white-label app deployment, or schedule a personalized
            walkthrough with a Senior Product Specialist.
          </p>
        </div>
      </div>

      <Section background="ivory" withOrnament>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Touchpoints & Google Map (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="space-y-6 p-6 md:p-8">
              <h3 className="font-serif text-2xl font-bold text-navy">Corporate Headquarters</h3>

              <div className="space-y-4 text-xs text-charcoal">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-navy text-gold flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-navy font-serif text-sm">Main Office:</strong>
                    <span className="text-gray-600 leading-relaxed">
                      {siteConfig.address}, {siteConfig.cityState}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-navy text-gold flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-navy font-serif text-sm">Advisory Hotline:</strong>
                    <a
                      href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
                      className="text-brand-blue hover:underline"
                    >
                      {siteConfig.phone}
                    </a>
                    <div className="text-[11px] text-gray-500">Mon - Sat: 9:30 AM to 6:30 PM IST</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-navy text-gold flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-navy font-serif text-sm">Email Inquiries:</strong>
                    <a href={`mailto:${siteConfig.email}`} className="text-brand-blue hover:underline">
                      {siteConfig.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-[#25D366] text-white flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-navy font-serif text-sm">Instant WhatsApp Desk:</strong>
                    <a
                      href={siteConfig.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 font-semibold hover:underline"
                    >
                      {siteConfig.whatsapp}
                    </a>
                  </div>
                </div>
              </div>

              {/* Google Map Embed Placeholder */}
              <div className="pt-2">
                <div className="w-full h-48 bg-ivory rounded border border-rule flex flex-col items-center justify-center text-center p-4">
                  <MapPin className="w-8 h-8 text-gold mb-1" />
                  <div className="font-serif font-bold text-navy text-xs">
                    {siteConfig.companyName}
                  </div>
                  <div className="text-[10px] text-gray-600 mt-1 max-w-xs leading-relaxed">
                    {siteConfig.address}, {siteConfig.cityState}
                  </div>
                  <a
                    href="https://maps.google.com/?q=233+shaktinagar+shaktinath+gujarat+housing+board+bharuch+392001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-brand-blue font-semibold mt-2 hover:underline inline-flex items-center gap-1"
                  >
                    View on Google Maps →
                  </a>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Contact Form with Captcha (7 cols) */}
          <div className="lg:col-span-7">
            <Card className="p-8 border-2 border-gold/70 shadow-classic">
              <h3 className="font-serif text-2xl font-bold text-navy mb-1">
                Send a Dedicated Inquiry
              </h3>
              <p className="text-xs text-charcoal-muted mb-6">
                Fill in the details below. Our technical architect will review your configuration.
              </p>

              {submitted ? (
                <div className="p-8 bg-emerald-50 border border-emerald-200 rounded text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                  <h4 className="font-serif text-xl font-bold text-emerald-900">
                    Inquiry Successfully Received
                  </h4>
                  <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                    Thank you! A confirmation email and introductory platform dossier have been sent to
                    your email. Our senior consultant will call you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {error && <div className="p-2.5 bg-red-50 text-red-600 rounded">{error}</div>}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="contact-name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name (e.g. Vikramaditya Singhania)"
                        className="w-full p-2.5 border border-rule rounded focus:outline-none focus:border-gold bg-ivory/30 text-charcoal"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                        Official Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="contact-email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Official Email (vikram@advisory.in)"
                        className="w-full p-2.5 border border-rule rounded focus:outline-none focus:border-gold bg-ivory/30 text-charcoal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        id="contact-mobile"
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="Mobile Number (98200 12345)"
                        className="w-full p-2.5 border border-rule rounded focus:outline-none focus:border-gold bg-ivory/30 text-charcoal"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                        AMFI ARN
                      </label>
                      <input
                        type="text"
                        name="arn"
                        id="contact-arn"
                        value={arn}
                        onChange={(e) => setArn(e.target.value)}
                        placeholder="ARN-XXXXXX"
                        className="w-full p-2.5 border border-rule rounded focus:outline-none focus:border-gold bg-ivory/30 text-charcoal uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        id="contact-city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Mumbai"
                        className="w-full p-2.5 border border-rule rounded focus:outline-none focus:border-gold bg-ivory/30 text-charcoal"
                      />
                    </div>
                  </div>

                  {/* Multi-Select Interests */}
                  <div className="pt-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-2">
                      Interested In (Select all that apply):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {serviceOptions.map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-2 p-2 rounded border cursor-pointer text-xs select-none transition-colors ${
                            interestedIn.includes(opt)
                              ? "bg-navy text-gold border-navy font-semibold"
                              : "bg-ivory text-charcoal border-rule hover:bg-ivory-dark"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={interestedIn.includes(opt)}
                            onChange={() => toggleInterest(opt)}
                            className="accent-gold"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Math Captcha Verification */}
                  <div className="pt-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                      Security Verification <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="px-4 py-2 bg-navy text-white rounded font-serif font-bold text-sm tracking-wider border border-gold">
                        {captchaNum1} + {captchaNum2} = ?
                      </div>
                      <input
                        type="number"
                        name="captcha"
                        id="contact-captcha"
                        required
                        value={captchaAnswer}
                        onChange={(e) => setCaptchaAnswer(e.target.value)}
                        placeholder="Answer"
                        className="w-32 p-2.5 border border-rule rounded focus:outline-none focus:border-gold bg-ivory/30 text-charcoal font-bold text-center"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-4 py-3 bg-brand-blue text-white font-bold uppercase tracking-wider rounded shadow-classic hover:bg-navy hover:text-gold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-gold" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <span>Submit Inquiry to Sales Desk</span>
                    )}
                  </button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
}

