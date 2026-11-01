"use client";

import React, { useState } from "react";
import { MessageSquare, MessageCircle, X, Send, Bot, Sparkles, ChevronRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { faqs } from "@/config/faq";

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([
    {
      sender: "bot",
      text: "Hello! Welcome to Portfolio Pro Advisory Support. How can we assist your mutual fund distribution practice today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleQuickQuestion = (question: string, answer: string) => {
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: question },
      { sender: "bot", text: answer },
    ]);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setInputValue("");
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);

    // Smart FAQ matcher
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let reply =
        "Thank you for your question. A senior wealth tech consultant has received your message. Would you like to schedule a 15-minute screen-share demo or connect directly via WhatsApp?";

      const foundFaq = faqs.find(
        (f) =>
          f.question.toLowerCase().includes(lower) ||
          f.answer.toLowerCase().includes(lower) ||
          (lower.includes("price") && f.category === "Pricing & Migration") ||
          (lower.includes("bse") && f.category === "Transactions") ||
          (lower.includes("cams") && f.category === "Data & Security")
      );

      if (foundFaq) {
        reply = foundFaq.answer;
      }

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Buttons: WhatsApp + Live Chat Assistant */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none">
        {/* Floating WhatsApp Action Button */}
        <a
          href={siteConfig.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3.5 py-2.5 bg-[#25D366] text-white font-semibold text-xs rounded-full shadow-classic-lg hover:bg-[#20ba59] hover:scale-105 transition-all"
          title="Chat directly on WhatsApp with our Advisory Desk"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline font-sans">Chat on WhatsApp</span>
        </a>

        {/* AI FAQ / Live Chat Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-13 h-13 p-3.5 bg-navy text-white rounded-full shadow-classic-lg border-2 border-gold hover:bg-navy-light hover:scale-105 transition-all group"
          aria-label="Open AI Assistant"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-gold" />
          ) : (
            <div className="relative">
              <Bot className="w-6 h-6 text-gold" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-teal"></span>
              </span>
            </div>
          )}
        </button>
      </div>

      {/* AI Assistant Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[92vw] sm:w-96 max-h-[580px] h-[75vh] z-50 bg-white rounded-[4px] shadow-classic-lg border border-gold flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-navy p-4 text-white flex items-center justify-between border-b border-gold">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-navy-light border border-gold/40 rounded">
                <Bot className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
                  Portfolio Pro AI
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                </h4>
                <p className="text-[11px] text-gray-300">MFD Tech & Compliance Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick FAQ prompts */}
          <div className="p-2.5 bg-ivory border-b border-rule/80 overflow-x-auto flex gap-1.5 text-[11px] whitespace-nowrap">
            <button
              onClick={() =>
                handleQuickQuestion(
                  "How does BSE StarMF order execution work?",
                  faqs.find((f) => f.question.includes("BSE StarMF"))?.answer || ""
                )
              }
              className="px-2.5 py-1 bg-white border border-gold/50 rounded text-navy font-medium hover:bg-gold/10"
            >
              BSE StarMF Integration?
            </button>
            <button
              onClick={() =>
                handleQuickQuestion(
                  "Can I migrate data from my existing software?",
                  faqs.find((f) => f.question.includes("migrate"))?.answer || ""
                )
              }
              className="px-2.5 py-1 bg-white border border-gold/50 rounded text-navy font-medium hover:bg-gold/10"
            >
              Data Migration?
            </button>
            <button
              onClick={() =>
                handleQuickQuestion(
                  "Is client data secure under SEBI rules?",
                  faqs.find((f) => f.question.includes("SEBI"))?.answer || ""
                )
              }
              className="px-2.5 py-1 bg-white border border-gold/50 rounded text-navy font-medium hover:bg-gold/10"
            >
              SEBI Security?
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-ivory/40 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-[3px] p-3 leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-navy text-white rounded-br-none"
                      : "bg-white text-charcoal border border-rule/80 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Input Field */}
          <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-rule flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about features, pricing, BSE/NSE..."
              className="flex-1 px-3 py-2 text-xs border border-rule rounded-[2px] focus:outline-none focus:border-gold text-charcoal"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-brand-blue text-white rounded-[2px] hover:bg-navy transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

