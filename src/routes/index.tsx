import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, FileText, MessagesSquare, Sparkle, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { recentActivity } from "@/lib/mock-ai";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workplace AI — AI Productivity Assistant Dashboard" },
      {
        name: "description",
        content:
          "Draft emails, summarise meeting notes and chat with a workplace AI assistant. A polished, browser-only productivity prototype.",
      },
      { property: "og:title", content: "Workplace AI — AI Productivity Assistant Dashboard" },
      {
        property: "og:description",
        content:
          "Draft emails, summarise meeting notes and chat with a workplace AI assistant — no account needed.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email-generator",
    icon: Mail,
    title: "Smart Email Generator",
    description:
      "Turn a few bullet points into a polished email with formal, friendly or persuasive tone.",
    action: "Draft an email",
  },
  {
    to: "/meeting-summarizer",
    icon: FileText,
    title: "Meeting Notes Summarizer",
    description:
      "Paste raw notes and get a summary, key points, action items, decisions and deadlines.",
    action: "Summarise notes",
  },
  {
    to: "/chat",
    icon: MessagesSquare,
    title: "AI Workplace Chat",
    description:
      "Ask for agendas, updates, tricky wording or productivity ideas in a familiar chat interface.",
    action: "Start chatting",
  },
] as const;

const stats = [
  { label: "Tasks assisted this week", value: "24" },
  { label: "Avg. drafting time saved", value: "18 min" },
  { label: "Outputs reviewed by you", value: "100%" },
] as const;

function Dashboard() {
  return (
    <AppShell
      title="Welcome back, Amahle"
      description="Your AI assistant for everyday workplace writing — drafting, summarising and thinking through work tasks faster."
    >
      <section className="bg-brand-gradient relative overflow-hidden rounded-3xl px-6 py-8 shadow-lift sm:px-10 sm:py-10">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium text-primary-foreground">
            <Sparkle className="size-3.5" aria-hidden="true" /> Frontend demo · no sign-up required
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold text-primary-foreground sm:text-3xl">
            Get through workplace writing in minutes, not hours
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-primary-foreground/85 sm:text-base">
            Three focused tools handle the writing you do most: emails, meeting summaries and quick
            thinking-out-loud. You stay in control — every output is editable before you use it.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="secondary" size="lg">
              <Link to="/email-generator">
                Generate an email <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
            >
              <Link to="/chat">Open AI chat</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="surface-panel p-5">
            <p className="font-display text-2xl font-bold text-primary">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold">Productivity tools</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-3">
          {tools.map(({ to, icon: Icon, title, description, action }) => (
            <article key={to} className="surface-panel flex flex-col p-6 transition-shadow hover:shadow-lift">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
              <Button asChild className="mt-5 w-full">
                <Link to={to}>{action}</Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="surface-panel p-6">
          <h2 className="font-display text-lg font-semibold">Recent activity</h2>
          <p className="text-sm text-muted-foreground">Example tasks from this demo workspace.</p>
          <ul className="mt-4 divide-y divide-border">
            {recentActivity.map((item) => (
              <li key={item.title} className="flex flex-wrap items-start justify-between gap-2 py-3">
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.tool} · {item.detail}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="surface-panel flex flex-col p-6">
          <span className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-display text-lg font-semibold">Responsible AI</h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            AI-generated content may contain mistakes. Always review and verify AI outputs before
            using them for important workplace decisions or communication. Avoid entering
            confidential, sensitive or private company information.
          </p>
          <Button asChild variant="outline" className="mt-5">
            <Link to="/about">Read the guidelines</Link>
          </Button>
        </div>
      </section>
    </AppShell>
  );
}
