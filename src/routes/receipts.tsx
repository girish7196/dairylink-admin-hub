import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Printer, Receipt as ReceiptIcon } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { FilterSelect, Toolbar } from "@/components/common/Toolbar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  centreName,
  farmerById,
  farmerCode,
  farmerName,
  formatDate,
  inr,
  receipts,
  type Receipt,
} from "@/data/demo";

export const Route = createFileRoute("/receipts")({
  head: () => ({
    meta: [
      { title: "Receipts — DairyLink Admin" },
      {
        name: "description",
        content: "Farmer payment receipts with receipt number, period, litres supplied and payable amount.",
      },
      { property: "og:title", content: "Receipts — DairyLink Admin" },
      {
        property: "og:description",
        content: "View, print and download payout receipts issued to farmers.",
      },
    ],
  }),
  component: ReceiptsPage,
});

function ReceiptsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Receipt | null>(null);

  const rows = useMemo(
    () =>
      receipts.filter((r) => {
        const q = search.trim().toLowerCase();
        const matches =
          !q ||
          r.number.toLowerCase().includes(q) ||
          farmerName(r.farmerId).toLowerCase().includes(q) ||
          farmerCode(r.farmerId).toLowerCase().includes(q);
        return matches && (status === "all" || r.status === status);
      }),
    [search, status],
  );

  const columns: Column<Receipt>[] = [
    {
      key: "number",
      header: "Receipt no.",
      render: (r) => <span className="text-numeric font-medium">{r.number}</span>,
    },
    {
      key: "farmer",
      header: "Farmer",
      render: (r) => (
        <div>
          <p className="font-medium">{farmerName(r.farmerId)}</p>
          <p className="text-numeric text-xs text-muted-foreground">{farmerCode(r.farmerId)}</p>
        </div>
      ),
    },
    { key: "period", header: "Period", hideOn: "md", render: (r) => r.period },
    { key: "date", header: "Date", render: (r) => formatDate(r.date) },
    {
      key: "litres",
      header: "Litres",
      align: "right",
      hideOn: "sm",
      render: (r) => <span className="text-numeric">{r.litres} L</span>,
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (r) => <span className="text-numeric font-semibold">{inr(r.amount)}</span>,
    },
    { key: "status", header: "Status", render: (r) => <StatusBadge value={r.status} /> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (r) => (
        <Button size="sm" variant="outline" onClick={() => setSelected(r)}>
          View receipt
        </Button>
      ),
    },
  ];

  const farmer = selected ? farmerById(selected.farmerId) : undefined;

  return (
    <AdminLayout>
      <PageHeader
        title="Receipts"
        description="Payout receipts issued to farmers for each payment cycle"
        actions={
          <Button variant="outline" onClick={() => toast.success("Bulk download prepared (demo)")}>
            <Download className="mr-1.5 size-4" /> Download all
          </Button>
        }
      />

      <Toolbar search={search} onSearch={setSearch} placeholder="Search receipt number or farmer…">
        <FilterSelect
          value={status}
          onChange={setStatus}
          placeholder="Status"
          width="w-full sm:w-44"
          options={[
            { value: "all", label: "All statuses" },
            { value: "paid", label: "Paid" },
            { value: "pending", label: "Pending" },
            { value: "processing", label: "Processing" },
            { value: "failed", label: "Failed" },
          ]}
        />
      </Toolbar>

      <DataTable
        columns={columns}
        data={rows}
        rowKey={(r) => r.id}
        pageSize={10}
        emptyTitle="No receipts found"
        emptyDescription="Receipts are generated once a payout cycle is processed."
      />

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Payment receipt</DialogTitle>
            <DialogDescription>Society copy — generated from the payout record.</DialogDescription>
          </DialogHeader>

          {selected && farmer && (
            <div className="rounded-xl border bg-card p-5">
              <div className="flex items-start justify-between gap-3 border-b pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <ReceiptIcon className="size-4.5" />
                  </span>
                  <div>
                    <p className="font-display font-semibold">DairyLink Dairy Society</p>
                    <p className="text-xs text-muted-foreground">{centreName(farmer.centreId)}</p>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <p className="text-numeric font-semibold">{selected.number}</p>
                  <p className="text-muted-foreground">{formatDate(selected.date)}</p>
                </div>
              </div>

              <dl className="space-y-2.5 py-4 text-sm">
                <Line label="Farmer" value={`${farmer.name} (${farmer.code})`} />
                <Line label="Village" value={`${farmer.village}, ${farmer.district}`} />
                <Line label="Period" value={selected.period} />
                <Line label="Total quantity" value={`${selected.litres} L`} />
                <Line label="Bank account" value={`${farmer.bankName} · ${farmer.accountNumber}`} />
              </dl>

              <div className="flex items-center justify-between rounded-lg bg-primary-soft px-4 py-3">
                <span className="text-sm font-medium">Net payable</span>
                <span className="text-numeric text-lg font-semibold">{inr(selected.amount)}</span>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>Payment status</span>
                <StatusBadge value={selected.status} />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => toast.success("Receipt sent to printer (demo)")}>
              <Printer className="mr-1.5 size-4" /> Print
            </Button>
            <Button onClick={() => toast.success("Receipt downloaded (demo)")}>
              <Download className="mr-1.5 size-4" /> Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
