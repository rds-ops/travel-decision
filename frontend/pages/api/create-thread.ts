import type { NextApiRequest, NextApiResponse } from "next";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://localhost:8000";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const question_text = String(req.body?.question_text || "").trim();
  if (!question_text) return res.status(400).json({ error: "question_text is required" });

  try {
    const r = await fetch(`${API_BASE}/feed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_text }),
    });

    if (!r.ok) {
      const txt = await r.text();
      return res.status(500).send(txt);
    }

    // после создания просто редиректим на главную, чтобы лента обновилась
    res.writeHead(302, { Location: "/" });
    res.end();
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "fetch failed" });
  }
}
