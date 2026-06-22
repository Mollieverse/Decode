import type { DecodeResult, Level } from "./types";

// ── Core fetch wrapper ────────────────────────────────────────────────────────
async function claudeCall(system: string, user: string): Promise<string> {
  const res = await fetch("/api/decode", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, user }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data.text as string;
}

async function claudeJSON<T>(system: string, user: string): Promise<T> {
  const raw = await claudeCall(system, user);
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean) as T;
}

// ── Document analysis ─────────────────────────────────────────────────────────
export async function analyzeDocument(
  textSnippet: string,
  fileName: string
): Promise<DecodeResult> {
  return claudeJSON<DecodeResult>(
    `You are Dex, an AI that makes complex documents simple. 
     Return ONLY valid JSON — no markdown, no preamble, no explanation.
     All text must be friendly, warm, and easy to understand.`,
    `Analyze this document and return a JSON object with EXACTLY these keys:
{
  "id":           "unique short id (8 chars)",
  "title":        "inferred document title",
  "pages":        estimated_page_count_integer,
  "wordCount":    estimated_word_count_integer,
  "summary":      "2-sentence plain-English summary",
  "explanations": {
    "Age 12": "conversational plain-English explanation in 2–3 paragraphs, like talking to a smart 12-year-old"
  },
  "takeaways": [
    "takeaway 1 (one clear sentence)",
    "takeaway 2",
    "takeaway 3",
    "takeaway 4",
    "takeaway 5"
  ],
  "whyItMatters": "1–2 sentences on real-world importance and why the reader should care",
  "quiz": [
    { "question": "...", "options": ["A","B","C","D"], "correct": 0, "explanation": "why this answer is correct" },
    { "question": "...", "options": ["A","B","C","D"], "correct": 1, "explanation": "..." },
    { "question": "...", "options": ["A","B","C","D"], "correct": 2, "explanation": "..." },
    { "question": "...", "options": ["A","B","C","D"], "correct": 0, "explanation": "..." },
    { "question": "...", "options": ["A","B","C","D"], "correct": 3, "explanation": "..." }
  ],
  "createdAt": "${new Date().toISOString()}"
}

File name: "${fileName}"
Document content:
${textSnippet}`
  );
}

// ── Level explanation ──────────────────────────────────────────────────────────
const LEVEL_PERSONAS: Record<Level, string> = {
  "Age 8":   "a curious, smart 8-year-old. Use very simple words, short sentences, and fun analogies. No jargon at all.",
  "Age 12":  "a smart 12-year-old. Use plain, conversational language and relatable examples.",
  "College": "a college student. Use moderate academic language with some technical terms explained briefly.",
  "Expert":  "a domain expert. Use precise technical terminology without over-explaining basics.",
};

export async function fetchLevelExplanation(
  summary: string,
  level: Level
): Promise<string> {
  return claudeCall(
    `You are Dex, a warm and intelligent AI tutor. 
     Respond ONLY with the explanation text — no intro, no sign-off.
     2–3 paragraphs maximum.`,
    `Explain this document to ${LEVEL_PERSONAS[level]}

Document summary: ${summary}`
  );
}
