"use client";

import { useState } from "react";
import { type QuizQuestion } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DexMascot } from "@/components/ui/DexMascot";

interface QuizModeProps {
  questions:        QuizQuestion[];
  onSignupTrigger?: () => void;
  onComplete?:      (score: number, total: number) => void;
}

type QuizState = "playing" | "done";

const LETTER = ["A", "B", "C", "D"];

const SCORE_LABELS: [number, string, string][] = [
  [9,  "Genius! 🏆",      "You clearly didn't need Dex's help."          ],
  [7,  "Outstanding! 🌟", "You understood this document deeply."          ],
  [5,  "Great job! 🎉",   "You've got a solid grasp of the key ideas."   ],
  [3,  "Good effort! 💪", "A quick re-read will lock it all in."         ],
  [0,  "Keep going! 📚",  "Every mistake is just learning in disguise."  ],
];

function getScoreLabel(score: number): [string, string] {
  for (const [threshold, label, sub] of SCORE_LABELS) {
    if (score >= threshold) return [label, sub];
  }
  return ["Keep going! 📚", "Every mistake is just learning in disguise."];
}

export function QuizMode({ questions, onSignupTrigger, onComplete }: QuizModeProps) {
  const [state,    setState]    = useState<QuizState>("playing");
  const [current,  setCurrent]  = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers,  setAnswers]  = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );

  const q        = questions[current];
  const answered = selected !== null;
  const isLast   = current === questions.length - 1;
  const score    = answers.filter((a, i) => a === questions[i]?.correct).length;
  const progress = ((current + (answered ? 1 : 0)) / questions.length) * 100;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLast) {
      setState("done");
      onComplete?.(score, questions.length);
      onSignupTrigger?.();
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setState("playing");
    setCurrent(0);
    setSelected(null);
    setAnswers(Array(questions.length).fill(null));
  };

  // ── Results ────────────────────────────────────────────────────────────────
  if (state === "done") {
    const [scoreLabel, scoreSub] = getScoreLabel(score);
    const pct = Math.round((score / questions.length) * 100);

    const weak = questions
      .map((q, i) => ({ q, i, wrong: answers[i] !== q.correct }))
      .filter(x => x.wrong)
      .slice(0, 3);

    return (
      <div className="animate-fade-up flex flex-col gap-5">
        {/* Score hero */}
        <div className="card-purple p-6 text-center">
          <div className="animate-float inline-block mb-4">
            <DexMascot size={64} mood={score >= 4 ? "excited" : "happy"} animate />
          </div>
          <div className="text-5xl font-display font-black tracking-tight mb-1">
            {score}<span className="text-white/50 text-3xl">/{questions.length}</span>
          </div>
          <div className="text-xl font-bold mb-1">{scoreLabel}</div>
          <div className="text-sm text-white/70">{scoreSub}</div>

          {/* Progress ring */}
          <div className="mt-4 mx-auto w-20 h-20 relative">
            <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8"/>
              <circle
                cx="40" cy="40" r="32"
                fill="none"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - pct / 100)}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-black">{pct}%</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="card p-5">
          <p className="font-bold text-sm text-ink mb-3">Your results</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { val: score,                    label: "Correct",  color: "text-teal-500"   },
              { val: questions.length - score, label: "Wrong",    color: "text-red-500"    },
              { val: `${pct}%`,                label: "Accuracy", color: "text-purple-600" },
            ].map(s => (
              <div key={s.label} className="bg-purple-50 rounded-xl py-3">
                <div className={cn("text-2xl font-black", s.color)}>{s.val}</div>
                <div className="text-2xs text-muted mt-0.5 font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak areas */}
        {weak.length > 0 && (
          <div className="card p-5">
            <p className="font-bold text-sm text-ink mb-3">📌 Areas to review</p>
            <div className="flex flex-col gap-2.5">
              {weak.map(({ q, i }) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-red-100 text-red-500 text-2xs font-black flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-muted leading-relaxed">{q.question}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendation */}
        <div className="card-subtle p-5">
          <p className="font-bold text-sm text-ink mb-2">💡 Recommendation</p>
          <p className="text-sm text-muted leading-relaxed">
            {pct >= 80
              ? "Excellent retention! Try switching to Expert level for deeper nuance."
              : pct >= 60
              ? "Good foundation. Re-read the key takeaways then retake the quiz."
              : "Head back to Explain tab and try Age 12 mode for a clearer breakdown."}
          </p>
        </div>

        <button className="btn-primary" onClick={restart}>
          Try again 🔄
        </button>
      </div>
    );
  }

  // ── Playing ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4 animate-fade-up">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-ink">
          Question {current + 1} of {questions.length}
        </span>
        <span className="chip-teal">Score: {score}</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="card-subtle p-5 border border-purple-200">
        <p className="text-base font-bold text-ink leading-relaxed">{q?.question}</p>
      </div>

      <div className="flex flex-col gap-2.5">
        {q?.options.map((opt, idx) => {
          let variant = "";
          if (answered) {
            if (idx === q.correct)               variant = "correct";
            else if (idx === selected)           variant = "wrong";
          } else if (idx === selected) {
            variant = "selected";
          }

          return (
            <button
              key={idx}
              className={cn("quiz-opt", variant, answered && "answered")}
              onClick={() => handleSelect(idx)}
              disabled={answered}
            >
              <span
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center",
                  "text-xs font-black shrink-0 transition-colors duration-200",
                  variant === "correct" ? "bg-teal-500 text-white"  :
                  variant === "wrong"   ? "bg-red-400 text-white"   :
                                          "bg-purple-100 text-purple-700"
                )}
              >
                {LETTER[idx]}
              </span>
              <span className="flex-1 text-left">{opt}</span>
              {variant === "correct" && <span className="text-lg">✅</span>}
              {variant === "wrong"   && <span className="text-lg">❌</span>}
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={cn(
            "rounded-xl px-4 py-3 text-sm leading-relaxed font-medium animate-fade-up",
            selected === q?.correct
              ? "bg-teal-50 text-teal-800 border border-teal-200"
              : "bg-red-50 text-red-800 border border-red-200"
          )}
        >
          <span className="font-bold">
            {selected === q?.correct ? "✅ Correct! " : "❌ Not quite. "}
          </span>
          {q?.explanation}
        </div>
      )}

      {answered && (
        <button className="btn-primary animate-fade-up" onClick={handleNext}>
          {isLast ? "See my results 🎉" : "Next question →"}
        </button>
      )}
    </div>
  );
        }
