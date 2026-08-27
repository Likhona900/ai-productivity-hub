import { createFileRoute } from "@tanstack/react-router";
import { FileText, Loader2, RefreshCw, Sparkles, Trash2, TriangleAlert, Wand2 } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/app-shell";
import { AiDisclaimer, CopyButton, EditableSection, EmptyState } from "@/components/output-panel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { sampleMeetingNotes, summarizeMeeting, type MeetingSummary } from "@/lib/mock-ai";

export const Route = createFileRoute("/meeting-summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI" },
      {
        name: "description",
        content:
          "Paste raw meeting notes and get a structured summary with key points, action items, decisions and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Workplace AI" },
      {
        property: "og:description",
        content: "Turn messy meeting notes into a clear, editable summary in seconds.",
      },
    ],
  }),
  component: MeetingSummarizer,
});

function MeetingSummarizer() {
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<MeetingSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    setLoading(true);
    setError("");
    try {
      setResult(await summarizeMeeting(notes));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setNotes("");
    setResult(null);
    setError("");
  };

  const combined = result
    ? [
        `SUMMARY\n${result.summary}`,
        `KEY POINTS\n${result.keyPoints}`,
        `ACTION ITEMS\n${result.actionItems}`,
        `DECISIONS\n${result.decisions}`,
        `DEADLINES\n${result.deadlines}`,
      ].join("\n\n")
    : "";

  const update = (key: keyof MeetingSummary) => (value: string) =>
    setResult((prev) => (prev ? { ...prev, [key]: value } : prev));

  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="Paste the notes you scribbled during the meeting and get a structured, editable recap you can share."
    >
      <section className="surface-panel p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <Label htmlFor="notes">Meeting notes</Label>
            <p className="text-xs text-muted-foreground">
              Rough bullets are fine — one thought per line works best.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setNotes(sampleMeetingNotes)}>
            <Wand2 className="size-4" /> Load sample notes
          </Button>
        </div>
        <Textarea
          id="notes"
          rows={10}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={"e.g.\nQ3 planning sync — Alex, Priya, Marco\nDesign review complete\nDana will draft customer comms by Friday\nDecided to ship behind a feature flag"}
          className="mt-4 text-sm leading-relaxed"
        />

        {error && (
          <p
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
          >
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={run} disabled={loading}>
            {loading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles className="size-4" aria-hidden="true" />
            )}
            {loading ? "Summarising…" : "Summarize meeting"}
          </Button>
          <Button variant="outline" onClick={run} disabled={loading || !result}>
            <RefreshCw className={cn("size-4", loading && "animate-spin")} /> Regenerate
          </Button>
          <Button variant="ghost" onClick={clearAll} disabled={loading}>
            <Trash2 className="size-4" /> Clear
          </Button>
        </div>
      </section>

      <section className="surface-panel mt-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-semibold">Structured recap</h2>
            <p className="text-xs text-muted-foreground">
              Every section is editable — tidy it up before sharing.
            </p>
          </div>
          <CopyButton value={combined} label="Copy all" />
        </div>

        <div className="mt-5">
          {loading && !result ? (
            <div className="space-y-4" aria-live="polite">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-border p-4">
                  <div className="h-3 w-28 animate-pulse rounded-full bg-secondary" />
                  <div className="mt-3 space-y-2">
                    <div className="h-3 w-full animate-pulse rounded-full bg-secondary" />
                    <div className="h-3 w-4/5 animate-pulse rounded-full bg-secondary" />
                  </div>
                </div>
              ))}
            </div>
          ) : result ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="lg:col-span-2">
                <EditableSection
                  label="Summary"
                  hint="The meeting in a short paragraph"
                  value={result.summary}
                  onChange={update("summary")}
                  rows={4}
                />
              </div>
              <EditableSection
                label="Key points"
                value={result.keyPoints}
                onChange={update("keyPoints")}
                rows={6}
              />
              <EditableSection
                label="Action items"
                hint="Who does what next"
                value={result.actionItems}
                onChange={update("actionItems")}
                rows={6}
              />
              <EditableSection
                label="Decisions"
                value={result.decisions}
                onChange={update("decisions")}
                rows={5}
              />
              <EditableSection
                label="Deadlines"
                value={result.deadlines}
                onChange={update("deadlines")}
                rows={5}
              />
            </div>
          ) : (
            <EmptyState
              icon={<FileText className="size-5" />}
              title="Nothing summarised yet"
              description="Paste your notes above (or load the sample) and press Summarize meeting."
            />
          )}
        </div>

        <AiDisclaimer />
      </section>
    </AppShell>
  );
}
