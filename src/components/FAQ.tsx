"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { FAQ_AEO_ITEMS } from "@/src/data/seo_data";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section 
      id="faq" 
      className="py-16 sm:py-24 md:py-32 bg-[#0A0A0A] relative z-10 border-t border-white/5 overflow-hidden"
      aria-labelledby="faq-heading"
    >
      {/* Background Watermark & Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] md:text-[18rem] font-display font-black text-white/[0.015] uppercase pointer-events-none whitespace-nowrap z-0">
        QUESTIONS
      </div>
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-racing-red/5 rounded-full blur-[150px] pointer-events-none -translate-x-1/2 z-0"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-racing-red" />
              <span className="text-racing-red font-sans font-bold tracking-[0.2em] uppercase text-[11px]">
                ANSWER ENGINE OPTIMIZED // KNOWLEDGE BASE
              </span>
            </div>
            <h2 
              id="faq-heading"
              className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase text-white tracking-tight"
            >
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <p className="text-white/50 font-sans text-xs sm:text-sm md:text-base mt-3 max-w-2xl font-light">
              Essential verified facts on our collegiate Formula Student EV program, competition history, powertrain architecture, and sponsorship pathways.
            </p>
          </motion.div>
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          {FAQ_AEO_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`border transition-colors duration-300 rounded-none bg-[#111111]/60 backdrop-blur-sm ${
                  isOpen ? "border-racing-red/60 bg-[#141414]" : "border-white/5 hover:border-white/20"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-4 sm:p-6 flex items-center justify-between gap-4 focus:outline-none cursor-pointer group"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="font-mono text-xs text-racing-red font-bold">
                      {String(index + 1).padStart(2, "0")}.
                    </span>
                    <h3 className="font-display font-bold text-sm sm:text-base md:text-lg uppercase tracking-wide text-white group-hover:text-racing-red transition-colors">
                      {item.question}
                    </h3>
                  </div>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 transition-transform duration-300 ${
                    isOpen 
                      ? "border-racing-red bg-racing-red/10 text-racing-red rotate-180" 
                      : "border-white/10 text-white/40 group-hover:border-white/30 group-hover:text-white"
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-6 pb-5 sm:pb-6 pt-1 text-white/70 font-sans text-xs sm:text-sm md:text-base font-light leading-relaxed border-t border-white/5">
                        <p>{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom AEO Semantic Summary Box */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto p-4 sm:p-6 bg-[#0E0E0E] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <HelpCircle className="w-5 h-5 text-racing-red shrink-0 hidden sm:block" />
            <p className="text-white/60 font-sans text-xs sm:text-sm font-light">
              Have a technical or media query not answered above? Reach our engineering desk directly.
            </p>
          </div>
          <a
            href="mailto:tech@veerracerss.org"
            className="shrink-0 bg-racing-red/10 border border-racing-red text-white hover:bg-racing-red px-5 py-2.5 text-xs font-sans font-bold tracking-widest uppercase transition-colors"
          >
            CONTACT DESK
          </a>
        </div>

      </div>
    </section>
  );
}
