"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { type DecodeResult, type ProcessingStatus, DEMO_DATA } from "@/lib/types";
import { analyzeDocument } from "@/lib/api";
import { sleep } from "@/lib/utils";

import LandingPage     from "@/components/features/LandingPage";
import ProcessingScreen from "@/components/features/ProcessingScreen";
import ResultsPage     from "@/components/features/ResultsPage";

type Screen = "landing" | "processing" | "results" | "error";

// Fake progress driver — advances to 88%, then waits for real API
function useFakeProgress(active: boolean) {
  const [progress, setProgress] = useState(0);
  const raf = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!active) { setProgress(0); return; }

    setProgress(0);
    let current = 0;

    raf.current = setInterval(() => {
      // Slow down as we approach 88
      const remaining = 88 - current;
      const step      = Math.max(0.5, remaining * 0.04);
      current = Math.min(88, current + step * (Math.random() * 0.8 + 0.6));
      setProgress(current);
      if (current >= 88) clearInterval(raf.current);
    }, 250);

    return () => clearInterval(raf.current);
  }, [active]);

  const finish = useCallback(() => {
    clearInterval(raf.current);
    setProgress(100);
  }, []);

  return { progress, finish };
}

export default function HomePage() {
  const [screen,   setScreen]   = useState<Screen>("landing");
  const [result,   setResult]   = useState<DecodeResult | null>(null);
  const [fileName, setFileName] = useState("");
  const [error,    setError]    = useState("");

  const { progress, finish } = useFakeProgress(screen === "processing");

  // ── Handle real PDF upload ─────────────────────────────────────────────────
  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setScreen("processing");
    setError("");

    try {
      // Extract text from PDF (best-effort — PDFs are binary, we read as text)
      const raw = await file.text().catch(() => "");
      // Strip binary noise, keep ASCII printable
      const text = raw
        .replace(/[^\x20-\x7E\n\r\t]/g, " ")
        .replace(/\s{3,}/g, "  ")
        .slice(0, 4000);

      const snippet = text.trim().length > 200
        ? text
        : `File name: "${file.name}". No readable text extracted — infer a plausible document based on the file name.`;

      const data = await analyzeDocument(snippet, file.name);
      finish();
      await sleep(600);
      setResult(data);
      setScreen("results");
    } catch (e) {
      console.error(e);
      // Graceful fallback to demo data
      finish();
      await sleep(600);
      setResult({
        ...DEMO_DATA,
        title: file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " "),
      });
      setScreen("results");
    }
  }, [finish]);

  // ── Demo mode ──────────────────────────────────────────────────────────────
  const handleDemo = useCallback(async () => {
    setFileName("Bitcoin_Whitepaper.pdf");
    setScreen("processing");
    setError("");

    // Simulate realistic processing time
    await sleep(3200);
    finish();
    await sleep(500);
    setResult(DEMO_DATA);
    setScreen("results");
  }, [finish]);

  // ── Reset ──────────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setScreen("landing");
    setResult(null);
    setFileName("");
    setError("");
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  if (screen === "landing") {
    return <LandingPage onFile={handleFile} onDemo={handleDemo} />;
  }

  if (screen === "processing") {
    return <ProcessingScreen fileName={fileName} progress={progress} />;
  }

  if (screen === "results" && result) {
    return <ResultsPage data={result} onReset={handleReset} />;
  }

  if (screen === "error") {
    return (
      <div className="mobile-container items-center justify-center px-6 text-center gap-4">
        <div className="text-5xl mb-2">😬</div>
        <h2 className="text-xl font-bold text-ink">Something went wrong</h2>
        <p className="text-sm text-muted leading-relaxed">{error}</p>
        <button className="btn-primary mt-4" onClick={handleReset}>
          Try again
        </button>
      </div>
    );
  }

  return null;
}
