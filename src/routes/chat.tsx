import { createFileRoute } from "@tanstack/react-router";
import { Bot, Loader2, SendHorizontal, Trash2, TriangleAlert, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { CopyButton } from "@/components/output-panel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatReplyAi } from "@/lib/ai.functions";
import { examplePrompts } from "@/lib/mock-ai";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chat — Workplace AI" },
      {
        name: "description",
        content:
          "Chat with a workplace-focused AI assistant for agendas, status updates, wording help and productivity ideas.",
      },
      { property: "og:title", content: "AI Workplace Chat — Workplace AI" },
      {
        property: "og:description",
        content: "Ask a workplace AI assistant for help with everyday professional tasks.",
      },
    ],
  }),
  component: Chat,
});

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function renderContent(content: string) {
  return content.split("\n").map((line, i) => {
    const parts = line.split(/\*\*(.+?)\*\*/g);
    return (
      <p key={i} className={line.trim() === "" ? "h-2" : "text-sm leading-relaxed"}>
        {parts.map((part, j) =>
          j % 2 === 1 ? (
            <strong key={j} className="font-semibold">
              {part}
            </strong>
          ) : (
            part
          ),
        )}
      </p>
    );
  });
}

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError("");
    setInput("");
    const next: Message[] = [
      ...messages,
      { id: `${Date.now()}-u`, role: "user", content: trimmed },
    ];
    setMessages(next);
    setLoading(true);
    try {
      const { text: reply } = await chatReplyAi({
        data: { messages: next.map(({ role, content }) => ({ role, content })) },
      });
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-a`, role: "assistant", content: reply },
      ]);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "The assistant couldn't respond. Please try sending your message again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="AI Workplace Chat"
      description="A quick thinking partner for work: agendas, tricky wording, status updates and productivity advice."
    >
      <div className="surface-panel flex h-[70vh] min-h-[520px] flex-col overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="bg-brand-gradient flex size-9 items-center justify-center rounded-xl">
              <Bot className="size-4 text-primary-foreground" aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-sm font-semibold">Workplace Assistant</p>
              <p className="text-xs text-muted-foreground">
                {loading ? "Thinking…" : "AI responses · always review before use"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setMessages([]);
              setError("");
            }}
            disabled={!messages.length || loading}
          >
            <Trash2 className="size-4" /> Clear conversation
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6" role="log" aria-live="polite">
          {messages.length === 0 && !loading ? (
            <div className="mx-auto max-w-xl text-center">
              <span className="bg-brand-gradient mx-auto flex size-12 items-center justify-center rounded-2xl shadow-soft">
                <Bot className="size-6 text-primary-foreground" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold">
                What are you working on today?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Pick an example prompt or type your own question below.
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {examplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => send(prompt)}
                    className="rounded-xl border border-border px-4 py-3 text-left text-sm transition-colors hover:border-primary hover:bg-primary-soft"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((m) =>
                m.role === "user" ? (
                  <div key={m.id} className="flex justify-end gap-3">
                    <div className="max-w-[85%] rounded-2xl bg-primary px-4 py-3 text-primary-foreground">
                      {m.content.split("\n").map((line, i) => (
                        <p key={i} className="text-sm leading-relaxed">
                          {line}
                        </p>
                      ))}
                    </div>
                    <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                      <User className="size-4" aria-hidden="true" />
                    </span>
                  </div>
                ) : (
                  <div key={m.id} className="flex gap-3">
                    <span className="bg-brand-gradient mt-1 flex size-8 shrink-0 items-center justify-center rounded-full">
                      <Bot className="size-4 text-primary-foreground" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="space-y-1 text-foreground">{renderContent(m.content)}</div>
                      <div className="mt-2">
                        <CopyButton value={m.content} />
                      </div>
                    </div>
                  </div>
                ),
              )}
              {loading && (
                <div className="flex gap-3">
                  <span className="bg-brand-gradient mt-1 flex size-8 shrink-0 items-center justify-center rounded-full">
                    <Bot className="size-4 text-primary-foreground" aria-hidden="true" />
                  </span>
                  <p className="animate-pulse text-sm text-muted-foreground">Thinking…</p>
                </div>
              )}
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border px-5 py-4">
          {error && (
            <p
              role="alert"
              className="mb-3 flex items-start gap-2 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {error}
            </p>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="flex items-end gap-3"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              rows={1}
              aria-label="Message the assistant"
              placeholder="Ask for a draft, a summary or an agenda… (Shift + Enter for a new line)"
              className="max-h-32 min-h-11 flex-1 resize-none text-sm"
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()} aria-label="Send message">
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <SendHorizontal className="size-4" />
              )}
            </Button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">
            AI-generated content may contain mistakes. Never paste confidential or sensitive company
            information.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
