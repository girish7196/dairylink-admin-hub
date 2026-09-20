import { cn } from "@/lib/utils";
import { titleCase } from "@/data/demo";

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

const toneMap: Record<string, Tone> = {
  active: "success",
  paid: "success",
  excellent: "success",
  completed: "success",
  good: "info",
  processing: "info",
  read: "neutral",
  average: "warning",
  pending: "warning",
  suspended: "warning",
  unread: "warning",
  inactive: "neutral",
  rejected: "danger",
  failed: "danger",
};

const toneClass: Record<Tone, string> = {
  success: "bg-success/12 text-success border-success/25",
  warning: "bg-warning/18 text-warning-foreground border-warning/35 dark:text-warning",
  danger: "bg-destructive/12 text-destructive border-destructive/25",
  info: "bg-info/12 text-info border-info/25",
  neutral: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({
  value,
  label,
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const tone = toneMap[value] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        toneClass[tone],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label ?? titleCase(value)}
    </span>
  );
}
