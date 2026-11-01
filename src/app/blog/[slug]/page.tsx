import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { ArrowLeft, Clock, User, Share2, ShieldCheck } from "lucide-react";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await db.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) return { title: "Article Not Found | Portfolio Pro" };

  const cleanTitle = post.title.length > 40 ? post.title.slice(0, 37) + "..." : post.title;
  return {
    title: `${cleanTitle} | Portfolio Pro`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await db.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen">
      <div className="bg-navy text-white py-16 border-b border-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Knowledge Desk</span>
          </Link>

          <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-navy-light text-gold border border-gold/40 rounded-[2px]">
            {post.category}
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-gray-300">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-gold" />
              <span>By {post.author}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gold" />
              <span>{post.readTime}</span>
            </span>
            <span>Published on {post.publishedAt.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
        </div>
      </div>

      <Section background="ivory" withOrnament>
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[4px] border border-rule/80 shadow-classic">
          {/* Excerpt callout box */}
          <div className="p-4 bg-ivory rounded border-l-4 border-gold text-xs sm:text-sm font-serif italic text-navy leading-relaxed mb-8">
            {post.excerpt}
          </div>

          {/* Article Body Content */}
          <div className="prose prose-navy max-w-none text-charcoal font-sans text-sm sm:text-base leading-relaxed space-y-5">
            {post.content.split("\n\n").map((para, i) => {
              if (para.startsWith("### ")) {
                return (
                  <h3 key={i} className="font-serif text-xl sm:text-2xl font-bold text-navy mt-8 mb-3">
                    {para.replace("### ", "")}
                  </h3>
                );
              }
              if (para.startsWith("#### ")) {
                return (
                  <h4 key={i} className="font-serif text-lg font-bold text-navy mt-6 mb-2">
                    {para.replace("#### ", "")}
                  </h4>
                );
              }
              return (
                <p key={i} className="text-charcoal leading-relaxed">
                  {para}
                </p>
              );
            })}
          </div>

          {/* Bottom Article Author Banner */}
          <div className="mt-12 pt-8 border-t border-rule flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs uppercase tracking-wider text-charcoal-muted font-semibold">
                Written by
              </span>
              <div className="font-serif font-bold text-navy text-base">{post.author}</div>
              <p className="text-xs text-gray-500">Portfolio Pro Research Desk</p>
            </div>

            <Button variant="gold" size="sm" href="/book-demo">
              Schedule Architecture Demo
            </Button>
          </div>
        </div>
      </Section>
    </article>
  );
}

