import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, UserCog } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { FilterSelect, Toolbar } from "@/components/common/Toolbar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/common/StatCard";
import { EntityFormDialog, type FormValues } from "@/components/forms/EntityFormDialog";
import { Button } from "@/components/ui/button";
import {
  centreName,
  centres,
  employees,
  formatDate,
  titleCase,
  type Employee,
} from "@/data/demo";

export const Route = createFileRoute("/_authenticated/employees")({
  head: () => ({
    meta: [
      { title: "Employees — DairyLink Admin" },
      {
        name: "description",
        content: "Society staff directory: supervisors, lab technicians, collection operators and drivers.",
      },
      { property: "og:title", content: "Employees — DairyLink Admin" },
      {
        property: "og:description",
        content: "Manage staff assigned to each collection centre and their roles.",
      },
    ],
  }),
  component: EmployeesPage,
});

const roleOptions = [
  { value: "supervisor", label: "Supervisor" },
  { value: "collection_operator", label: "Collection operator" },
  { value: "lab_technician", label: "Lab technician" },
  { value: "driver", label: "Driver" },
  { value: "accountant", label: "Accountant" },
];

function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [centre, setCentre] = useState("all");
  const [dialog, setDialog] = useState<{ open: boolean; values?: FormValues; mode: "add" | "edit" }>({
    open: false,
    mode: "add",
  });

  const rows = useMemo(
    () =>
      employees.filter((e) => {
        const q = search.trim().toLowerCase();
        return (
          (!q || e.name.toLowerCase().includes(q) || e.phone.includes(q)) &&
          (role === "all" || e.role === role) &&
          (centre === "all" || e.centreId === centre)
        );
      }),
    [search, role, centre],
  );

  const columns: Column<Employee>[] = [
    {
      key: "name",
      header: "Employee",
      render: (e) => (
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
            {e.name
              .split(" ")
              .map((p) => p[0])
              .join("")
              .slice(0, 2)}
          </span>
          <div>
            <p className="font-medium">{e.name}</p>
            <p className="text-xs text-muted-foreground">{titleCase(e.role)}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", header: "Phone", className: "text-numeric", hideOn: "sm" },
    { key: "centre", header: "Collection centre", hideOn: "md", render: (e) => centreName(e.centreId) },
    { key: "joined", header: "Joined", hideOn: "lg", render: (e) => formatDate(e.joinedOn) },
    { key: "status", header: "Status", render: (e) => <StatusBadge value={e.status} /> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (e) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            setDialog({
              open: true,
              mode: "edit",
              values: {
                name: e.name,
                role: e.role,
                phone: e.phone,
                centreId: e.centreId,
                status: e.status,
                joinedOn: e.joinedOn,
              },
            })
          }
        >
          <Pencil className="mr-1.5 size-4" /> Edit
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Employees"
        description="Staff working across collection centres and chilling points"
        actions={
          <Button onClick={() => setDialog({ open: true, mode: "add" })}>
            <Plus className="mr-1.5 size-4" /> Add employee
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total employees" value={String(employees.length)} icon={UserCog} />
        <StatCard
          label="Active staff"
          value={String(employees.filter((e) => e.status === "active").length)}
          icon={UserCog}
          tone="cream"
        />
        <StatCard
          label="Supervisors"
          value={String(employees.filter((e) => e.role === "supervisor").length)}
          icon={UserCog}
          tone="info"
        />
      </div>

      <Toolbar search={search} onSearch={setSearch} placeholder="Search employee name or phone…">
        <FilterSelect
          value={role}
          onChange={setRole}
          placeholder="Role"
          width="w-full sm:w-48"
          options={[{ value: "all", label: "All roles" }, ...roleOptions]}
        />
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
      </Toolbar>

      <DataTable
        columns={columns}
        data={rows}
        rowKey={(e) => e.id}
        pageSize={10}
        emptyTitle="No employees found"
        emptyDescription="Try another role or collection centre."
      />

      <EntityFormDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
        title={dialog.mode === "add" ? "Add employee" : "Edit employee"}
        description="Employees can be assigned to one collection centre."
        submitLabel={dialog.mode === "add" ? "Add employee" : "Save changes"}
        footerNote="Demo mode — changes are not saved."
        initialValues={dialog.values ?? { status: "active" }}
        onSubmit={() =>
          toast.success(dialog.mode === "add" ? "Employee added" : "Employee updated")
        }
        fields={[
          { name: "name", label: "Full name", required: true, placeholder: "Ramesh Jadhav" },
          { name: "role", label: "Role", type: "select", required: true, options: roleOptions },
          { name: "phone", label: "Phone", type: "tel", required: true, placeholder: "+91 98220 00000" },
          {
            name: "centreId",
            label: "Collection centre",
            type: "select",
            required: true,
            options: centres.map((c) => ({ value: c.id, label: c.name })),
          },
          { name: "joinedOn", label: "Joining date", type: "date" },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "suspended", label: "Suspended" },
            ],
          },
        ]}
      />
    </AdminLayout>
  );
}
