import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MODEL = "google/gemini-3.7-flash";

async function callGateway(messages: { role: string; content: string }[]): Promise<string> {
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

function extractJson(text: string): unknown {
  const cleaned = text
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  return JSON.parse(start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned);
}

const EmailInput = z.object({
  purpose: z.string(),
  recipient: z.string(),
  keyPoints: z.string(),
  instructions: z.string(),
  tone: z.enum(["formal", "friendly", "persuasive"]),
});

export const generateEmailAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    if (!data.purpose.trim()) {
      throw new Error("Please describe the purpose of the email before generating.");
    }

    const text = await callGateway([
      {
        role: "system",
        content:
          "You are an expert workplace communication assistant. Write complete, ready-to-send business emails. " +
          "Start with a 'Subject: ...' line, then the greeting, body and sign-off. " +
          "Use plain text (no markdown formatting or code fences). Be specific, natural and concise — never generic filler.",
      },
      {
        role: "user",
        content: [
          `Tone: ${data.tone}`,
          `Purpose: ${data.purpose}`,
          data.recipient.trim() && `Recipient / context: ${data.recipient}`,
          data.keyPoints.trim() && `Key points to cover:\n${data.keyPoints}`,
          data.instructions.trim() && `Additional instructions: ${data.instructions}`,
          "Write the email now.",
        ]
          .filter(Boolean)
          .join("\n\n"),
      },
    ]);

    return { text };
  });

const NotesInput = z.object({ notes: z.string() });

export const summarizeMeetingAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => NotesInput.parse(input))
  .handler(async ({ data }) => {
    const notes = data.notes.trim();
    if (notes.length < 40) {
      throw new Error("Please paste at least a few lines of meeting notes to summarise.");
    }

    const raw = await callGateway([
      {
        role: "system",
        content:
          "You summarise workplace meeting notes. Respond with JSON only, no markdown fences, using exactly these keys: " +
          '"summary" (a short paragraph), "keyPoints", "actionItems", "decisions", "deadlines". ' +
          "The last four are plain-text strings with one bullet per line starting with '• '. " +
          "Action items name the owner where known. Only use information present in the notes; if a section has nothing, say so briefly.",
      },
      { role: "user", content: `Meeting notes:\n\n${notes}` },
    ]);

    const parsed = z
      .object({
        summary: z.string(),
        keyPoints: z.string(),
        actionItems: z.string(),
        decisions: z.string(),
        deadlines: z.string(),
      })
      .parse(extractJson(raw));

    return parsed;
  });

const ChatInput = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })),
});

export const chatReplyAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const text = await callGateway([
      {
        role: "system",
        content:
          "You are an AI workplace productivity assistant helping professionals with emails, meetings, status updates, " +
          "planning and productivity habits. Be practical, specific and concise. Use short paragraphs, numbered steps or " +
          "bullets, and **bold** only for short labels. Never invent confidential details.",
      },
      ...data.messages.slice(-12),
    ]);

    return { text };
  });
