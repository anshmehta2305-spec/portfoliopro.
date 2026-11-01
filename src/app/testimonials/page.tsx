"use client";

import React, { useState, useEffect } from "react";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Star, CheckCircle2, MessageSquare, Loader2, Sparkles } from "lucide-react";

interface TestimonialItem {
  id: string;
  authorName: string;
  designation: string;
  companyName: string;
  location: string;
  rating: number;
  feedback: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Submit form state
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const loadTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      if (data.testimonials) {
        setTestimonials(data.testimonials);
      }
    } catch (err) {
      console.error("Failed to load testimonials:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !company.trim() || !feedback.trim()) {
      setError("Please complete all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: name,
          designation: designation || "Independent Financial Advisor",
          companyName: company,
          location,
          rating,
          feedback,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
      setName("");
      setDesignation("");
      setCompany("");
      setLocation("");
      setFeedback("");
    } catch {
      setError("Unable to submit testimonial at this time");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="bg-navy text-white py-16 border-b border-gold text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="px-3 py-1 bg-navy-light text-gold border border-gold/40 rounded text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Community Wall of Trust</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold">
            What Fellow Wealth Advisors Say About Us
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Read real feedback from principal consultants, directors, and independent distributors
            managing hundreds of crores on Portfolio Pro.
          </p>
        </div>
      </div>

      <Section background="ivory" withOrnament>
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {loading ? (
            <div className="col-span-3 text-center py-12 text-xs text-charcoal-muted">
              Loading testimonials...
            </div>
          ) : (
            testimonials.map((t) => (
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
            ))
          )}
        </div>

        {/* Submit a Testimonial Form */}
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-[4px] border-2 border-gold/70 shadow-classic">
          <div className="text-center mb-6 border-b border-rule pb-4">
            <h3 className="font-serif text-2xl font-bold text-navy">Submit Your Experience</h3>
            <p className="text-xs text-charcoal-muted mt-1">
              Are you an active MFD on Portfolio Pro? Share your thoughts with the advisor community.
              (All submissions are verified by admin before appearing publicly).
            </p>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
              <h4 className="font-serif text-base font-bold text-emerald-900">
                Thank You for Your Feedback!
              </h4>
              <p className="text-xs text-emerald-800">
                Your testimonial has been submitted to the admin moderation desk and will be published
                after standard verification.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {error && <div className="p-2 bg-red-50 text-red-600 rounded">{error}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kulkarni"
                    className="w-full p-2.5 border border-rule rounded focus:outline-none focus:border-gold bg-ivory/30 text-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Principal Consultant"
                    className="w-full p-2.5 border border-rule rounded focus:outline-none focus:border-gold bg-ivory/30 text-charcoal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Company / Advisory Firm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Kulkarni Financial Services"
                    className="w-full p-2.5 border border-rule rounded focus:outline-none focus:border-gold bg-ivory/30 text-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                    City, State
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Pune, Maharashtra"
                    className="w-full p-2.5 border border-rule rounded focus:outline-none focus:border-gold bg-ivory/30 text-charcoal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Rating
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full p-2.5 border border-rule rounded focus:outline-none focus:border-gold bg-ivory/30 text-charcoal"
                >
                  <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                  <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Your Testimonial / Feedback <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="How has Portfolio Pro helped your advisory practice, client onboarding, or AUM growth?"
                  className="w-full p-2.5 border border-rule rounded focus:outline-none focus:border-gold bg-ivory/30 text-charcoal"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-navy text-gold font-bold uppercase tracking-wider rounded shadow-classic hover:bg-gold hover:text-navy transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Review...</span>
                  </>
                ) : (
                  <span>Submit Testimonial for Review</span>
                )}
              </button>
            </form>
          )}
        </div>
      </Section>
    </div>
  );
}

