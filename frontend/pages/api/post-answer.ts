import type { NextApiRequest, NextApiResponse } from "next";

const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { questionId, answer_text } = req.body as { questionId?: number | string; answer_text?: string };

    if (!questionId || !answer_text?.trim()) {
      return res.status(400).json({ error: "questionId and answer_text are required" });
    }

    // ВАЖНО: этот эндпоинт должен существовать в бэке
    // Вариант A (логичный): POST /questions/{id}/answers
    const r = await fetch(`${apiUrl}/questions/${questionId}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer_text }),
    });

    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      return res.status(r.status).json({ error: data?.detail || data?.error || "Backend error" });
    }

    return res.status(200).json({ ok: true, data });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "post failed" });
  }
}
