import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Printer } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader, SectionCard } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  CollectionAreaChart,
  PaymentBarChart,
  QualityPieChart,
  SimpleBarChart,
  TrendLineChart,
} from "@/components/common/Charts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterSelect } from "@/components/common/Toolbar";
import {
  TODAY,
  centreName,
  centrePerformance,
  centres,
  collections,
  collectionTrend,
  farmers,
  formatDate,
  inr,
  paymentTrend,
  payments,
  qualityBreakdown,
  qualityTests,
  titleCase,
} from "@/data/demo";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — DairyLink Admin" },
      {
        name: "description",
        content: "Daily and monthly collection reports, farmer-wise supply, payments, quality and centre summaries.",
      },
      { property: "og:title", content: "Reports — DairyLink Admin" },
      {
        property: "og:description",
        content: "Generate, print and export dairy society operational reports.",
      },
    ],
  }),
  component: ReportsPage,
});

interface FarmerRow {
  id: string;
  name: string;
  code: string;
  centre: string;
  litres: number;
  amount: number;
  entries: number;
}

function ReportsPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [centre, setCentre] = useState("all");

  const inRange = collections.filter(
    (c) =>
      (!from || c.date >= from) &&
      (!to || c.date <= to) &&
      (centre === "all" || c.centreId === centre),
  );

  const farmerRows: FarmerRow[] = farmers
    .map((f) => {
      const rows = inRange.filter((c) => c.farmerId === f.id);
      return {
        id: f.id,
        name: f.name,
        code: f.code,
        centre: centreName(f.centreId),
        litres: Number(rows.reduce((t, r) => t + r.quantity, 0).toFixed(1)),
        amount: Number(rows.reduce((t, r) => t + r.amount, 0).toFixed(0)),
        entries: rows.length,
      };
    })
    .filter((r) => r.entries > 0)
    .sort((a, b) => b.litres - a.litres);

  const farmerColumns: Column<FarmerRow>[] = [
    {
      key: "name",
      header: "Farmer",
      render: (r) => (
        <div>
          <p className="font-medium">{r.name}</p>
          <p className="text-numeric text-xs text-muted-foreground">{r.code}</p>
        </div>
      ),
    },
    { key: "centre", header: "Centre", hideOn: "md" },
    { key: "entries", header: "Entries", align: "right", hideOn: "sm" },
    {
      key: "litres",
      header: "Total litres",
      align: "right",
      render: (r) => <span className="text-numeric">{r.litres} L</span>,
    },
    {
      key: "amount",
      header: "Total value",
      align: "right",
      render: (r) => <span className="text-numeric font-semibold">{inr(r.amount)}</span>,
    },
  ];

  const dailyRows = collectionTrend(14)
    .slice()
    .reverse()
    .map((d) => ({ ...d, id: d.date }));

  const monthly = [
    { label: "Apr", litres: 24120, value: 842300 },
    { label: "May", litres: 25980, value: 901500 },
    { label: "Jun", litres: 27410, value: 954200 },
    { label: "Jul", litres: 26330, value: 918700 },
    { label: "Aug", litres: 28150, value: 988400 },
    { label: "Sep", litres: 18240, value: 641900 },
  ];

  const exportBar = (
    <>
      <Button variant="outline" size="sm" onClick={() => toast.success("Report sent to printer (demo)")}>
        <Printer className="mr-1.5 size-4" /> Print
      </Button>
      <Button size="sm" onClick={() => toast.success("Report exported (demo)")}>
        <Download className="mr-1.5 size-4" /> Export CSV
      </Button>
    </>
  );

  return (
    <AdminLayout>
      <PageHeader
        title="Reports"
        description={`Operational reporting up to ${formatDate(TODAY)}`}
        actions={exportBar}
      />

      <div className="surface-card flex flex-col gap-3 p-3 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">From</Label>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full sm:w-44" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">To</Label>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full sm:w-44" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Collection centre</Label>
          <FilterSelect
            value={centre}
            onChange={setCentre}
            placeholder="Centre"
            width="w-full sm:w-56"
            options={[
              { value: "all", label: "All centres" },
              ...centres.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
        </div>
        <Button
          variant="ghost"
          className="sm:ml-auto"
          onClick={() => {
            setFrom("");
            setTo("");
            setCentre("all");
          }}
        >
          Reset filters
        </Button>
      </div>

      <Tabs defaultValue="daily">
        <TabsList className="flex-wrap">
          <TabsTrigger value="daily">Daily collection</TabsTrigger>
          <TabsTrigger value="monthly">Monthly collection</TabsTrigger>
          <TabsTrigger value="farmer">Farmer-wise</TabsTrigger>
          <TabsTrigger value="payment">Payments</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="centre">Centres</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-4 space-y-5">
          <SectionCard title="Daily collection" description="Last 14 days by shift" actions={exportBar}>
            <CollectionAreaChart data={collectionTrend(14)} />
          </SectionCard>
          <DataTable
            columns={[
              { key: "label", header: "Date" },
              { key: "morning", header: "Morning (L)", align: "right" },
              { key: "evening", header: "Evening (L)", align: "right" },
              { key: "litres", header: "Total (L)", align: "right" },
              {
                key: "value",
                header: "Value",
                align: "right",
                render: (r: (typeof dailyRows)[number]) => (
                  <span className="text-numeric font-semibold">{inr(r.value)}</span>
                ),
              },
            ]}
            data={dailyRows}
            rowKey={(r) => r.id}
            pageSize={14}
            emptyTitle="No collection in this period"
            emptyDescription="Pick another date range to generate the report."
          />
        </TabsContent>

        <TabsContent value="monthly" className="mt-4 space-y-5">
          <SectionCard title="Monthly collection" description="Litres received per month" actions={exportBar}>
            <SimpleBarChart data={monthly} unit=" L" />
          </SectionCard>
          <SectionCard title="Monthly milk value" description="Total payable to farmers">
            <TrendLineChart data={monthly} dataKey="value" name="Milk value" />
          </SectionCard>
        </TabsContent>

        <TabsContent value="farmer" className="mt-4 space-y-4">
          <SectionCard
            title="Farmer-wise supply"
            description="Ranked by litres supplied in the selected period"
            actions={exportBar}
          >
            <DataTable
              columns={farmerColumns}
              data={farmerRows}
              rowKey={(r) => r.id}
              pageSize={10}
              emptyTitle="No farmer supply in this period"
              emptyDescription="Adjust the date range or centre filter."
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="payment" className="mt-4 space-y-5">
          <SectionCard title="Payment report" description="Paid vs pending by month" actions={exportBar}>
            <PaymentBarChart data={paymentTrend()} />
          </SectionCard>
          <DataTable
            columns={[
              { key: "period", header: "Period" },
              { key: "method", header: "Method", render: (p) => titleCase(p.method), hideOn: "sm" },
              {
                key: "amount",
                header: "Amount",
                align: "right",
                render: (p) => <span className="text-numeric font-semibold">{inr(p.amount)}</span>,
              },
              { key: "status", header: "Status", render: (p) => <StatusBadge value={p.status} /> },
              { key: "reference", header: "Reference", hideOn: "md" },
            ]}
            data={payments}
            rowKey={(p) => p.id}
            pageSize={10}
            emptyTitle="No payments recorded"
            emptyDescription="Payments appear once a payout cycle is generated."
          />
        </TabsContent>

        <TabsContent value="quality" className="mt-4 grid gap-5 xl:grid-cols-2">
          <SectionCard title="Quality distribution" description="Grading of all samples">
            <QualityPieChart data={qualityBreakdown()} />
          </SectionCard>
          <SectionCard title="Quality summary" description="Averages across recorded samples">
            <dl className="space-y-3 text-sm">
              <SummaryRow
                label="Samples tested"
                value={String(qualityTests.length)}
              />
              <SummaryRow
                label="Average fat"
                value={`${(qualityTests.reduce((t, q) => t + q.fat, 0) / qualityTests.length).toFixed(2)}%`}
              />
              <SummaryRow
                label="Average SNF"
                value={`${(qualityTests.reduce((t, q) => t + q.snf, 0) / qualityTests.length).toFixed(2)}%`}
              />
              <SummaryRow
                label="Rejected samples"
                value={String(qualityTests.filter((q) => q.status === "rejected").length)}
              />
            </dl>
          </SectionCard>
        </TabsContent>

        <TabsContent value="centre" className="mt-4 space-y-5">
          <SectionCard title="Collection centre report" description="Today's litres per centre" actions={exportBar}>
            <SimpleBarChart data={centrePerformance()} unit=" L" />
          </SectionCard>
          <DataTable
            columns={[
              { key: "label", header: "Centre" },
              { key: "farmers", header: "Farmers", align: "right", hideOn: "sm" },
              {
                key: "litres",
                header: "Litres today",
                align: "right",
                render: (r: { litres: number }) => <span className="text-numeric">{r.litres} L</span>,
              },
              {
                key: "amount",
                header: "Value today",
                align: "right",
                render: (r: { amount: number }) => (
                  <span className="text-numeric font-semibold">{inr(r.amount)}</span>
                ),
              },
            ]}
            data={centrePerformance()}
            rowKey={(r) => r.label}
            pageSize={10}
            emptyTitle="No centre activity"
            emptyDescription="Centre totals appear after the day's collection is recorded."
          />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border p-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-numeric font-semibold">{value}</dd>
    </div>
  );
}
