import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, MapPin, Pencil, Phone, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader, SectionCard } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/common/StatCard";
import { FilterSelect, Toolbar } from "@/components/common/Toolbar";
import { SimpleBarChart } from "@/components/common/Charts";
import { EntityFormDialog, type FormValues } from "@/components/forms/EntityFormDialog";
import { Button } from "@/components/ui/button";
import { centrePerformance, centres, farmers } from "@/data/demo";

export const Route = createFileRoute("/centres")({
  head: () => ({
    meta: [
      { title: "Collection Centres — DairyLink Admin" },
      {
        name: "description",
        content: "Village collection centres and chilling points with supervisors, contacts and farmer counts.",
      },
      { property: "og:title", content: "Collection Centres — DairyLink Admin" },
      {
        property: "og:description",
        content: "Manage collection centres, supervisors and the farmers mapped to each point.",
      },
    ],
  }),
  component: CentresPage,
});

function CentresPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dialog, setDialog] = useState<{ open: boolean; values?: FormValues; mode: "add" | "edit" }>({
    open: false,
    mode: "add",
  });

  const rows = useMemo(
    () =>
      centres.filter((c) => {
        const q = search.trim().toLowerCase();
        return (
          (!q ||
            c.name.toLowerCase().includes(q) ||
            c.village.toLowerCase().includes(q) ||
            c.supervisor.toLowerCase().includes(q)) &&
          (status === "all" || c.status === status)
        );
      }),
    [search, status],
  );

  return (
    <AdminLayout>
      <PageHeader
        title="Collection centres"
        description="Village collection points and chilling centres in the society network"
        actions={
          <Button onClick={() => setDialog({ open: true, mode: "add" })}>
            <Plus className="mr-1.5 size-4" /> Add centre
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total centres" value={String(centres.length)} icon={Building2} />
        <StatCard
          label="Active centres"
          value={String(centres.filter((c) => c.status === "active").length)}
          icon={Building2}
          tone="cream"
        />
        <StatCard label="Mapped farmers" value={String(farmers.length)} icon={Users} tone="info" />
      </div>

      <SectionCard title="Today's collection by centre" description="Litres received per centre">
        <SimpleBarChart data={centrePerformance()} unit=" L" />
      </SectionCard>

      <Toolbar search={search} onSearch={setSearch} placeholder="Search centre, village or supervisor…">
        <FilterSelect
          value={status}
          onChange={setStatus}
          placeholder="Status"
          width="w-full sm:w-44"
          options={[
            { value: "all", label: "All statuses" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
      </Toolbar>

      {rows.length === 0 ? (
        <div className="surface-card p-16 text-center">
          <p className="font-medium">No collection centres match your search</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different village name or clear the status filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((c) => (
            <div key={c.id} className="surface-card flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Building2 className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold leading-tight">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {c.village}, {c.district}
                    </p>
                  </div>
                </div>
                <StatusBadge value={c.status} />
              </div>

              <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                {c.address}
              </p>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border p-3">
                  <dt className="text-xs text-muted-foreground">Supervisor</dt>
                  <dd className="mt-0.5 font-medium">{c.supervisor}</dd>
                </div>
                <div className="rounded-xl border p-3">
                  <dt className="text-xs text-muted-foreground">Farmers</dt>
                  <dd className="text-numeric mt-0.5 font-medium">{c.farmers}</dd>
                </div>
              </dl>

              <p className="text-numeric mt-4 flex items-center gap-2 text-sm">
                <Phone className="size-4 text-muted-foreground" />
                {c.contact}
              </p>

              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                onClick={() =>
                  setDialog({
                    open: true,
                    mode: "edit",
                    values: {
                      name: c.name,
                      village: c.village,
                      district: c.district,
                      address: c.address,
                      supervisor: c.supervisor,
                      contact: c.contact,
                      status: c.status,
                    },
                  })
                }
              >
                <Pencil className="mr-1.5 size-4" /> Edit centre
              </Button>
            </div>
          ))}
        </div>
      )}

      <EntityFormDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
        title={dialog.mode === "add" ? "Add collection centre" : "Edit collection centre"}
        description="Centres appear in the farmer app when farmers pick their collection point."
        submitLabel={dialog.mode === "add" ? "Add centre" : "Save changes"}
        footerNote="Demo mode — changes are not saved."
        initialValues={dialog.values ?? { status: "active" }}
        onSubmit={() => toast.success(dialog.mode === "add" ? "Centre added" : "Centre updated")}
        fields={[
          { name: "name", label: "Centre name", required: true, placeholder: "Shirwal Collection Centre" },
          { name: "village", label: "Village", required: true, placeholder: "Shirwal" },
          { name: "district", label: "District", required: true, placeholder: "Satara" },
          { name: "supervisor", label: "Supervisor", required: true, placeholder: "Ramesh Jadhav" },
          { name: "contact", label: "Contact number", type: "tel", required: true },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ],
          },
          {
            name: "address",
            label: "Full address",
            type: "textarea",
            full: true,
            placeholder: "Landmark, road, PIN code",
          },
        ]}
      />
    </AdminLayout>
  );
}
