import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Plus } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { FilterSelect, Toolbar } from "@/components/common/Toolbar";
import { EntityFormDialog } from "@/components/forms/EntityFormDialog";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TODAY,
  centreName,
  centres,
  collections,
  currentRate,
  farmerCode,
  farmerName,
  farmers,
  formatDate,
  inr,
  litres,
  type Collection,
} from "@/data/demo";
import { IndianRupee, Milk, Sunrise, Moon } from "lucide-react";

export const Route = createFileRoute("/collection")({
  head: () => ({
    meta: [
      { title: "Milk Collection — DairyLink Admin" },
      {
        name: "description",
        content:
          "Shift-wise milk collection log with quantity, fat, SNF, applied rate and payable amount.",
      },
      { property: "og:title", content: "Milk Collection — DairyLink Admin" },
      {
        property: "og:description",
        content: "Record and review morning and evening milk collection entries per farmer.",
      },
    ],
  }),
  component: CollectionPage,
});

function CollectionPage() {
  const [search, setSearch] = useState("");
  const [centre, setCentre] = useState("all");
  const [shift, setShift] = useState("all");
  const [milkType, setMilkType] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [open, setOpen] = useState(false);

  const rows = useMemo(
    () =>
      collections.filter((c) => {
        const q = search.trim().toLowerCase();
        const matches =
          !q ||
          farmerName(c.farmerId).toLowerCase().includes(q) ||
          farmerCode(c.farmerId).toLowerCase().includes(q);
        return (
          matches &&
          (centre === "all" || c.centreId === centre) &&
          (shift === "all" || c.shift === shift) &&
          (milkType === "all" || c.milkType === milkType) &&
          (!from || c.date >= from) &&
          (!to || c.date <= to)
        );
      }),
    [search, centre, shift, milkType, from, to],
  );

  const totalQty = rows.reduce((t, r) => t + r.quantity, 0);
  const totalValue = rows.reduce((t, r) => t + r.amount, 0);
  const morningQty = rows.filter((r) => r.shift === "morning").reduce((t, r) => t + r.quantity, 0);
  const eveningQty = rows.filter((r) => r.shift === "evening").reduce((t, r) => t + r.quantity, 0);

  const columns: Column<Collection>[] = [
    { key: "date", header: "Date", render: (c) => formatDate(c.date) },
    {
      key: "farmer",
      header: "Farmer",
      render: (c) => (
        <div>
          <p className="font-medium">{farmerName(c.farmerId)}</p>
          <p className="text-numeric text-xs text-muted-foreground">{farmerCode(c.farmerId)}</p>
        </div>
      ),
    },
    { key: "centre", header: "Centre", hideOn: "lg", render: (c) => centreName(c.centreId) },
    { key: "shift", header: "Shift", className: "capitalize", render: (c) => c.shift },
    { key: "type", header: "Milk type", hideOn: "sm", className: "capitalize", render: (c) => c.milkType },
    {
      key: "qty",
      header: "Qty (L)",
      align: "right",
      render: (c) => <span className="text-numeric">{c.quantity}</span>,
    },
    {
      key: "fat",
      header: "Fat %",
      align: "right",
      hideOn: "md",
      render: (c) => <span className="text-numeric">{c.fat}</span>,
    },
    {
      key: "snf",
      header: "SNF %",
      align: "right",
      hideOn: "md",
      render: (c) => <span className="text-numeric">{c.snf}</span>,
    },
    {
      key: "rate",
      header: "Rate",
      align: "right",
      hideOn: "lg",
      render: (c) => <span className="text-numeric">₹{c.rate.toFixed(2)}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (c) => <span className="text-numeric font-semibold">{inr(c.amount)}</span>,
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Milk collection"
        description="Shift-wise collection log across all centres"
        actions={
          <>
            <Button variant="outline" onClick={() => toast.success("Export prepared (demo)")}>
              <Download className="mr-1.5 size-4" /> Export
            </Button>
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-1.5 size-4" /> Add collection
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Entries in view" value={String(rows.length)} icon={Milk} />
        <StatCard
          label="Total quantity"
          value={litres(Number(totalQty.toFixed(1)))}
          icon={Milk}
          tone="cream"
        />
        <StatCard
          label="Total value"
          value={inr(Math.round(totalValue))}
          icon={IndianRupee}
          tone="info"
        />
        <StatCard
          label="Morning / evening"
          value={`${morningQty.toFixed(0)} / ${eveningQty.toFixed(0)} L`}
          icon={morningQty >= eveningQty ? Sunrise : Moon}
          tone="warning"
        />
      </div>

      <Toolbar search={search} onSearch={setSearch} placeholder="Search farmer name or code…">
        <FilterSelect
          value={centre}
          onChange={setCentre}
          placeholder="Centre"
          width="w-full sm:w-52"
          options={[
            { value: "all", label: "All centres" },
            ...centres.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />
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
          value={milkType}
          onChange={setMilkType}
          placeholder="Milk type"
          width="w-full sm:w-36"
          options={[
            { value: "all", label: "All types" },
            { value: "cow", label: "Cow" },
            { value: "buffalo", label: "Buffalo" },
          ]}
        />
        <div className="flex items-end gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">From</Label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-40" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">To</Label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-40" />
          </div>
        </div>
      </Toolbar>

      <DataTable
        columns={columns}
        data={rows}
        rowKey={(c) => c.id}
        pageSize={12}
        emptyTitle="No collection entries found"
        emptyDescription="Adjust the date range or filters to see more records."
      />

      <EntityFormDialog
        open={open}
        onOpenChange={setOpen}
        title="Add collection entry"
        description={`Rates applied: cow ₹${currentRate("cow").baseRate}/L, buffalo ₹${currentRate("buffalo").baseRate}/L`}
        submitLabel="Save entry"
        footerNote="Demo mode — entries are not saved."
        initialValues={{ date: TODAY, shift: "morning", milkType: "cow" }}
        onSubmit={() => toast.success("Collection entry recorded")}
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
            name: "centreId",
            label: "Collection centre",
            type: "select",
            required: true,
            options: centres.map((c) => ({ value: c.id, label: c.name })),
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
          { name: "quantity", label: "Quantity (litres)", type: "number", required: true },
          { name: "fat", label: "Fat %", type: "number", required: true },
          { name: "snf", label: "SNF %", type: "number", required: true },
          {
            name: "note",
            label: "Remarks",
            type: "textarea",
            full: true,
            placeholder: "Optional note for this entry",
          },
        ]}
      />
    </AdminLayout>
  );
}
