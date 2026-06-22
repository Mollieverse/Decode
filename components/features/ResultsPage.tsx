"use client";

import { useState, useCallback } from "react";
import { type DecodeResult, type Level, LEVELS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DexMascot, DexSay } from "@/components/ui/DexMascot";
import { LevelSelector } from "@/components/features/LevelSelector";
import { AudioPlayer } from "@/components/features/AudioPlayer";
import { QuizMode } from "@/components/features/QuizMode";
import { SignupSheet } from "@/components/features/SignupSheet";
import { SkeletonExplanation } from "@/components/ui/Skeleton";
import { fetchLevelExplanation } from "@/lib/api";

interface ResultsPageProps {
  data:    DecodeResult;
  onReset: () => void;
}

type Tab = "explain" | "takeaways" | "audio" | "quiz";

const TABS: { id: Tab; emoji: string; label: string }[] = [
  { id: "explain",   emoji: "🧠", label: "Explain"   },
  { id: "takeaways", emoji: "✅", label: "Takeaways" },
  { id: "audio",     emoji: "🎧", label: "Audio"     },
  { id: "quiz",      emoji: "🎯", label: "Quiz"      },
];

const TAKEAWAY_ICONS = ["🎯", "⚡", "🔑", "💎", "🚀"];
const TAKEAWAY_BG    = [
  "bg-purple-50 border-purple-100",
  "bg-teal-50 border-teal-100",
  "bg-amber-50 border-amber-100",
  "bg-pink-50 border-pink-100",
  "bg-indigo-50 border-indigo-100",
];

const DEX_TAB_SAYS: Record<Tab, string> = {
  explain:   "🧠 I read every page so you don't have to. Switch levels to change how deep we go!",
  takeaways: "✅ These are the five things worth remembering. Screenshot this.",
  audio:     "🎧 Pop in your earbuds and I'll walk you through it.",
  quiz:      "🎯 Let's see how much stuck. No pressure — it's just between us!",
};

export default function ResultsPage({ data, onReset }: ResultsPageProps) {
  const [tab,           setTab]           = useState<Tab>("explain");
  const [level,         setLevel]         = useState<Level>("Age 12");
  const [explanations,  setExplanations]  = useState<Partial<Record<Level, string>>>(
    data.explanations ?? {}
  );
  const [loadingLevel,  setLoadingLevel]  = useState(false);
  const [signupOpen,    setSignupOpen]    = useState(false);
  const [signupTrigger, setSignupTrigger] = useState<"quiz" | "share" | "limit">("quiz");

  const handleLevelChange = useCallback(async (next: Level) => {
    setLevel(next);
    if (explanations[next]) return;
    setLoadingLevel(true);
    try {
      const text = await fetchLevelExplanation(data.summary, next);
      setExplanations(prev => ({ ...prev, [next]: text }));
    } catch {
      setExplanations(prev => ({
        ...prev,
        [next]: "Couldn't load this level right now. Please try again.",
      }));
    } finally {
      setLoadingLevel(false);
    }
  }, [explanations, data.summary]);

  const openSignup = (trigger: typeof signupTrigger) => {
    setSignupTrigger(trigger);
    setSignupOpen(true);
  };

  const explanation = explanations[level] ?? "";

  // Build full audio text from summary + takeaways
  const audioText = [
    `Here is your audio summary of: ${data.title}.`,
    data.summary,
    "Here are the key takeaways.",
    ...(data.takeaways ?? []).map((t, i) => `Takeaway ${i + 1}: ${t}`),
    data.whyItMatters ? `Why this matters: ${data.whyItMatters}` : "",
  ].filter(Boolean).join(" ");

  return (
    <div className="mobile-container overflow-hidden">

      {/* Sticky top bar */}
      <div className="sticky top-0 z-20 bg-bg/90 bg-blur-card border-b border-border-purple">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={onReset}
            className="w-9 h-9 rounded-xl flex items-center justify-center
                       text-muted text-lg hover:bg-purple-50 transition-colors"
            aria-label="Back"
          >
            ←
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-ink truncate leading-tight">
              {data.title}
            </p>
            <p className="text-xs text-muted">
              {data.pages} pages · {data.wordCount?.toLocaleString()} words · Decoded ✨
            </p>
          </div>
          <button
            onClick={() => openSignup("share")}
            className="shrink-0 px-3 py-1.5 rounded-lg
                       bg-purple-100 text-purple-700 text-xs font-bold
                       hover:bg-purple-200 transition-colors"
          >
            Share
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">

        {/* Dex intro */}
        <div className="px-4 pt-4 pb-2">
          <DexSay
            text={DEX_TAB_SAYS[tab]}
            mood={tab === "quiz" ? "excited" : tab === "audio" ? "cool" : "happy"}
          />
        </div>

        {/* Tab bar */}
        <div className="px-4 pb-3">
          <div className="tab-bar">
            {TABS.map(t => (
              <button
                key={t.id}
                className={cn("tab-btn", tab === t.id && "active")}
                onClick={() => setTab(t.id)}
                aria-selected={tab === t.id}
              >
                <span className="text-base leading-none">{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="px-4 pb-24">

          {/* EXPLAIN */}
          {tab === "explain" && (
            <div className="flex flex-col gap-4 animate-fade-up">
              <LevelSelector
                active={level}
                onChange={handleLevelChange}
                loading={loadingLevel}
              />
              <div
                className="rounded-2xl border-2 p-5"
                style={{
                  background: "linear-gradient(135deg, rgba(139,92,246,0.04) 0%, rgba(20,184,166,0.05) 100%)",
                  borderColor: "rgba(139,92,246,0.18)",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="px-2.5 py-1 rounded-lg text-2xs font-black text-white uppercase tracking-wide"
                    style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}
                  >
                    {LEVELS.find(l => l.id === level)?.emoji}{" "}
                    {level === "Age 8"   ? "ELI8"    :
                     level === "Age 12"  ? "ELI12"   :
                     level === "College" ? "College" : "Expert"}
                  </span>
                  <span className="text-xs text-muted font-medium">Plain English</span>
                </div>
                {loadingLevel ? (
                  <SkeletonExplanation />
                ) : (
                  <p className="text-base text-ink leading-[1.8] font-[450]">
                    {explanation}
                  </p>
                )}
              </div>

              {data.whyItMatters && (
                <div className="card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">💡</span>
                    <span className="text-sm font-bold text-ink">Why should I care?</span>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    {data.whyItMatters}
                  </p>
                </div>
              )}

              <div className="card-subtle p-4">
                <p className="section-label mb-2">Quick summary</p>
                <p className="text-sm text-ink leading-relaxed">{data.summary}</p>
              </div>
            </div>
          )}

          {/* TAKEAWAYS */}
          {tab === "takeaways" && (
            <div className="flex flex-col gap-3 animate-fade-up">
              <div className="mb-1">
                <h2 className="text-xl font-display font-black text-ink tracking-tight">
                  Key Takeaways
                </h2>
                <p className="text-sm text-muted mt-0.5">The 5 things worth remembering</p>
              </div>

              {(data.takeaways ?? []).map((t, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-2xl border p-4 flex gap-3 items-start animate-fade-up",
                    TAKEAWAY_BG[i % TAKEAWAY_BG.length]
                  )}
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 bg-white shadow-sm">
                    {TAKEAWAY_ICONS[i % TAKEAWAY_ICONS.length]}
                  </div>
                  <div>
                    <p className="text-2xs font-black text-muted uppercase tracking-wider mb-1">
                      Takeaway {i + 1}
                    </p>
                    <p className="text-sm text-ink leading-relaxed font-medium">{t}</p>
                  </div>
                </div>
              ))}

              {data.whyItMatters && (
                <div
                  className="rounded-2xl p-5 mt-1 animate-fade-up"
                  style={{
                    background:     "linear-gradient(135deg, #8B5CF6 0%, #14B8A6 100%)",
                    animationDelay: "0.4s",
                  }}
                >
                  <p className="text-xs font-black text-white/60 uppercase tracking-wider mb-2">
                    The bigger picture
                  </p>
                  <p className="text-sm text-white leading-relaxed font-medium">
                    {data.whyItMatters}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* AUDIO */}
          {tab === "audio" && (
            <div className="flex flex-col gap-4 animate-fade-up">
              <div className="mb-1">
                <h2 className="text-xl font-display font-black text-ink tracking-tight">
                  Audio Summary
                </h2>
                <p className="text-sm text-muted mt-0.5">Listen on the go</p>
              </div>

              <AudioPlayer text={audioText} />

              <div className="card p-4">
                <p className="text-xs font-bold text-purple-700 mb-2">🎧 Pro tip</p>
                <p className="text-sm text-muted leading-relaxed">
                  Try 1.5× speed for commute listening. The audio covers all 5 key takeaways in around 3 minutes.
                </p>
              </div>

              <div className="card-subtle p-4">
                <p className="section-label mb-3">What's covered</p>
                <div className="flex flex-col gap-2">
                  {["Introduction & context", "Core argument", "Key evidence", "Implications", "What to do next"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-ink">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* QUIZ */}
          {tab === "quiz" && (
            <div className="animate-fade-up">
              <div className="mb-4">
                <h2 className="text-xl font-display font-black text-ink tracking-tight">
                  Quiz Time
                </h2>
                <p className="text-sm text-muted mt-0.5">
                  {data.quiz?.length ?? 10} questions · See how much stuck
                </p>
              </div>
              <QuizMode
                questions={data.quiz ?? []}
                onSignupTrigger={() => openSignup("quiz")}
              />
            </div>
          )}

        </div>
      </div>

      {/* Bottom action bar */}
      <div
        className="sticky bottom-0 left-0 right-0 z-10 px-4 py-3 safe-bottom"
        style={{
          background:     "rgba(250,245,255,0.92)",
          backdropFilter: "blur(12px)",
          borderTop:      "1px solid rgba(139,92,246,0.1)",
        }}
      >
        <div className="flex gap-2.5">
          <button
            className="btn-primary flex-1 py-3 text-sm"
            onClick={() => openSignup("share")}
          >
            Share summary ↗
          </button>
          <button
            className="btn-secondary py-3 px-4 text-sm"
            style={{ width: "auto", flexShrink: 0 }}
            onClick={onReset}
          >
            New doc
          </button>
        </div>
      </div>

      {/* Signup sheet */}
      <SignupSheet
        open={signupOpen}
        onClose={() => setSignupOpen(false)}
        trigger={signupTrigger}
      />
    </div>
  );
}
