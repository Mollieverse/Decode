"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DexMascot } from "@/components/ui/DexMascot";

interface SignupSheetProps {
  open:    boolean;
  onClose: () => void;
  trigger: "quiz" | "share" | "limit";
}

const TRIGGER_COPY = {
  quiz: {
    headline: "Save your quiz score!",
    body:     "Create a free account to track your progress, save decoded documents, and unlock unlimited uploads.",
  },
  share: {
    headline: "Share your decode!",
    body:     "Sign up to get a shareable link for this document summary — and access it anywhere.",
  },
  limit: {
    headline: "You've hit the free limit",
    body:     "You've decoded 3 documents. Sign up free to get 20 documents per month.",
  },
};

export function SignupSheet({ open, onClose, trigger }: SignupSheetProps) {
  const [mounted,  setMounted]  = useState(false);
  const [email,    setEmail]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [sent,     setSent]     = useState(false);
  const [error,    setError]    = useState("");
  const [mode,     setMode]     = useState<"options" | "email">("options");

  useEffect(() => {
    if (open) {
      setMounted(true);
      setMode("options");
      setSent(false);
      setError("");
      setEmail("");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      const t = setTimeout(() => setMounted(false), 350);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  const handleEmail = async () => {
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      setSent(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  const copy = TRIGGER_COPY[trigger];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: open ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0)" }}
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-[480px] bg-white rounded-t-3xl px-6 pt-6 pb-10 safe-bottom"
        style={{
          transform:  open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.35s cubic-bezier(0.32,0.72,0,1)",
          boxShadow:  "0 -8px 40px rgba(0,0,0,0.15)",
        }}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        {/* Dex */}
        <div className="flex justify-center mb-4">
          <DexMascot size={60} mood="excited" animate />
        </div>

        <h3 className="text-xl font-display font-black text-ink text-center mb-2 tracking-tight">
          {copy.headline}
        </h3>
        <p className="text-sm text-muted text-center mb-6 leading-relaxed">
          {copy.body}
        </p>

        {/* Sent confirmation */}
        {sent ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">📬</div>
            <p className="font-bold text-ink mb-1">Check your email!</p>
            <p className="text-sm text-muted">We sent a magic link to <strong>{email}</strong>. Tap it to sign in.</p>
            <button className="btn-ghost w-full mt-4" onClick={onClose}>Close</button>
          </div>
        ) : mode === "options" ? (
          <>
            <div className="flex flex-col gap-3 mb-4">
              <button
                className="btn-primary"
                onClick={handleGoogle}
                disabled={loading}
              >
                {loading ? "Redirecting..." : "🚀 Continue with Google"}
              </button>
              <button
                className="btn-secondary"
                onClick={() => setMode("email")}
              >
                📧 Sign up with email
              </button>
            </div>
            {error && <p className="text-xs text-red-500 text-center mb-2">{error}</p>}
            <p className="text-2xs text-ghost text-center">
              Free forever · No credit card · Cancel anytime
            </p>
            <button className="btn-ghost w-full mt-3 text-sm" onClick={onClose}>
              Maybe later
            </button>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-3 mb-4">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-purple-200
                           text-ink text-sm font-medium outline-none
                           focus:border-purple-500 transition-colors"
              />
              <button
                className="btn-primary"
                onClick={handleEmail}
                disabled={loading || !email}
              >
                {loading ? "Sending..." : "✉️ Send magic link"}
              </button>
              <button
                className="btn-ghost text-sm"
                onClick={() => setMode("options")}
              >
                ← Back
              </button>
            </div>
            {error && <p className="text-xs text-red-500 text-center">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
              }
