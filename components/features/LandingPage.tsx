"use client";

import { useRef } from "react";
import { DexMascot, DexSay } from "@/components/ui/DexMascot";
import { UploadZone } from "@/components/features/UploadZone";
import { EXAMPLE_DOCS } from "@/lib/types";
import type { User } from "@supabase/supabase-js";

interface LandingPageProps {
  onFile:    (file: File) => void;
  onDemo:    () => void;
  user?:     User | null;
  onSignOut?: () => void;
}

const FEATURE_CARDS = [
  {
    emoji: "🧠",
    title: "Explain Like I'm 12",
    body:  "Any document, broken down into plain English you'll actually remember.",
    bg:    "bg-purple-50 border-purple-100",
  },
  {
    emoji: "✅",
    title: "5 Key Takeaways",
    body:  "The most important points, ready to screenshot and share.",
    bg:    "bg-teal-50 border-teal-100",
  },
  {
    emoji: "🎧",
    title: "Audio Summary",
    body:  "Listen to your document on the commute. Choose from 3 voices.",
    bg:    "bg-amber-50 border-amber-100",
  },
  {
    emoji: "🎯",
    title: "Quiz Yourself",
    body:  "5 questions to lock in what you learned. Track your score.",
    bg:    "bg-pink-50 border-pink-100",
  },
];

const SOCIAL_PROOF = [
  { emoji: "👩‍🎓", name: "Maya R.",  text: "Decoded a 40-page legal contract in 30 seconds." },
  { emoji: "👨‍💻", name: "James T.", text: "Finally understood the Ethereum whitepaper!"     },
  { emoji: "👩‍🔬", name: "Priya K.", text: "My students use this for every research paper."  },
];

export default function LandingPage({ onFile, onDemo, user, onSignOut }: LandingPageProps) {
  return (
    <div className="mobile-container overflow-y-auto">
      {/* Background orbs */}
      <div className="orb w-64 h-64 -top-16 -right-20 bg-purple-200/40" />
      <div className="orb w-48 h-48 top-40  -left-16 bg-teal-200/30"   />

      {/* Nav */}
      <nav className="relative flex items-center justify-between px-5 pt-5 pb-2">
        <div className="flex items-center gap-2">
          <DexMascot size={30} mood="happy" animate />
          <span className="text-xl font-display font-black text-purple-700 tracking-tight">
            Decode
          </span>
        </div>

        {/* Auth state in nav */}
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-full">
              {user.email?.split("@")[0]} ✓
            </span>
            <button className="btn-ghost text-xs px-3 py-2" onClick={onSignOut}>
              Sign out
            </button>
          </div>
        ) : (
          <button className="btn-ghost text-xs px-3 py-2">Sign in</button>
        )}
      </nav>

      {/* Hero */}
      <section style={{ padding: "32px 20px 20px", textAlign: "center", position: "relative" }}>
        <div className="inline-block mb-5">
          <DexMascot size={90} mood="excited" animate />
        </div>

        <div className="inline-flex items-center gap-1.5 chip-purple mb-4 text-xs px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse-soft" />
          Now with audio summaries ✨
        </div>

        <h1 className="text-4xl font-display font-black tracking-tight text-ink mb-3 leading-[1.1]">
          Upload anything.<br />
          <span className="text-gradient">Understand everything.</span>
        </h1>

        <p className="text-base text-muted leading-relaxed max-w-[300px] mx-auto mb-8">
          Turn confusing documents into simple explanations, key takeaways, audio summaries, and quizzes.
        </p>

        {/* Upload zone */}
        <UploadZone onFile={onFile} className="mb-4" />

        {/* CTA row */}
        <div className="flex gap-3 mb-3">
          <button className="btn-primary flex-[3]" onClick={onDemo}>
            ✨ Try Demo
          </button>
          <button
            className="btn-secondary flex-[2] text-sm"
            onClick={() => document.querySelector<HTMLElement>(".upload-zone")?.click()}
          >
            📤 Upload
          </button>
        </div>

        {/* Signed in message */}
        {user ? (
          <p className="text-xs text-teal-600 font-semibold mt-1">
            ✅ Signed in — your decodes are being saved
          </p>
        ) : (
          <p className="text-xs text-ghost mt-1">
            No sign-up required · Free to start
          </p>
        )}
      </section>

      {/* Examples */}
      <section className="px-5 pb-6">
        <p className="section-label mb-3">Popular examples</p>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {EXAMPLE_DOCS.map(ex => (
            <button
              key={ex.label}
              onClick={onDemo}
              className="chip-ghost flex-shrink-0 text-xs px-3 py-2"
            >
              {ex.emoji} {ex.label}
            </button>
          ))}
        </div>
      </section>

      {/* Feature cards */}
      <section className="px-5 pb-6">
        <p className="section-label mb-3">What you get</p>
        <div className="grid grid-cols-2 gap-3">
          {FEATURE_CARDS.map(f => (
            <div key={f.title} className={`rounded-2xl border p-4 ${f.bg}`}>
              <div className="text-2xl mb-2">{f.emoji}</div>
              <div className="text-sm font-bold text-ink mb-1">{f.title}</div>
              <div className="text-xs text-muted leading-relaxed">{f.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 pb-6">
        <p className="section-label mb-4">How it works</p>
        <div className="flex flex-col gap-0">
          {[
            { step: "1", title: "Upload your PDF",       body: "Drop any document — research papers, contracts, notes, whitepapers." },
            { step: "2", title: "Dex reads it for you",  body: "Our AI breaks down every page and finds what actually matters."      },
            { step: "3", title: "Choose your level",     body: "Age 8, Age 12, College, or Expert — switch anytime."                 },
            { step: "4", title: "Quiz yourself",         body: "5 personalised questions to solidify what you learned."              },
          ].map((s, i, arr) => (
            <div key={s.step} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-black shrink-0">
                  {s.step}
                </div>
                {i < arr.length - 1 && (
                  <div className="w-px flex-1 bg-purple-200 my-1.5 min-h-[24px]" />
                )}
              </div>
              <div className="pb-5">
                <p className="text-sm font-bold text-ink mb-0.5">{s.title}</p>
                <p className="text-xs text-muted leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="px-5 pb-6">
        <p className="section-label mb-3">People love Decode</p>
        <div className="flex flex-col gap-3">
          {SOCIAL_PROOF.map(s => (
            <div key={s.name} className="card p-4 flex gap-3 items-start">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div>
                <p className="text-xs font-bold text-ink mb-1">{s.name}</p>
                <p className="text-xs text-muted leading-relaxed">"{s.text}"</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dex CTA */}
      <section className="px-5 pb-10">
        <DexSay
          text="🧠 I've decoded 10,000+ documents. Drop yours and I'll have it ready in seconds!"
          mood="excited"
        />
        <button className="btn-primary mt-5" onClick={onDemo}>
          Start decoding — it's free ✨
        </button>
      </section>
    </div>
  );
      }
