"use client";

import { LEVELS, type Level } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LevelSelectorProps {
  active:   Level;
  onChange: (level: Level) => void;
  loading?: boolean;
}

export function LevelSelector({ active, onChange, loading }: LevelSelectorProps) {
  return (
    <div>
      <p className="section-label mb-2.5">Understanding level</p>
      <div className="seg-control">
        {LEVELS.map(l => (
          <button
            key={l.id}
            className={cn("seg-btn", active === l.id && "active")}
            onClick={() => onChange(l.id)}
            disabled={loading}
            aria-pressed={active === l.id}
          >
            <span className="text-lg leading-none">{l.emoji}</span>
            <span>{l.short}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
