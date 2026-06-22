"use client";

import { cn } from "@/lib/utils";

type Mood = "happy" | "thinking" | "excited" | "cool" | "proud" | "surprised";

interface DexProps {
  size?: number;
  mood?: Mood;
  className?: string;
  animate?: boolean;
}

const mouthPaths: Record<Mood, string> = {
  happy:     "M 17 25 Q 22 30 27 25",
  thinking:  "M 18 27 Q 22 26 26 27",
  excited:   "M 15 24 Q 22 32 29 24",
  cool:      "M 17 26 L 27 26",
  proud:     "M 16 23 Q 22 29 28 23",
  surprised: "M 20 25 Q 22 29 24 25",
};

const eyeShapes: Record<Mood, { left: string; right: string }> = {
  happy:     { left: "circle", right: "circle" },
  thinking:  { left: "circle", right: "squint" },
  excited:   { left: "wide",   right: "wide"   },
  cool:      { left: "circle", right: "circle" },
  proud:     { left: "circle", right: "circle" },
  surprised: { left: "wide",   right: "wide"   },
};

export function DexMascot({ size = 48, mood = "happy", className, animate = true }: DexProps) {
  const s = size;
  const scale = s / 48;

  const mouth = mouthPaths[mood];
  const eyes  = eyeShapes[mood];

  const isWide = eyes.left === "wide";

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 48 48"
      fill="none"
      className={cn(animate && "animate-float", className)}
      aria-label="Dex the brain mascot"
    >
      {/* Glow */}
      <ellipse cx="24" cy="40" rx="14" ry="3" fill="rgba(139,92,246,0.12)" />

      {/* Body — brain shape */}
      <path
        d="M 24 8 C 14 8 8 15 8 22 C 8 26 10 30 14 33 C 14 36 16 38 18 38 L 30 38 C 32 38 34 36 34 33 C 38 30 40 26 40 22 C 40 15 34 8 24 8 Z"
        fill="url(#brainGrad)"
      />

      {/* Brain groove lines */}
      <path
        d="M 13 20 Q 17 16 21 20 Q 25 24 29 20 Q 33 16 35 20"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 11 27 Q 15 23 18 27"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 30 27 Q 34 23 37 27"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Left eye */}
      {isWide ? (
        <>
          <ellipse cx="18.5" cy="22" rx="3.5" ry="4" fill="white" />
          <ellipse cx="19"   cy="22" rx="2"   ry="2.5" fill="#4C1D95" />
        </>
      ) : (
        <>
          <circle cx="18.5" cy="22" r="3.5"  fill="white" />
          <circle cx="19"   cy="22" r="2"    fill="#4C1D95" />
        </>
      )}
      <circle cx="19.8" cy="21" r="0.7" fill="white" />

      {/* Right eye */}
      {isWide ? (
        <>
          <ellipse cx="29.5" cy="22" rx="3.5" ry="4" fill="white" />
          <ellipse cx="30"   cy="22" rx="2"   ry="2.5" fill="#4C1D95" />
        </>
      ) : eyes.right === "squint" ? (
        <>
          <path d="M 27 21 Q 29.5 24 32 21" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="29.5" cy="22" r="3.5" fill="white" />
          <circle cx="30"   cy="22" r="2"   fill="#4C1D95" />
        </>
      )}
      {eyes.right !== "squint" && (
        <circle cx="30.8" cy="21" r="0.7" fill="white" />
      )}

      {/* Mouth */}
      <path
        d={mouth}
        stroke="white"
        strokeWidth="2.2"
        fill={mood === "surprised" ? "rgba(255,255,255,0.8)" : "none"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Antenna */}
      <line x1="24" y1="8" x2="24" y2="2" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="2" r="2.5" fill="#14B8A6" />
      <circle cx="24" cy="2" r="1"   fill="white" opacity="0.6" />

      {/* Cheek blush */}
      {(mood === "excited" || mood === "proud") && (
        <>
          <ellipse cx="14" cy="27" rx="3" ry="1.5" fill="rgba(251,113,133,0.3)" />
          <ellipse cx="34" cy="27" rx="3" ry="1.5" fill="rgba(251,113,133,0.3)" />
        </>
      )}

      {/* Sparkles */}
      <circle cx="39" cy="14" r="1.8" fill="#14B8A6" opacity="0.7" />
      <circle cx="9"  cy="16" r="1.5" fill="#F59E0B" opacity="0.8" />
      <circle cx="37" cy="33" r="1"   fill="#F472B6" opacity="0.6" />

      {/* Gradient defs */}
      <defs>
        <linearGradient id="brainGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
    </svg>
  );
}

interface DexSayProps {
  text: string;
  mood?: Mood;
  dexSize?: number;
  className?: string;
}

export function DexSay({ text, mood = "happy", dexSize = 44, className }: DexSayProps) {
  return (
    <div className={cn("flex items-end gap-3", className)}>
      <div className="shrink-0">
        <DexMascot size={dexSize} mood={mood} />
      </div>
      <div className="dex-bubble animate-fade-up">{text}</div>
    </div>
  );
}
