"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const VOICES_LABELS = ["Aria", "Sage", "Nova"] as const;
type VoiceLabel = typeof VOICES_LABELS[number];
const SPEEDS = [0.75, 1.0, 1.25, 1.5, 2.0] as const;

const WAVE_HEIGHTS = [
  8,18,24,30,26,20,28,32,22,16,
  28,36,30,24,18,26,34,28,22,16,
  24,30,20,14,22,28,18,12,
];

interface AudioPlayerProps {
  text?: string;
  className?: string;
}

export function AudioPlayer({ text, className }: AudioPlayerProps) {
  const [playing,   setPlaying]   = useState(false);
  const [speed,     setSpeed]     = useState<number>(1.0);
  const [voice,     setVoice]     = useState<VoiceLabel>("Aria");
  const [progress,  setProgress]  = useState(0);
  const [supported, setSupported] = useState(true);
  const [voices,    setVoices]    = useState<SpeechSynthesisVoice[]>([]);
  const utterRef  = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
      return;
    }
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.cancel(); clearInterval(intervalRef.current); };
  }, []);

  const getVoice = (label: VoiceLabel) => {
    const prefs: Record<VoiceLabel, string[]> = {
      Aria:  ["Google UK English Female", "Microsoft Aria", "Samantha", "en-GB"],
      Sage:  ["Google US English",        "Microsoft Guy",  "Alex",     "en-US"],
      Nova:  ["Google US English Female", "Microsoft Zira", "Victoria", "en-AU"],
    };
    const names = prefs[label];
    return (
      voices.find(v => names.some(n => v.name.includes(n))) ||
      voices.find(v => v.lang.startsWith("en")) ||
      voices[0] ||
      null
    );
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    clearInterval(intervalRef.current);
    setPlaying(false);
    setProgress(0);
  };

  const toggle = () => {
    if (!supported) return;

    if (playing) {
      window.speechSynthesis.pause();
      clearInterval(intervalRef.current);
      setPlaying(false);
      return;
    }

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setPlaying(true);
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) { stop(); return 100; }
          return p + 0.4 * speed;
        });
      }, 300);
      return;
    }

    // Fresh start
    const utter = new SpeechSynthesisUtterance(
      text || "No summary available yet. Upload a document to generate an audio summary."
    );
    utter.rate  = speed;
    utter.pitch = 1;
    const v = getVoice(voice);
    if (v) utter.voice = v;

    utter.onend = () => { setPlaying(false); setProgress(100); clearInterval(intervalRef.current); };
    utter.onerror = () => { setPlaying(false); clearInterval(intervalRef.current); };

    utterRef.current = utter;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setPlaying(true);
    setProgress(0);

    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { stop(); return 100; }
        return p + 0.4 * speed;
      });
    }, 300);
  };

  const cycleSpeed = () => {
    const idx = SPEEDS.indexOf(speed as typeof SPEEDS[number]);
    const next = SPEEDS[(idx + 1) % SPEEDS.length];
    setSpeed(next);
    if (utterRef.current) utterRef.current.rate = next;
  };

  const voiceIcons: Record<VoiceLabel, string> = { Aria: "🎵", Sage: "🎙", Nova: "🎤" };

  return (
    <div className={cn("card-purple p-5", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-bold text-white/90">Audio Summary</p>
          <p className="text-xs text-white/55 mt-0.5">
            {supported ? `Voice: ${voiceIcons[voice]} ${voice} · Browser TTS` : "Not supported in this browser"}
          </p>
        </div>
        <button onClick={cycleSpeed} className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/20 hover:bg-white/30 transition-colors">
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
              className="wave-bar flex-shrink-0"
              style={{
                height:             playing ? `${h}px` : "6px",
                animationDelay:     `${i * 0.04}s`,
                animationPlayState: playing ? "running" : "paused",
                background:         played ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.35)",
                transition:         "height 0.3s ease",
              }}
            />
          );
        })}
      </div>

      {/* Scrubber */}
      <input
        type="range" min={0} max={100} value={progress}
        onChange={e => setProgress(Number(e.target.value))}
        className="audio-slider mb-4"
      />

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button onClick={stop} className="w-9 h-9 rounded-full bg-white/15 text-white text-sm flex items-center justify-center hover:bg-white/25 transition-colors active:scale-90">
          ⏹
        </button>
        <button
          onClick={toggle}
          disabled={!supported}
          className="w-14 h-14 rounded-full bg-white text-purple-700 text-xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
        >
          {playing ? "⏸" : "▶"}
        </button>
        <button onClick={cycleSpeed} className="w-9 h-9 rounded-full bg-white/15 text-white text-xs font-bold flex items-center justify-center hover:bg-white/25 transition-colors active:scale-90">
          {speed}×
        </button>
      </div>

      {/* Voice selector */}
      <div className="mt-5 pt-4 border-t border-white/15">
        <p className="section-label text-white/50 mb-2.5">Voice</p>
        <div className="flex gap-2">
          {VOICES_LABELS.map(v => (
            <button
              key={v}
              onClick={() => { setVoice(v); stop(); }}
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
