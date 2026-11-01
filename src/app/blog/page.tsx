import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { db } from "@/lib/db";
import { ArrowRight, BookOpen, Clock, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & Insights | Portfolio Pro",
  description:
    "Knowledge desk for Indian IFAs and MFDs: scaling monthly SIP books, BSE StarMF vs NSE NMF technical architecture, and capital gains tax updates.",
};

export default async function BlogIndexPage() {
  const posts = await db.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div>
      <div className="bg-navy text-white py-16 border-b border-gold text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="px-3 py-1 bg-navy-light text-gold border border-gold/40 rounded text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-gold" />
            <span>Advisory Knowledge Desk</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold">
            Industry Playbooks & Regulatory Insights
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            In-depth analysis, operational workflows, and technology guides written by seasoned wealth
            management professionals.
          </p>
        </div>
      </div>

      <Section background="ivory" withOrnament>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Card key={post.id} hoverEffect className="flex flex-col justify-between">
              <div className="space-y-3">
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-navy text-gold rounded-[2px]">
                  {post.category}
                </span>

                <h2 className="font-serif text-xl font-bold text-navy hover:text-brand-blue leading-snug">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-xs text-charcoal-muted line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-rule/60 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-gold" />
                    <span>{post.author}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span>{post.readTime}</span>
                  </span>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="font-bold text-xs text-brand-blue hover:text-navy inline-flex items-center gap-1 group"
                >
                  <span>Read Complete Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}

