"use client";

import { useEffect, useState } from "react";
import { DexMascot, DexSay } from "@/components/ui/DexMascot";
import { PROCESSING_STEPS, type ProcessingStatus } from "@/lib/types";

interface ProcessingScreenProps {
  fileName: string;
  progress: number;        // 0–100
}

const DEX_MESSAGES = [
  "🧠 Give me a sec — reading every word so you don't have to.",
  "🔍 Found some interesting bits in here...",
  "✨ This is actually pretty fascinating!",
  "🎧 Almost done — putting together your audio summary.",
  "🎯 Final stretch — building your personalised quiz!",
];

function LoadingDots() {
  return (
    <span className="inline-flex gap-1 ml-1">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block animate-bounce-gentle"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

export default function ProcessingScreen({ fileName, progress }: ProcessingScreenProps) {
  const [messageIdx, setMessageIdx] = useState(0);

  // Cycle Dex messages
  useEffect(() => {
    const idx = PROCESSING_STEPS.findIndex((s, i) => {
      const next = PROCESSING_STEPS[i + 1];
      return progress >= s.threshold && (!next || progress < next.threshold);
    });
    setMessageIdx(Math.max(0, idx));
  }, [progress]);

  const activeStep = PROCESSING_STEPS.findIndex((s, i) => {
    const next = PROCESSING_STEPS[i + 1];
    return progress >= s.threshold && (!next || progress < next.threshold);
  });

  return (
    <div className="mobile-container items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb w-56 h-56 -top-10 -right-16 bg-purple-200/30 animate-float-slow" />
      <div className="orb w-40 h-40 bottom-20  -left-12 bg-teal-200/25  animate-float"      />

      {/* Dex */}
      <div className="mb-6">
        <DexMascot size={88} mood="thinking" animate />
      </div>

      {/* Headline */}
      <h2 className="text-2xl font-display font-black text-ink tracking-tight text-center mb-1">
        Dex is on it
      </h2>
      <p className="text-sm text-muted text-center mb-8 max-w-[220px]">
        {fileName || "Your document"} is being decoded
      </p>

      {/* Progress */}
      <div className="w-full max-w-[280px] mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted font-medium">Decoding…</span>
          <span className="text-xs font-black text-purple-600">{Math.round(progress)}%</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="w-full max-w-[280px] flex flex-col gap-3 mb-10">
        {PROCESSING_STEPS.map((step, i) => {
          const done   = progress > (PROCESSING_STEPS[i + 1]?.threshold ?? 101);
          const active = i === activeStep;
          const future = i > activeStep;

          return (
            <div
              key={step.id}
              className="flex items-center gap-3 transition-opacity duration-400"
              style={{ opacity: future ? 0.3 : 1 }}
            >
              {/* Icon cell */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 transition-all duration-300"
                style={{
                  background: done
                    ? "rgba(20,184,166,0.12)"
                    : active
                    ? "rgba(139,92,246,0.12)"
                    : "rgba(229,231,235,0.8)",
                }}
              >
                {done ? "✅" : step.icon}
              </div>

              {/* Label */}
              <span
                className="text-sm transition-all duration-200"
                style={{
                  fontWeight: active ? 700 : 500,
                  color:      active ? "#1F2937" : "#9CA3AF",
                }}
              >
                {step.label}
                {active && <LoadingDots />}
              </span>
            </div>
          );
        })}
      </div>

      {/* Dex speech */}
      <DexSay
        text={DEX_MESSAGES[messageIdx]}
        mood="thinking"
        className="w-full max-w-[320px]"
      />
    </div>
  );
}
