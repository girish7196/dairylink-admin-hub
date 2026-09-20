import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  delta,
  tone = "primary",
  loading = false,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  delta?: number;
  tone?: "primary" | "cream" | "info" | "warning";
  loading?: boolean;
}) {
  const toneClass = {
    primary: "bg-primary-soft text-primary",
    cream: "bg-cream text-cream-foreground",
    info: "bg-info/12 text-info",
    warning: "bg-warning/18 text-warning-foreground dark:text-warning",
  }[tone];

  if (loading) {
    return (
      <div className="surface-card p-5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-4 h-7 w-32" />
        <Skeleton className="mt-3 h-3 w-20" />
      </div>
    );
  }

  return (
    <div className="surface-card p-5 transition-shadow hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className={cn("flex size-9 items-center justify-center rounded-xl", toneClass)}>
          <Icon className="size-4.5" />
        </span>
      </div>
      <p className="text-numeric mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {typeof delta === "number" && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium",
              delta >= 0 ? "text-success" : "text-destructive",
            )}
          >
            {delta >= 0 ? (
              <ArrowUpRight className="size-3.5" />
            ) : (
              <ArrowDownRight className="size-3.5" />
            )}
            {Math.abs(delta)}%
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}
