import { createFileRoute, Link } from "@tanstack/react-router";
import { EyeOff, Lock, ShieldCheck, TriangleAlert, UserCheck } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About & Responsible AI — Workplace AI" },
      {
        name: "description",
        content:
          "How this AI workplace productivity prototype works, and the responsible-AI guidelines for reviewing outputs and protecting sensitive information.",
      },
      { property: "og:title", content: "About & Responsible AI — Workplace AI" },
      {
        property: "og:description",
        content:
          "Responsible AI guidance: review every output and never enter confidential company information.",
      },
    ],
  }),
  component: About,
});

const principles = [
  {
    icon: UserCheck,
    title: "You stay the decision-maker",
    body: "Every output is a draft. Read it, edit it, and take responsibility for what you send — the assistant supports your judgement, it doesn't replace it.",
  },
  {
    icon: Lock,
    title: "Keep sensitive information out",
    body: "Avoid entering confidential, sensitive or private company information — including client data, personal details, credentials, contracts, salaries or unreleased plans.",
  },
  {
    icon: EyeOff,
    title: "Nothing is stored",
    body: "This prototype runs entirely in your browser. There is no account, no database and no server — refreshing the page clears everything you typed.",
  },
  {
    icon: TriangleAlert,
    title: "Check facts, names and dates",
    body: "AI drafts can sound confident while being wrong. Verify figures, deadlines, names and any commitment before it leaves your desk.",
  },
] as const;

function About() {
  return (
    <AppShell
      title="About & Responsible AI"
      description="What this assistant is, how it works, and how to use AI safely at work."
    >
      <section className="surface-panel border-accent/40 p-6 sm:p-8">
        <span className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-display text-lg font-semibold">Responsible AI disclaimer</h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed">
          AI-generated content may contain mistakes. Always review and verify AI outputs before
          using them for important workplace decisions or communication.
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          You should also avoid entering confidential, sensitive or private company information into
          any AI tool — including this one. Use placeholders such as "Client A" or "Project X" and
          fill in real details yourself once the draft is ready.
        </p>
      </section>

      <section className="mt-6 grid gap-5 sm:grid-cols-2">
        {principles.map(({ icon: Icon, title, body }) => (
          <article key={title} className="surface-panel p-6">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-display text-base font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </article>
        ))}
      </section>

      <section className="surface-panel mt-6 p-6 sm:p-8">
        <h2 className="font-display text-lg font-semibold">About this prototype</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Workplace AI is a frontend-only demonstration of how an AI productivity platform could
          support everyday professional writing. The three tools — Smart Email Generator, Meeting
          Notes Summarizer and AI Workplace Chat — use sample response logic that runs locally in
          your browser, so you can explore the full experience without an account, a subscription or
          any setup.
        </p>
        <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <li>• No sign-up, login or user profiles</li>
          <li>• No database and no server-side processing</li>
          <li>• Mock AI responses for demonstration purposes</li>
          <li>• Every generated output is editable and copyable</li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/">Back to dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/chat">Try the AI chat</Link>
          </Button>
        </div>
      </section>
    </AppShell>
  );
}
