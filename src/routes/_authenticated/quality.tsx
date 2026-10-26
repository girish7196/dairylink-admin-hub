import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FlaskConical, Plus, ShieldCheck, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader, SectionCard } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { FilterSelect, Toolbar } from "@/components/common/Toolbar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/common/StatCard";
import { QualityPieChart } from "@/components/common/Charts";
import { EntityFormDialog } from "@/components/forms/EntityFormDialog";
import { Button } from "@/components/ui/button";
import {
  TODAY,
  farmerCode,
  farmerName,
  farmers,
  formatDate,
  qualityBreakdown,
  qualityTests,
  type QualityTest,
} from "@/data/demo";

export const Route = createFileRoute("/_authenticated/quality")({
  head: () => ({
    meta: [
      { title: "Quality Testing — DairyLink Admin" },
      {
        name: "description",
        content: "Fat and SNF test results per farmer and shift, with pass, average and rejected grading.",
      },
      { property: "og:title", content: "Quality Testing — DairyLink Admin" },
      {
        property: "og:description",
        content: "Log and review milk quality samples across collection centres.",
      },
    ],
  }),
  component: QualityPage,
});

function QualityPage() {
  const [search, setSearch] = useState("");
  const [shift, setShift] = useState("all");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);

  const rows = useMemo(
    () =>
      qualityTests.filter((q) => {
        const term = search.trim().toLowerCase();
        const matches =
          !term ||
          farmerName(q.farmerId).toLowerCase().includes(term) ||
          farmerCode(q.farmerId).toLowerCase().includes(term);
        return (
          matches && (shift === "all" || q.shift === shift) && (status === "all" || q.status === status)
        );
      }),
    [search, shift, status],
  );

  const avgFat = rows.length ? rows.reduce((t, r) => t + r.fat, 0) / rows.length : 0;
  const avgSnf = rows.length ? rows.reduce((t, r) => t + r.snf, 0) / rows.length : 0;
  const rejected = rows.filter((r) => r.status === "rejected").length;

  const columns: Column<QualityTest>[] = [
    { key: "date", header: "Date", render: (q) => formatDate(q.date) },
    {
      key: "farmer",
      header: "Farmer",
      render: (q) => (
        <div>
          <p className="font-medium">{farmerName(q.farmerId)}</p>
          <p className="text-numeric text-xs text-muted-foreground">{farmerCode(q.farmerId)}</p>
        </div>
      ),
    },
    { key: "shift", header: "Shift", className: "capitalize", render: (q) => q.shift },
    { key: "milkType", header: "Milk type", hideOn: "sm", className: "capitalize", render: (q) => q.milkType },
    { key: "fat", header: "Fat %", align: "right", render: (q) => <span className="text-numeric">{q.fat}</span> },
    { key: "snf", header: "SNF %", align: "right", render: (q) => <span className="text-numeric">{q.snf}</span> },
    { key: "status", header: "Result", render: (q) => <StatusBadge value={q.status} /> },
    { key: "testedBy", header: "Tested by", hideOn: "lg", render: (q) => q.testedBy },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Quality testing"
        description="Fat and SNF readings recorded at collection and chilling points"
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-1.5 size-4" /> Add quality test
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Samples in view" value={String(rows.length)} icon={FlaskConical} />
        <StatCard label="Average fat" value={`${avgFat.toFixed(2)}%`} icon={ShieldCheck} tone="cream" />
        <StatCard label="Average SNF" value={`${avgSnf.toFixed(2)}%`} icon={ShieldCheck} tone="info" />
        <StatCard
          label="Rejected samples"
          value={String(rejected)}
          hint="below SNF 8.1"
          icon={TriangleAlert}
          tone="warning"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <SectionCard
          title="Quality distribution"
          description="All recorded samples"
          className="xl:col-span-1"
        >
          <QualityPieChart data={qualityBreakdown()} />
        </SectionCard>

        <div className="space-y-4 xl:col-span-2">
          <Toolbar search={search} onSearch={setSearch} placeholder="Search farmer name or code…">
            <FilterSelect
              value={shift}
              onChange={setShift}
              placeholder="Shift"
              width="w-full sm:w-36"
              options={[
                { value: "all", label: "All shifts" },
                { value: "morning", label: "Morning" },
                { value: "evening", label: "Evening" },
              ]}
            />
            <FilterSelect
              value={status}
              onChange={setStatus}
              placeholder="Result"
              width="w-full sm:w-40"
              options={[
                { value: "all", label: "All results" },
                { value: "excellent", label: "Excellent" },
                { value: "good", label: "Good" },
                { value: "average", label: "Average" },
                { value: "rejected", label: "Rejected" },
              ]}
            />
          </Toolbar>

          <DataTable
            columns={columns}
            data={rows}
            rowKey={(q) => q.id}
            pageSize={8}
            emptyTitle="No quality tests found"
            emptyDescription="Try a different shift or result filter."
          />
        </div>
      </div>

      <EntityFormDialog
        open={open}
        onOpenChange={setOpen}
        title="Add quality test"
        description="Record a fat and SNF reading for a farmer sample."
        submitLabel="Save test"
        footerNote="Demo mode — results are not saved."
        initialValues={{ date: TODAY, shift: "morning", milkType: "cow" }}
        onSubmit={() => toast.success("Quality test recorded")}
        fields={[
          { name: "date", label: "Date", type: "date", required: true },
          {
            name: "farmerId",
            label: "Farmer",
            type: "select",
            required: true,
            options: farmers
              .filter((f) => f.status === "active")
              .slice(0, 30)
              .map((f) => ({ value: f.id, label: `${f.name} (${f.code})` })),
          },
          {
            name: "shift",
            label: "Shift",
            type: "select",
            required: true,
            options: [
              { value: "morning", label: "Morning" },
              { value: "evening", label: "Evening" },
            ],
          },
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
          { name: "fat", label: "Fat %", type: "number", required: true },
          { name: "snf", label: "SNF %", type: "number", required: true },
          { name: "testedBy", label: "Tested by", placeholder: "Lab technician name" },
          {
            name: "remarks",
            label: "Remarks",
            type: "textarea",
            full: true,
            placeholder: "Sample appearance, analyser notes…",
          },
        ]}
      />
    </AdminLayout>
  );
}
