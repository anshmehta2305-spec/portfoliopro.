"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, CheckCircle2, Shield, Video, Sparkles, Loader2 } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function BookDemoPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [arn, setArn] = useState("");

  // Slots
  const dates = [
    { label: "Today", date: "2026-11-01" },
    { label: "Tomorrow", date: "2026-11-02" },
    { label: "Wed, 04 Nov", date: "2026-11-04" },
    { label: "Thu, 05 Nov", date: "2026-11-05" },
    { label: "Fri, 06 Nov", date: "2026-11-06" },
  ];
  const [selectedDate, setSelectedDate] = useState(dates[1].date);

  const timeSlots = [
    "10:30 AM - 11:15 AM IST",
    "11:45 AM - 12:30 PM IST",
    "02:30 PM - 03:15 PM IST",
    "04:00 PM - 04:45 PM IST",
    "05:30 PM - 06:15 PM IST",
  ];
  const [selectedSlot, setSelectedSlot] = useState(timeSlots[2]);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Please complete all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/demo-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          companyName: company,
          arn,
          selectedDate,
          selectedSlot,
        }),
      });

      if (!res.ok) throw new Error("Booking failed");
      setSubmitted(true);
    } catch {
      setError("Failed to schedule booking. Please try another slot or call our desk.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="bg-navy text-white py-16 border-b border-gold text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="px-3 py-1 bg-navy-light text-gold border border-gold/40 rounded text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-gold" />
            <span>1-on-1 Architecture Walkthrough</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold">
            Schedule Your Private Platform Demo
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            See how Portfolio Pro looks with your own firm&apos;s logo and branding. 30-minute tailored
            screen share with a Senior Solutions Architect.
          </p>
        </div>
      </div>

      <Section background="ivory" withOrnament>
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-[4px] border-2 border-gold/80 shadow-classic">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-navy">
                Demo Successfully Scheduled!
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-muted max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong>. A calendar invite with a secure Google Meet link
                for <strong>{selectedDate}</strong> at <strong>{selectedSlot}</strong> has been
                dispatched to <strong>{email}</strong>.
              </p>
              <div className="pt-4">
                <Button variant="navy" href="/">
                  Return to Homepage
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 text-xs">
              {error && <div className="p-3 bg-red-50 text-red-600 rounded">{error}</div>}

              {/* Step 1: Slot Picker */}
              <div>
                <h4 className="font-serif text-base font-bold text-navy mb-3 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-gold" />
                  <span>1. Select Date & Convenient Time Slot</span>
                </h4>

                <div className="space-y-3">
                  {/* Dates */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {dates.map((d) => (
                      <button
                        type="button"
                        key={d.date}
                        onClick={() => setSelectedDate(d.date)}
                        className={`p-3 rounded border text-center transition-all ${
                          selectedDate === d.date
                            ? "bg-navy text-gold border-navy font-bold shadow-sm"
                            : "bg-ivory text-charcoal border-rule hover:bg-gray-200"
                        }`}
                      >
                        <div className="text-[11px] font-semibold">{d.label}</div>
                        <div className="text-[10px] text-gray-400">{d.date}</div>
                      </button>
                    ))}
                  </div>

                  {/* Time Slots */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                    {timeSlots.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2.5 rounded border text-center text-xs transition-all ${
                          selectedSlot === slot
                            ? "bg-gold text-navy border-gold font-bold shadow-sm"
                            : "bg-white text-charcoal border-rule hover:bg-ivory"
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5 inline mr-1 text-gold-dark" />
                        <span>{slot}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 2: MFD Details */}
              <div className="border-t border-rule pt-6 space-y-4">
                <h4 className="font-serif text-base font-bold text-navy flex items-center gap-2">
                  <span>2. Your Advisory Details</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="demo-name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name (e.g. Deepak Chawla)"
                      className="w-full p-2.5 border border-rule rounded focus:outline-none focus:border-gold bg-ivory/30 text-charcoal"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="demo-email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Work Email (deepak@advisoryfirm.in)"
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
                      name="phone"
                      id="demo-phone"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Mobile Number (98101 23456)"
                      className="w-full p-2.5 border border-rule rounded focus:outline-none focus:border-gold bg-ivory/30 text-charcoal"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                      Advisory Firm / Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      id="demo-company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Finvest Wealth Delhi"
                      className="w-full p-2.5 border border-rule rounded focus:outline-none focus:border-gold bg-ivory/30 text-charcoal"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                      ARN Code
                    </label>
                    <input
                      type="text"
                      name="arn"
                      id="demo-arn"
                      value={arn}
                      onChange={(e) => setArn(e.target.value)}
                      placeholder="ARN-XXXXXX"
                      className="w-full p-2.5 border border-rule rounded focus:outline-none focus:border-gold bg-ivory/30 text-charcoal uppercase"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-navy text-gold font-bold uppercase tracking-wider rounded shadow-classic hover:bg-gold hover:text-navy transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Reserving Slot & Creating Meeting Link...</span>
                  </>
                ) : (
                  <span>Confirm Live 1-on-1 Demonstration</span>
                )}
              </button>
            </form>
          )}
        </div>
      </Section>
    </div>
  );
}

