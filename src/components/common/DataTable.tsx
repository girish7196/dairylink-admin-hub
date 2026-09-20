import { useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
  hideOn?: "sm" | "md" | "lg";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  pageSize?: number;
  onRowClick?: (row: T) => void;
}

const hideClass = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
} as const;

const alignClass = { left: "text-left", right: "text-right", center: "text-center" } as const;

export function DataTable<T>({
  columns,
  data,
  rowKey,
  loading = false,
  error = null,
  onRetry,
  emptyTitle = "Nothing here yet",
  emptyDescription = "Records will appear here once they are added.",
  emptyAction,
  pageSize = 10,
  onRowClick,
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(data.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const rows = useMemo(
    () => data.slice(safePage * pageSize, safePage * pageSize + pageSize),
    [data, safePage, pageSize],
  );

  return (
    <div className="surface-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-muted/60">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap",
                    alignClass[c.align ?? "left"],
                    c.hideOn && hideClass[c.hideOn],
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={`sk-${i}`} className="border-b last:border-0">
                  {columns.map((c) => (
                    <td key={c.key} className={cn("px-4 py-3", c.hideOn && hideClass[c.hideOn])}>
                      <Skeleton className="h-4 w-full max-w-28" />
                    </td>
                  ))}
                </tr>
              ))}

            {!loading && error && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-14 text-center">
                  <p className="font-medium text-destructive">{error}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    The records could not be loaded.
                  </p>
                  {onRetry && (
                    <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
                      Try again
                    </Button>
                  )}
                </td>
              </tr>
            )}

            {!loading && !error && rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Inbox className="size-5" />
                  </div>
                  <p className="mt-3 font-medium">{emptyTitle}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{emptyDescription}</p>
                  {emptyAction && <div className="mt-4">{emptyAction}</div>}
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "border-b last:border-0 transition-colors",
                    onRowClick && "cursor-pointer hover:bg-primary-soft/50",
                  )}
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn(
                        "px-4 py-3 align-middle whitespace-nowrap",
                        alignClass[c.align ?? "left"],
                        c.hideOn && hideClass[c.hideOn],
                        c.className,
                      )}
                    >
                      {c.render ? c.render(row) : ((row as Record<string, ReactNode>)[c.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!loading && !error && data.length > pageSize && (
        <div className="flex items-center justify-between gap-3 border-t px-4 py-3 text-sm">
          <p className="text-muted-foreground">
            Showing {safePage * pageSize + 1}–{Math.min((safePage + 1) * pageSize, data.length)} of{" "}
            {data.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={safePage === 0}
              onClick={() => setPage(safePage - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-numeric text-muted-foreground">
              {safePage + 1} / {pageCount}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage(safePage + 1)}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
