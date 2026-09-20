import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { FilterSelect, Toolbar } from "@/components/common/Toolbar";
import { FarmerFormDialog } from "@/components/forms/FarmerFormDialog";
import { Button } from "@/components/ui/button";
import { centreName, centres, farmers, type Farmer } from "@/data/demo";

export const Route = createFileRoute("/farmers/")({
  head: () => ({
    meta: [
      { title: "Farmers — DairyLink Admin" },
      {
        name: "description",
        content:
          "Search, filter and manage registered dairy farmers, their villages, cattle and bank details.",
      },
      { property: "og:title", content: "Farmers — DairyLink Admin" },
      {
        property: "og:description",
        content: "Manage farmer registrations, collection centre mapping and payout bank details.",
      },
    ],
  }),
  component: FarmersPage,
});

function FarmersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [village, setVillage] = useState("all");
  const [centre, setCentre] = useState("all");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);

  const villages = useMemo(
    () => Array.from(new Set(farmers.map((f) => f.village))).sort(),
    [],
  );

  const rows = useMemo(
    () =>
      farmers.filter((f) => {
        const q = search.trim().toLowerCase();
        const matches =
          !q ||
          f.name.toLowerCase().includes(q) ||
          f.code.toLowerCase().includes(q) ||
          f.phone.includes(q) ||
          f.village.toLowerCase().includes(q);
        return (
          matches &&
          (village === "all" || f.village === village) &&
          (centre === "all" || f.centreId === centre) &&
          (status === "all" || f.status === status)
        );
      }),
    [search, village, centre, status],
  );

  const columns: Column<Farmer>[] = [
    {
      key: "name",
      header: "Farmer",
      render: (f) => (
        <div>
          <p className="font-medium">{f.name}</p>
          <p className="text-numeric text-xs text-muted-foreground">{f.code}</p>
        </div>
      ),
    },
    { key: "phone", header: "Phone", hideOn: "md", className: "text-numeric" },
    {
      key: "village",
      header: "Village",
      render: (f) => (
        <div>
          <p>{f.village}</p>
          <p className="text-xs text-muted-foreground">{f.district}</p>
        </div>
      ),
    },
    { key: "centre", header: "Collection centre", hideOn: "lg", render: (f) => centreName(f.centreId) },
    {
      key: "cattle",
      header: "Cattle",
      align: "right",
      hideOn: "sm",
      render: (f) => (
        <span className="text-numeric">
          {f.cows} cow{f.cows === 1 ? "" : "s"} · {f.buffaloes} buff.
        </span>
      ),
    },
    {
      key: "avg",
      header: "Avg / day",
      align: "right",
      hideOn: "lg",
      render: (f) => <span className="text-numeric">{f.avgDailyLitres} L</span>,
    },
    { key: "status", header: "Status", render: (f) => <StatusBadge value={f.status} /> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (f) => (
        <Button variant="ghost" size="sm" asChild onClick={(e) => e.stopPropagation()}>
          <Link to="/farmers/$farmerId" params={{ farmerId: f.id }}>
            View
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Farmers"
        description={`${farmers.length} registered farmers across ${centres.length} collection centres`}
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-1.5 size-4" /> Add farmer
          </Button>
        }
      />

      <Toolbar
        search={search}
        onSearch={setSearch}
        placeholder="Search by name, farmer code or phone…"
      >
        <FilterSelect
          value={village}
          onChange={setVillage}
          placeholder="Village"
          options={[
            { value: "all", label: "All villages" },
            ...villages.map((v) => ({ value: v, label: v })),
          ]}
        />
        <FilterSelect
          value={centre}
          onChange={setCentre}
          placeholder="Collection centre"
          width="w-full sm:w-56"
          options={[
            { value: "all", label: "All centres" },
            ...centres.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />
        <FilterSelect
          value={status}
          onChange={setStatus}
          placeholder="Status"
          width="w-full sm:w-40"
          options={[
            { value: "all", label: "All statuses" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "suspended", label: "Suspended" },
          ]}
        />
      </Toolbar>

      <DataTable
        columns={columns}
        data={rows}
        rowKey={(f) => f.id}
        pageSize={10}
        onRowClick={(f) => navigate({ to: "/farmers/$farmerId", params: { farmerId: f.id } })}
        emptyTitle="No farmers match these filters"
        emptyDescription="Try a different village, centre or clear the search."
        emptyAction={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setVillage("all");
              setCentre("all");
              setStatus("all");
            }}
          >
            Clear filters
          </Button>
        }
      />

      <FarmerFormDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={() => toast.success("Farmer added", { description: "Demo data is not persisted yet." })}
      />
    </AdminLayout>
  );
}
