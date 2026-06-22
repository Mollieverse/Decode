"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const VOICES = ["Aria", "Sage", "Nova"] as const;
type Voice = typeof VOICES[number];

const SPEEDS = [0.75, 1.0, 1.25, 1.5, 2.0] as const;

const WAVE_HEIGHTS = [
  8,18,24,30,26,20,28,32,22,16,
  28,36,30,24,18,26,34,28,22,16,
  24,30,20,14,22,28,18,12,
];

interface AudioPlayerProps {
  className?: string;
}

export function AudioPlayer({ className }: AudioPlayerProps) {
  const [playing,  setPlaying]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed,    setSpeed]    = useState<number>(1.0);
  const [voice,    setVoice]    = useState<Voice>("Aria");
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  // Simulate playback progress
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) { setPlaying(false); return 100; }
          return p + 0.3 * speed;
        });
      }, 200);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, speed]);

  const cycleSpeed = () => {
    const idx = SPEEDS.indexOf(speed as typeof SPEEDS[number]);
    setSpeed(SPEEDS[(idx + 1) % SPEEDS.length]);
  };

  const skip = (secs: number) => {
    setProgress(p => Math.max(0, Math.min(100, p + secs * 0.3)));
  };

  const voiceIcons: Record<Voice, string> = { Aria: "🎵", Sage: "🎙", Nova: "🎤" };

  return (
    <div className={cn("card-purple p-5", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-bold text-white/90">Audio Summary</p>
          <p className="text-xs text-white/55 mt-0.5">
            Voice: {voiceIcons[voice]} {voice} · ~3 min
          </p>
        </div>
        <button
          onClick={cycleSpeed}
          className="px-3 py-1 rounded-full text-xs font-bold
                     bg-white/20 text-white border border-white/20
                     hover:bg-white/30 transition-colors"
        >
          {speed}×
        </button>
      </div>

      {/* Waveform */}
      <div className="flex items-center gap-[3px] h-10 mb-4 overflow-hidden">
        {WAVE_HEIGHTS.map((h, i) => {
          const played = (i / WAVE_HEIGHTS.length) * 100 < progress;
          return (
            <div
              key={i}
              className={cn(
                "wave-bar flex-shrink-0 transition-opacity duration-200",
                played ? "opacity-100" : "opacity-40"
              )}
              style={{
                height:              playing ? `${h}px` : "6px",
                animationDelay:      `${i * 0.04}s`,
                animationPlayState:  playing ? "running" : "paused",
                background:          played
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(255,255,255,0.4)",
                transition: "height 0.3s ease",
              }}
            />
          );
        })}
      </div>

      {/* Scrubber */}
      <input
        type="range"
        min={0}
        max={100}
        value={progress}
        onChange={e => setProgress(Number(e.target.value))}
        className="audio-slider mb-4"
      />

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={() => skip(-15)}
          className="w-9 h-9 rounded-full bg-white/15 text-white text-sm font-bold
                     flex items-center justify-center hover:bg-white/25 transition-colors
                     active:scale-90"
        >
          ⏮
        </button>

        <button
          onClick={() => setPlaying(p => !p)}
          className="w-14 h-14 rounded-full bg-white text-purple-700 text-xl font-bold
                     flex items-center justify-center shadow-lg
                     hover:scale-105 active:scale-95 transition-transform"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? "⏸" : "▶"}
        </button>

        <button
          onClick={() => skip(15)}
          className="w-9 h-9 rounded-full bg-white/15 text-white text-sm font-bold
                     flex items-center justify-center hover:bg-white/25 transition-colors
                     active:scale-90"
        >
          ⏭
        </button>
      </div>

      {/* Voice selector */}
      <div className="mt-5 pt-4 border-t border-white/15">
        <p className="section-label text-white/50 mb-2.5">Voice</p>
        <div className="flex gap-2">
          {VOICES.map(v => (
            <button
              key={v}
              onClick={() => setVoice(v)}
              className={cn(
                "voice-pill transition-all duration-150",
                voice === v
                  ? "border-white bg-white/20 text-white"
                  : "border-white/25 text-white/60 hover:border-white/50"
              )}
            >
              {voiceIcons[v]} {v}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
