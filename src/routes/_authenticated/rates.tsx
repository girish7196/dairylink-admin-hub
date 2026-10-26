import { useState } from "react";
import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarClock, Milk, Plus } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader, SectionCard } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { EntityFormDialog } from "@/components/forms/EntityFormDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { insertMilkRate, latestEffectiveRate, localDate, milkRatesQueryOptions, type MilkRateRow } from "@/data/milk-rates";

export const Route = createFileRoute("/rates")({
  head: () => ({
    meta: [
      { title: "Milk Rates — DairyLink Admin" },
      {
        name: "description",
        content: "Current cow and buffalo milk rates with fat and SNF bonus values and rate revision history.",
      },
      { property: "og:title", content: "Milk Rates — DairyLink Admin" },
      {
        property: "og:description",
        content: "Publish rate revisions and review the society's milk rate history.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RatesPage,
});

function RatesPage() {
  return <AdminLayout><ClientOnly fallback={<RatesLoading />}><ConnectedRates /></ClientOnly></AdminLayout>;
}

function RatesLoading() {
  return <div role="status" aria-label="Loading milk rates" className="space-y-5"><PageHeader title="Milk rates" description="Base rates and quality bonuses used to price every collection entry" /><div className="grid gap-5 lg:grid-cols-2"><Skeleton className="h-64 w-full" /><Skeleton className="h-64 w-full" /></div></div>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value.slice(0, 10)}T00:00:00`));
}

function ConnectedRates() {
  const [open, setOpen] = useState(false);
  const today = localDate();
  const queryClient = useQueryClient();
  const query = useQuery(milkRatesQueryOptions());
  const rows = query.data ?? [];
  const current = latestEffectiveRate(rows, today);
  const mutation = useMutation({
    mutationFn: insertMilkRate,
    onSuccess: () => {
      toast.success("Rate revision saved");
      void queryClient.invalidateQueries({ queryKey: ["external-milk-rates"] });
    },
  });

  const columns: Column<MilkRateRow>[] = [
    {
      key: "cow_rate_per_litre",
      header: "Cow base rate",
      align: "right",
      render: (r) => <span className="text-numeric">₹{r.cow_rate_per_litre.toFixed(2)}</span>,
    },
    {
      key: "buffalo_rate_per_litre",
      header: "Buffalo base rate",
      align: "right",
      render: (r) => <span className="text-numeric">₹{r.buffalo_rate_per_litre.toFixed(2)}</span>,
    },
    {
      key: "fatBonus",
      header: "Fat bonus",
      align: "right",
      render: (r) => <span className="text-numeric">₹{r.fat_bonus_per_percent.toFixed(2)}</span>,
    },
    {
      key: "snfBonus",
      header: "SNF bonus",
      align: "right",
      render: (r) => <span className="text-numeric">₹{r.snf_bonus_per_percent.toFixed(2)}</span>,
    },
    { key: "effective_from", header: "Effective from", render: (r) => formatDate(r.effective_from) },
    {
      key: "current",
      header: "",
      align: "right",
      render: (r) =>
        r.id === current?.id ? <Badge>Current</Badge> : <Badge variant="secondary">{r.effective_from.slice(0, 10) > today ? "Scheduled" : "Superseded"}</Badge>,
    },
  ];

  return (
    <>
      <PageHeader
        title="Milk rates"
        description="Base rates and quality bonuses used to price every collection entry"
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-1.5 size-4" /> Add rate revision
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {query.isPending ? <><Skeleton className="h-64 w-full" /><Skeleton className="h-64 w-full" /></> : <>
          <RateCard rate={query.isError ? undefined : current} title="Cow milk" milkType="cow" />
          <RateCard rate={query.isError ? undefined : current} title="Buffalo milk" milkType="buffalo" />
        </>}
      </div>
      {query.isError ? <div role="alert" className="mt-4 text-sm text-destructive"><p>{query.error.message}</p><Button variant="outline" className="mt-3" onClick={() => void query.refetch()} disabled={query.isFetching}>Try again</Button></div> : !query.isPending && !current ? <p className="mt-4 text-sm text-muted-foreground">No milk rate is effective as of {formatDate(today)}.</p> : null}

      <SectionCard
        title="How payable rate is calculated"
        description="Applied automatically to each collection entry"
      >
        <div className="rounded-xl bg-muted p-4 text-sm leading-relaxed">
          <p className="text-numeric">
            Payable rate = Base rate + (Fat − standard fat) × Fat bonus + (SNF − 8.5) × SNF bonus
          </p>
          <p className="mt-2 text-muted-foreground">
            Standard fat is 3.5% for cow milk and 6.0% for buffalo milk. Amounts are rounded to two
            decimals before the litre multiplication.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Rate history" description="All published revisions, newest first">
        <DataTable
          columns={columns}
          data={rows}
          loading={query.isPending}
          error={query.error?.message ?? null}
          onRetry={() => void query.refetch()}
          rowKey={(r) => r.id}
          pageSize={8}
          emptyTitle="No rate revisions yet"
          emptyDescription="Published rates will be listed here."
        />
      </SectionCard>

      <EntityFormDialog
        open={open}
        onOpenChange={setOpen}
        title="Add rate revision"
        description="The new rate applies from the effective date onwards."
        submitLabel="Publish rate"
        initialValues={{ effective_from: today }}
        onSubmit={async (values) => { await mutation.mutateAsync(values); }}
        fields={[
          { name: "cow_rate_per_litre", label: "Cow base rate (₹/L)", type: "number", required: true },
          { name: "buffalo_rate_per_litre", label: "Buffalo base rate (₹/L)", type: "number", required: true },
          { name: "fat_bonus_per_percent", label: "Fat bonus (₹ per percent)", type: "number", required: true },
          { name: "snf_bonus_per_percent", label: "SNF bonus (₹ per percent)", type: "number", required: true },
          { name: "effective_from", label: "Effective from", type: "date", required: true },
        ]}
      />
    </>
  );
}

function RateCard({ rate, title, milkType }: { rate: MilkRateRow | undefined; title: string; milkType: "cow" | "buffalo" }) {
  return (
    <div className="surface-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b bg-primary-soft/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Milk className="size-5" />
          </span>
          <div>
            <h2 className="font-semibold">{title}</h2>
            <p className="text-xs text-muted-foreground">Current rate</p>
          </div>
        </div>
        <Badge variant={rate ? "default" : "secondary"}>{rate ? "Active" : "Unavailable"}</Badge>
      </div>
      <div className="p-5">
        <p className="text-numeric text-4xl font-semibold">
          {rate ? `₹${(milkType === "cow" ? rate.cow_rate_per_litre : rate.buffalo_rate_per_litre).toFixed(2)}` : "—"}
          <span className="ml-1 text-base font-medium text-muted-foreground">/ litre</span>
        </p>
        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border p-3">
            <dt className="text-muted-foreground">Fat bonus</dt>
            <dd className="text-numeric mt-1 font-semibold">{rate ? `₹${rate.fat_bonus_per_percent.toFixed(2)}` : "—"} / percent</dd>
          </div>
          <div className="rounded-xl border p-3">
            <dt className="text-muted-foreground">SNF bonus</dt>
            <dd className="text-numeric mt-1 font-semibold">{rate ? `₹${rate.snf_bonus_per_percent.toFixed(2)}` : "—"} / percent</dd>
          </div>
        </dl>
        <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarClock className="size-3.5" />
          {rate ? `Effective from ${formatDate(rate.effective_from)}` : "No effective rate available"}
        </p>
      </div>
    </div>
  );
}
