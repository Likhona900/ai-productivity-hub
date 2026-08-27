import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Mail, RefreshCw, Sparkles, Trash2, TriangleAlert } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/app-shell";
import { AiDisclaimer, CopyButton, EmptyState } from "@/components/output-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { generateEmail, type Tone } from "@/lib/mock-ai";

export const Route = createFileRoute("/email-generator")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      {
        name: "description",
        content:
          "Turn short bullet points into a polished workplace email with formal, friendly or persuasive tone.",
      },
      { property: "og:title", content: "Smart Email Generator — Workplace AI" },
      {
        property: "og:description",
        content: "Draft professional workplace emails in seconds and edit them before sending.",
      },
    ],
  }),
  component: EmailGenerator,
});

const tones: { value: Tone; label: string; hint: string }[] = [
  { value: "formal", label: "Formal", hint: "Clients, execs, HR" },
  { value: "friendly", label: "Friendly", hint: "Teammates, peers" },
  { value: "persuasive", label: "Persuasive", hint: "Proposals, buy-in" },
];

function EmailGenerator() {
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [instructions, setInstructions] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    setLoading(true);
    setError("");
    try {
      const text = await generateEmail({ purpose, recipient, keyPoints, instructions, tone });
      setOutput(text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setOutput("");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setPurpose("");
    setRecipient("");
    setKeyPoints("");
    setInstructions("");
    setOutput("");
    setError("");
  };

  return (
    <AppShell
      title="Smart Email Generator"
      description="Describe what the email needs to do, choose a tone, and get a draft you can edit and send."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-panel p-6">
          <h2 className="font-display text-base font-semibold">Email brief</h2>
          <div className="mt-5 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="purpose">Email purpose</Label>
              <Input
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Request a deadline extension for the Q3 report"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient / context</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. Priya, my line manager — she prefers short updates"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Key points</Label>
              <Textarea
                id="points"
                rows={5}
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder={"One point per line, e.g.\nData import took longer than expected\nDraft ready by Thursday\nHappy to share a partial version now"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Additional instructions</Label>
              <Textarea
                id="instructions"
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Keep it under 120 words and end with a clear ask"
              />
            </div>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Tone</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {tones.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTone(t.value)}
                    aria-pressed={tone === t.value}
                    className={cn(
                      "rounded-xl border px-3 py-2.5 text-left transition-colors",
                      tone === t.value
                        ? "border-primary bg-primary-soft"
                        : "border-border hover:bg-secondary",
                    )}
                  >
                    <span className="block text-sm font-medium">{t.label}</span>
                    <span className="block text-xs text-muted-foreground">{t.hint}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            {error && (
              <p
                role="alert"
                className="flex items-start gap-2 rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
              >
                <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {error}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <Button onClick={run} disabled={loading}>
                {loading ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Sparkles className="size-4" aria-hidden="true" />
                )}
                {loading ? "Generating…" : "Generate email"}
              </Button>
              <Button variant="ghost" onClick={clearAll} disabled={loading}>
                <Trash2 className="size-4" /> Clear
              </Button>
            </div>
          </div>
        </section>

        <section className="surface-panel flex flex-col p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-semibold">Generated email</h2>
              <p className="text-xs text-muted-foreground">Fully editable before you send it.</p>
            </div>
            <div className="flex gap-2">
              <CopyButton value={output} />
              <Button
                variant="outline"
                size="sm"
                onClick={run}
                disabled={loading || !output}
                aria-label="Regenerate email"
              >
                <RefreshCw className={cn("size-4", loading && "animate-spin")} /> Regenerate
              </Button>
            </div>
          </div>

          <div className="mt-4 flex-1">
            {loading && !output ? (
              <div className="space-y-3" aria-live="polite">
                {[92, 78, 96, 64, 88, 70].map((w, i) => (
                  <div
                    key={i}
                    className="h-4 animate-pulse rounded-full bg-secondary"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            ) : output ? (
              <Textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                aria-label="Generated email (editable)"
                className="min-h-[420px] resize-y font-sans text-sm leading-relaxed"
              />
            ) : (
              <EmptyState
                icon={<Mail className="size-5" />}
                title="No draft yet"
                description="Fill in the brief on the left and select a tone — your email will appear here."
              />
            )}
          </div>

          <AiDisclaimer />
        </section>
      </div>
    </AppShell>
  );
}
