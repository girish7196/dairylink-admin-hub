import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Milk, Plus } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader, SectionCard } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { EntityFormDialog } from "@/components/forms/EntityFormDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TODAY, currentRate, formatDate, milkRates, type MilkRate } from "@/data/demo";

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
    ],
  }),
  component: RatesPage,
});

function RatesPage() {
  const [open, setOpen] = useState(false);
  const cow = currentRate("cow");
  const buffalo = currentRate("buffalo");

  const columns: Column<MilkRate>[] = [
    { key: "milkType", header: "Milk type", className: "capitalize", render: (r) => r.milkType },
    {
      key: "baseRate",
      header: "Base rate",
      align: "right",
      render: (r) => <span className="text-numeric">₹{r.baseRate.toFixed(2)}</span>,
    },
    {
      key: "fatBonus",
      header: "Fat bonus",
      align: "right",
      render: (r) => <span className="text-numeric">₹{r.fatBonus.toFixed(2)}</span>,
    },
    {
      key: "snfBonus",
      header: "SNF bonus",
      align: "right",
      render: (r) => <span className="text-numeric">₹{r.snfBonus.toFixed(2)}</span>,
    },
    { key: "effectiveFrom", header: "Effective from", render: (r) => formatDate(r.effectiveFrom) },
    { key: "note", header: "Note", hideOn: "lg", render: (r) => r.note },
    {
      key: "current",
      header: "",
      align: "right",
      render: (r) =>
        r.current ? <Badge>Current</Badge> : <Badge variant="secondary">Superseded</Badge>,
    },
  ];

  return (
    <AdminLayout>
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
        <RateCard rate={cow} title="Cow milk" />
        <RateCard rate={buffalo} title="Buffalo milk" />
      </div>

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
          data={milkRates}
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
        footerNote="Demo mode — rates are not saved."
        initialValues={{ effectiveFrom: TODAY, milkType: "cow" }}
        onSubmit={() => toast.success("Rate revision published")}
        fields={[
          {
            name: "milkType",
            label: "Milk type",
            type: "select",
            required: true,
            options: [
              { value: "cow", label: "Cow" },
              { value: "buffalo", label: "Buffalo" },
            ],
          },
          { name: "baseRate", label: "Base rate (₹/L)", type: "number", required: true },
          { name: "fatBonus", label: "Fat bonus (₹ per point)", type: "number", required: true },
          { name: "snfBonus", label: "SNF bonus (₹ per point)", type: "number", required: true },
          { name: "effectiveFrom", label: "Effective from", type: "date", required: true },
          {
            name: "note",
            label: "Note",
            type: "textarea",
            full: true,
            placeholder: "Reason for the revision",
          },
        ]}
      />
    </AdminLayout>
  );
}

function RateCard({ rate, title }: { rate: MilkRate; title: string }) {
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
        <Badge>Active</Badge>
      </div>
      <div className="p-5">
        <p className="text-numeric text-4xl font-semibold">
          ₹{rate.baseRate.toFixed(2)}
          <span className="ml-1 text-base font-medium text-muted-foreground">/ litre</span>
        </p>
        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border p-3">
            <dt className="text-muted-foreground">Fat bonus</dt>
            <dd className="text-numeric mt-1 font-semibold">₹{rate.fatBonus.toFixed(2)} / point</dd>
          </div>
          <div className="rounded-xl border p-3">
            <dt className="text-muted-foreground">SNF bonus</dt>
            <dd className="text-numeric mt-1 font-semibold">₹{rate.snfBonus.toFixed(2)} / point</dd>
          </div>
        </dl>
        <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarClock className="size-3.5" />
          Effective from {formatDate(rate.effectiveFrom)} · {rate.note}
        </p>
      </div>
    </div>
  );
}
