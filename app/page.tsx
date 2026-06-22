"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { type DecodeResult, type ProcessingStatus, DEMO_DATA } from "@/lib/types";
import { analyzeDocument } from "@/lib/api";
import { sleep } from "@/lib/utils";
import { supabase, saveDocument, saveExplanation } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

import LandingPage      from "@/components/features/LandingPage";
import ProcessingScreen from "@/components/features/ProcessingScreen";
import ResultsPage      from "@/components/features/ResultsPage";

type Screen = "landing" | "processing" | "results" | "error";

function useFakeProgress(active: boolean) {
  const [progress, setProgress] = useState(0);
  const raf = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!active) { setProgress(0); return; }
    setProgress(0);
    let current = 0;
    raf.current = setInterval(() => {
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
  const [user,     setUser]     = useState<User | null>(null);

  const { progress, finish } = useFakeProgress(screen === "processing");

  // ── Auth state listener ────────────────────────────────────────────────────
  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Handle real PDF upload ─────────────────────────────────────────────────
  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setScreen("processing");
    setError("");

    try {
      const raw     = await file.text().catch(() => "");
      const text    = raw
        .replace(/[^\x20-\x7E\n\r\t]/g, " ")
        .replace(/\s{3,}/g, "  ")
        .slice(0, 4000);

      const snippet = text.trim().length > 200
        ? text
        : `File name: "${file.name}". No readable text extracted — infer a plausible document based on the file name.`;

      const data = await analyzeDocument(snippet, file.name);

      // Save to Supabase if user is logged in
      if (user) {
        try {
          const doc = await saveDocument(user.id, {
            title:          data.title,
            pages:          data.pages,
            word_count:     data.wordCount,
            summary:        data.summary,
            why_it_matters: data.whyItMatters,
            takeaways:      data.takeaways,
          });
          // Save Age 12 explanation
          if (data.explanations?.["Age 12"]) {
            await saveExplanation(doc.id, "Age 12", data.explanations["Age 12"]);
          }
        } catch (e) {
          console.error("Failed to save document:", e);
        }
      }

      finish();
      await sleep(600);
      setResult(data);
      setScreen("results");
    } catch (e) {
      console.error(e);
      finish();
      await sleep(600);
      setResult({
        ...DEMO_DATA,
        title: file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " "),
      });
      setScreen("results");
    }
  }, [finish, user]);

  // ── Demo mode ──────────────────────────────────────────────────────────────
  const handleDemo = useCallback(async () => {
    setFileName("Bitcoin_Whitepaper.pdf");
    setScreen("processing");
    setError("");
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

  // ── Sign out ───────────────────────────────────────────────────────────────
  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  if (screen === "landing") {
    return (
      <LandingPage
        onFile={handleFile}
        onDemo={handleDemo}
        user={user}
        onSignOut={handleSignOut}
      />
    );
  }

  if (screen === "processing") {
    return <ProcessingScreen fileName={fileName} progress={progress} />;
  }

  if (screen === "results" && result) {
    return (
      <ResultsPage
        data={result}
        onReset={handleReset}
        user={user}
      />
    );
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
