import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCheck, Plus } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterSelect, Toolbar } from "@/components/common/Toolbar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EntityFormDialog } from "@/components/forms/EntityFormDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  centres,
  farmers,
  formatDate,
  notifications as seedNotifications,
  titleCase,
} from "@/data/demo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — DairyLink Admin" },
      {
        name: "description",
        content: "Broadcast rate revisions, payment updates and quality alerts to farmers and centres.",
      },
      { property: "og:title", content: "Notifications — DairyLink Admin" },
      {
        property: "og:description",
        content: "Create and review notifications sent to farmers through the DairyLink app.",
      },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const [items, setItems] = useState(seedNotifications);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [readState, setReadState] = useState("all");
  const [open, setOpen] = useState(false);

  const rows = useMemo(
    () =>
      items.filter((n) => {
        const q = search.trim().toLowerCase();
        return (
          (!q || n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q)) &&
          (type === "all" || n.type === type) &&
          (readState === "all" || (readState === "unread" ? !n.read : n.read))
        );
      }),
    [items, search, type, readState],
  );

  const unread = items.filter((n) => !n.read).length;

  return (
    <AdminLayout>
      <PageHeader
        title="Notifications"
        description="Messages delivered to farmers in the DairyLink app"
        actions={
          <>
            <Button
              variant="outline"
              disabled={unread === 0}
              onClick={() => {
                setItems((prev) => prev.map((n) => ({ ...n, read: true })));
                toast.success("All notifications marked as read");
              }}
            >
              <CheckCheck className="mr-1.5 size-4" /> Mark all read
            </Button>
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-1.5 size-4" /> Create notification
            </Button>
          </>
        }
      />

      <Toolbar search={search} onSearch={setSearch} placeholder="Search notifications…">
        <FilterSelect
          value={type}
          onChange={setType}
          placeholder="Type"
          width="w-full sm:w-44"
          options={[
            { value: "all", label: "All types" },
            { value: "payment", label: "Payment" },
            { value: "quality", label: "Quality" },
            { value: "rate", label: "Rate" },
            { value: "alert", label: "Alert" },
            { value: "general", label: "General" },
          ]}
        />
        <FilterSelect
          value={readState}
          onChange={setReadState}
          placeholder="Status"
          width="w-full sm:w-40"
          options={[
            { value: "all", label: "All" },
            { value: "unread", label: "Unread" },
            { value: "read", label: "Read" },
          ]}
        />
      </Toolbar>

      {rows.length === 0 ? (
        <div className="surface-card p-16 text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Bell className="size-5" />
          </div>
          <p className="mt-3 font-medium">No notifications match these filters</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try another type, or create a new notification for your farmers.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((n) => (
            <li
              key={n.id}
              className={cn(
                "surface-card flex flex-col gap-3 p-5 sm:flex-row sm:items-start",
                !n.read && "border-l-4 border-l-primary",
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{n.title}</h3>
                  <Badge variant="secondary">{titleCase(n.type)}</Badge>
                  <StatusBadge value={n.read ? "read" : "unread"} />
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{n.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Sent to {n.audience} · {formatDate(n.date)}
                </p>
              </div>
              {!n.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
                  }
                >
                  Mark read
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}

      <EntityFormDialog
        open={open}
        onOpenChange={setOpen}
        title="Create notification"
        description="Send an announcement to all farmers, a single centre, or one farmer."
        submitLabel="Send notification"
        footerNote="Demo mode — nothing is actually delivered."
        initialValues={{ type: "general", audience: "all" }}
        onSubmit={(values) => {
          setItems((prev) => [
            {
              id: `n${prev.length + 1}`,
              title: values["title"] ?? "Untitled notification",
              message: values["message"] ?? "",
              type: (values["type"] as "general") ?? "general",
              date: new Date().toISOString().slice(0, 10),
              read: false,
              audience:
                values["audience"] === "all"
                  ? "All farmers"
                  : (centres.find((c) => c.id === values["audience"])?.name ??
                    farmers.find((f) => f.id === values["audience"])?.name ??
                    "Selected farmers"),
            },
            ...prev,
          ]);
          toast.success("Notification sent");
        }}
        fields={[
          { name: "title", label: "Title", required: true, full: true, placeholder: "Cow milk rate revised" },
          {
            name: "type",
            label: "Type",
            type: "select",
            required: true,
            options: [
              { value: "general", label: "General" },
              { value: "payment", label: "Payment" },
              { value: "quality", label: "Quality" },
              { value: "rate", label: "Rate" },
              { value: "alert", label: "Alert" },
            ],
          },
          {
            name: "audience",
            label: "Send to",
            type: "select",
            required: true,
            options: [
              { value: "all", label: "All farmers" },
              ...centres.map((c) => ({ value: c.id, label: `Centre — ${c.name}` })),
              ...farmers.slice(0, 20).map((f) => ({ value: f.id, label: `Farmer — ${f.name} (${f.code})` })),
            ],
          },
          {
            name: "message",
            label: "Message",
            type: "textarea",
            required: true,
            full: true,
            placeholder: "Write the message farmers will see in the app…",
          },
        ]}
      />
    </AdminLayout>
  );
}
