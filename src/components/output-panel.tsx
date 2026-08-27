import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={copy} disabled={!value.trim()}>
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? "Copied" : label}
    </Button>
  );
}

export function EditableSection({
  label,
  hint,
  value,
  onChange,
  rows = 5,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/60 p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-sm font-semibold">{label}</h3>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        <CopyButton value={value} />
      </div>
      <Textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`${label} (editable)`}
        className="resize-y border-0 bg-transparent p-0 text-sm leading-relaxed shadow-none focus-visible:ring-0"
      />
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-14 text-center">
      <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
        {icon}
      </span>
      <h3 className="font-display text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function AiDisclaimer() {
  return (
    <p className="mt-6 rounded-xl bg-accent-soft px-4 py-3 text-xs leading-relaxed text-secondary-foreground">
      AI-generated content may contain mistakes. Always review and verify AI outputs before using
      them for important workplace decisions or communication.
    </p>
  );
}
