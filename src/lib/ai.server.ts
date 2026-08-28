const MODEL = "google/gemini-3.7-flash";

export async function callGateway(
  messages: { role: string; content: string }[],
): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured. Please try again later.");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({ model: MODEL, messages }),
  });

  if (res.status === 429) {
    throw new Error("Too many requests right now — please wait a moment and try again.");
  }
  if (res.status === 402) {
    throw new Error("AI credits are exhausted for this workspace. Please add credits to continue.");
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`The AI service returned an error (${res.status}). ${detail.slice(0, 180)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("The AI returned an empty response. Please try again.");
  return text;
}

export function extractJson(text: string): unknown {
  const cleaned = text
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  return JSON.parse(start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned);
}
