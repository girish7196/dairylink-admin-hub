import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock, IndianRupee, Wallet } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { FilterSelect, Toolbar } from "@/components/common/Toolbar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  farmerCode,
  farmerName,
  formatDate,
  inr,
  payments as allPayments,
  titleCase,
  type Payment,
} from "@/data/demo";

export const Route = createFileRoute("/_authenticated/payments")({
  head: () => ({
    meta: [
      { title: "Payments — DairyLink Admin" },
      {
        name: "description",
        content: "Farmer payout cycles with pending, processing and completed payments and transaction references.",
      },
      { property: "og:title", content: "Payments — DairyLink Admin" },
      {
        property: "og:description",
        content: "Track fortnightly farmer payouts and mark payments as paid.",
      },
    ],
  }),
  component: PaymentsPage,
});

function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [method, setMethod] = useState("all");
  const [period, setPeriod] = useState("all");
  const [tab, setTab] = useState("all");
  const [confirm, setConfirm] = useState<Payment | null>(null);
  const [paid, setPaid] = useState<string[]>([]);

  const periods = Array.from(new Set(allPayments.map((p) => p.period)));

  const rows = useMemo(
    () =>
      allPayments
        .map((p) => (paid.includes(p.id) ? { ...p, status: "paid" as const } : p))
        .filter((p) => {
          const q = search.trim().toLowerCase();
          const matches =
            !q ||
            farmerName(p.farmerId).toLowerCase().includes(q) ||
            farmerCode(p.farmerId).toLowerCase().includes(q) ||
            p.reference.toLowerCase().includes(q);
          const byTab =
            tab === "all" ||
            (tab === "pending" && (p.status === "pending" || p.status === "processing")) ||
            (tab === "completed" && p.status === "paid") ||
            (tab === "failed" && p.status === "failed");
          return (
            matches &&
            byTab &&
            (method === "all" || p.method === method) &&
            (period === "all" || p.period === period)
          );
        }),
    [search, method, period, tab, paid],
  );

  const totals = {
    pending: allPayments
      .filter((p) => !paid.includes(p.id) && (p.status === "pending" || p.status === "processing"))
      .reduce((t, p) => t + p.amount, 0),
    completed: allPayments
      .filter((p) => paid.includes(p.id) || p.status === "paid")
      .reduce((t, p) => t + p.amount, 0),
    failed: allPayments.filter((p) => p.status === "failed" && !paid.includes(p.id)).length,
  };

  const columns: Column<Payment>[] = [
    {
      key: "farmer",
      header: "Farmer",
      render: (p) => (
        <div>
          <p className="font-medium">{farmerName(p.farmerId)}</p>
          <p className="text-numeric text-xs text-muted-foreground">{farmerCode(p.farmerId)}</p>
        </div>
      ),
    },
    { key: "period", header: "Period", render: (p) => p.period },
    {
      key: "litres",
      header: "Litres",
      align: "right",
      hideOn: "md",
      render: (p) => <span className="text-numeric">{p.litres} L</span>,
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (p) => <span className="text-numeric font-semibold">{inr(p.amount)}</span>,
    },
    { key: "method", header: "Method", hideOn: "sm", render: (p) => titleCase(p.method) },
    { key: "status", header: "Status", render: (p) => <StatusBadge value={p.status} /> },
    {
      key: "reference",
      header: "Reference",
      hideOn: "lg",
      render: (p) => (
        <span className="text-numeric text-muted-foreground">
          {p.reference}
          {p.paidOn ? ` · ${formatDate(p.paidOn)}` : ""}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (p) =>
        p.status === "paid" ? (
          <span className="text-xs text-muted-foreground">Settled</span>
        ) : (
          <Button size="sm" variant="outline" onClick={() => setConfirm(p)}>
            Mark as paid
          </Button>
        ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Payments"
        description="Fortnightly payout cycles for supplying farmers"
        actions={
          <Button onClick={() => toast.success("Payout run queued (demo)")}>
            Start payout run
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pending payouts" value={inr(Math.round(totals.pending))} icon={Clock} tone="warning" />
        <StatCard label="Completed payouts" value={inr(Math.round(totals.completed))} icon={CheckCircle2} />
        <StatCard label="Failed transfers" value={String(totals.failed)} icon={Wallet} tone="info" />
        <StatCard
          label="Total payable this cycle"
          value={inr(Math.round(totals.pending + totals.completed))}
          icon={IndianRupee}
          tone="cream"
        />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4 space-y-4">
          <Toolbar
            search={search}
            onSearch={setSearch}
            placeholder="Search farmer, code or transaction reference…"
          >
            <FilterSelect
              value={period}
              onChange={setPeriod}
              placeholder="Period"
              width="w-full sm:w-48"
              options={[
                { value: "all", label: "All periods" },
                ...periods.map((p) => ({ value: p, label: p })),
              ]}
            />
            <FilterSelect
              value={method}
              onChange={setMethod}
              placeholder="Method"
              width="w-full sm:w-44"
              options={[
                { value: "all", label: "All methods" },
                { value: "bank_transfer", label: "Bank transfer" },
                { value: "upi", label: "UPI" },
                { value: "cash", label: "Cash" },
              ]}
            />
          </Toolbar>

          <DataTable
            columns={columns}
            data={rows}
            rowKey={(p) => p.id}
            pageSize={10}
            emptyTitle="No payments in this view"
            emptyDescription="Change the cycle or status filter to see more payouts."
          />
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark payment as paid?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirm &&
                `${inr(confirm.amount)} for ${farmerName(confirm.farmerId)} (${confirm.period}) will be recorded as settled.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirm) setPaid((p) => [...p, confirm.id]);
                setConfirm(null);
                toast.success("Payment marked as paid");
              }}
            >
              Confirm payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
