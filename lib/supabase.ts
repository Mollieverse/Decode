import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnon);

// ── Save decoded document ─────────────────────────────────────────────────────
export async function saveDocument(userId: string, data: {
  title:         string;
  pages:         number;
  word_count:    number;
  summary:       string;
  why_it_matters:string;
  takeaways:     string[];
}) {
  const { data: doc, error } = await supabase
    .from("documents")
    .insert({ user_id: userId, ...data })
    .select()
    .single();

  if (error) throw error;
  return doc;
}

// ── Save explanation ──────────────────────────────────────────────────────────
export async function saveExplanation(documentId: string, level: string, content: string) {
  const { error } = await supabase
    .from("explanations")
    .insert({ document_id: documentId, level, content });

  if (error) throw error;
}

// ── Save quiz score ───────────────────────────────────────────────────────────
export async function saveQuizScore(userId: string, documentId: string, score: number, total: number) {
  const { error } = await supabase
    .from("quiz_scores")
    .insert({ user_id: userId, document_id: documentId, score, total });

  if (error) throw error;
}

// ── Get user documents ────────────────────────────────────────────────────────
export async function getUserDocuments(userId: string) {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
