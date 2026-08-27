export type Tone = "formal" | "friendly" | "persuasive";

export interface EmailRequest {
  purpose: string;
  recipient: string;
  keyPoints: string;
  instructions: string;
  tone: Tone;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function bulletify(text: string): string[] {
  return text
    .split(/\n|;|•/)
    .map((line) => line.replace(/^[-*\d.\s]+/, "").trim())
    .filter((line) => line.length > 2);
}

const openings: Record<Tone, (r: string) => string> = {
  formal: (r) => `Dear ${r || "Colleague"},\n\nI hope this message finds you well.`,
  friendly: (r) => `Hi ${r || "there"},\n\nHope your week is going well!`,
  persuasive: (r) =>
    `Hi ${r || "there"},\n\nI wanted to share something I believe will make a real difference for the team.`,
};

const closings: Record<Tone, string> = {
  formal: "Thank you for your time and consideration.\n\nKind regards,\nAlex Morgan\nOperations Lead",
  friendly: "Thanks so much — shout if anything is unclear!\n\nBest,\nAlex",
  persuasive:
    "I'd love your go-ahead so we can start this week. Happy to walk you through the details whenever suits you.\n\nBest regards,\nAlex Morgan",
};

export async function generateEmail(req: EmailRequest): Promise<string> {
  await wait(900 + Math.random() * 700);
  if (!req.purpose.trim()) {
    throw new Error("Please describe the purpose of the email before generating.");
  }

  const points = bulletify(req.keyPoints);
  const subject = `Subject: ${req.purpose.trim().replace(/\.$/, "")}`;

  const body: string[] = [
    subject,
    "",
    openings[req.tone](req.recipient.split(/[,(]/)[0]?.trim() ?? ""),
    "",
    req.tone === "persuasive"
      ? `I'm reaching out regarding ${req.purpose.trim().toLowerCase()}. Acting on this now gives us a clear head start and avoids rework later.`
      : `I'm writing regarding ${req.purpose.trim().toLowerCase()}.`,
  ];

  if (points.length) {
    body.push("", "Here are the key details:", ...points.map((p) => `• ${p}`));
  } else {
    body.push(
      "",
      "I've summarised the context below and can share supporting documents on request.",
    );
  }

  if (req.recipient.trim()) {
    body.push("", `Context: ${req.recipient.trim()}`);
  }
  if (req.instructions.trim()) {
    body.push("", `Additional note: ${req.instructions.trim()}`);
  }

  body.push(
    "",
    req.tone === "formal"
      ? "Please let me know if you require any further information or would prefer to discuss this in a short call."
      : "Let me know your thoughts — happy to jump on a quick call if that's easier.",
    "",
    closings[req.tone],
  );

  return body.join("\n");
}

export interface MeetingSummary {
  summary: string;
  keyPoints: string;
  actionItems: string;
  decisions: string;
  deadlines: string;
}

export async function summarizeMeeting(notes: string): Promise<MeetingSummary> {
  await wait(1000 + Math.random() * 700);
  const trimmed = notes.trim();
  if (trimmed.length < 40) {
    throw new Error("Please paste at least a few lines of meeting notes to summarise.");
  }

  const lines = bulletify(trimmed);
  const pick = (keywords: string[]) =>
    lines.filter((l) => keywords.some((k) => l.toLowerCase().includes(k)));

  const actions = pick(["will ", "to do", "action", "follow up", "assign", "owner", "send", "draft"]);
  const decisions = pick(["decid", "agree", "approv", "confirm", "sign off", "chose"]);
  const deadlines = pick([
    "by ",
    "due",
    "deadline",
    "friday",
    "monday",
    "week",
    "eod",
    "q1",
    "q2",
    "q3",
    "q4",
  ]);

  const fallback = lines.slice(0, 4);

  return {
    summary: `The team met to review ${lines[0]?.toLowerCase() ?? "current priorities"}. Discussion covered ${lines.length} main topics, focusing on progress since the last session, open risks, and the next steps needed to keep delivery on track. Overall sentiment was constructive, with clear ownership assigned for follow-up work.`,
    keyPoints: (lines.slice(0, 6).length ? lines.slice(0, 6) : fallback)
      .map((l) => `• ${l}`)
      .join("\n"),
    actionItems: (actions.length ? actions : fallback.slice(0, 2))
      .map((l, i) => `${i + 1}. ${l} — owner to confirm`)
      .join("\n"),
    decisions: (decisions.length
      ? decisions
      : ["Proceed with the current plan as discussed", "Revisit open items at the next check-in"]
    )
      .map((l) => `• ${l}`)
      .join("\n"),
    deadlines: (deadlines.length
      ? deadlines
      : ["Next review scheduled for the end of the week", "Status update due before the next meeting"]
    )
      .map((l) => `• ${l}`)
      .join("\n"),
  };
}

const chatReplies: { match: RegExp; reply: string }[] = [
  {
    match: /email|write to|message my/i,
    reply:
      "Here's a professional draft you can adapt:\n\n**Subject: Project Update — Week 12**\n\nHi Priya,\n\nA quick update on the onboarding revamp: the design review is complete, development starts Monday, and we're still tracking to the 14th for a first internal demo. One risk to flag — the copy review depends on the brand team's availability next week.\n\nHappy to walk you through the detail in our 1:1.\n\nBest,\nAlex\n\nTip: open the **Email Generator** tool to control tone and key points precisely.",
  },
  {
    match: /summar|notes|minutes/i,
    reply:
      "Paste your notes into the **Meeting Summarizer** and I'll split them into Summary, Key Points, Action Items, Decisions and Deadlines. A good summary usually answers three things:\n\n1. What did we agree?\n2. Who owns what next?\n3. When is it due?",
  },
  {
    match: /prepare|agenda|team meeting/i,
    reply:
      "Here's a 30-minute agenda that keeps things tight:\n\n• **0–5 min** — Context and desired outcome\n• **5–15 min** — Progress since last time (metrics, not opinions)\n• **15–25 min** — Blockers and decisions needed\n• **25–30 min** — Recap owners and deadlines\n\nSend the agenda 24 hours ahead and name a decision-maker for every open item.",
  },
  {
    match: /project update|status/i,
    reply:
      "Use this structure for a clean status update:\n\n**Status:** On track / At risk / Off track\n**Progress:** two or three concrete wins\n**Next:** what happens before the next update\n**Risks:** the issue plus the mitigation\n**Needs:** the specific help you're asking for\n\nKeep it under 150 words — stakeholders skim.",
  },
  {
    match: /productiv|focus|time manage/i,
    reply:
      "Five practical ideas that hold up in real teams:\n\n1. Protect two 90-minute deep-work blocks per day and defend them in your calendar.\n2. Default meetings to 25 or 50 minutes to build in recovery time.\n3. Write decisions down where the whole team can find them.\n4. Batch shallow work (email, approvals) into two fixed windows.\n5. Close each day with a three-item plan for tomorrow.",
  },
];

export async function chatReply(message: string): Promise<string> {
  await wait(700 + Math.random() * 600);
  const found = chatReplies.find((c) => c.match.test(message));
  if (found) return found.reply;
  return `Here's how I'd approach "${message.trim()}":\n\n1. **Clarify the outcome** — what does a good result look like for the people involved?\n2. **Gather the facts** — pull the numbers, dates and owners you already have.\n3. **Draft in one pass** — get a rough version down, then tighten the wording.\n4. **Review before sending** — check names, dates and commitments.\n\nWant me to turn this into an email, a summary or a meeting agenda? I can also help break it into smaller steps.`;
}

export const examplePrompts = [
  "Write a professional email to my manager.",
  "Summarize these meeting notes.",
  "Help me prepare for a team meeting.",
  "Create a professional project update.",
  "Give me ideas to improve workplace productivity.",
];

export const sampleMeetingNotes = `Q3 planning sync — attendees: Alex, Priya, Marco, Dana
Priya walked through the onboarding revamp; design review is complete
Marco raised that the analytics events are missing for step 3
We agreed to ship the revamp behind a feature flag first
Dana will draft the customer comms by Friday
Marco to add the missing analytics events before the demo
Decided to postpone the pricing page refresh to Q4
Next review meeting is Monday at 10:00`;

export const recentActivity = [
  {
    tool: "Email Generator",
    title: "Follow-up email to the finance team",
    detail: "Formal tone · 148 words",
    time: "12 minutes ago",
  },
  {
    tool: "Meeting Summarizer",
    title: "Q3 planning sync summary",
    detail: "5 action items · 2 decisions",
    time: "Today, 09:24",
  },
  {
    tool: "AI Workplace Chat",
    title: "Agenda for the design handover",
    detail: "6 messages",
    time: "Yesterday",
  },
  {
    tool: "Email Generator",
    title: "Client proposal follow-up",
    detail: "Persuasive tone · 190 words",
    time: "Yesterday",
  },
];
