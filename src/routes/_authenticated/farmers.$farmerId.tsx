import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Banknote,
  Building2,
  MapPin,
  Milk,
  Pencil,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader, SectionCard } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { FarmerFormDialog } from "@/components/forms/FarmerFormDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SimpleBarChart } from "@/components/common/Charts";
import {
  centreName,
  collections,
  farmerById,
  formatDate,
  inr,
  payments,
  qualityTests,
  receipts,
} from "@/data/demo";

export const Route = createFileRoute("/_authenticated/farmers/$farmerId")({
  loader: ({ params }) => {
    const farmer = farmerById(params.farmerId);
    if (!farmer) throw notFound();
    return { farmer };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.farmer.name ?? "Farmer";
    return {
      meta: [
        { title: `${name} — DairyLink Admin` },
        {
          name: "description",
          content: `Collection history, milk quality readings and payout records for ${name}.`,
        },
        { property: "og:title", content: `${name} — DairyLink Admin` },
        {
          property: "og:description",
          content: "Farmer profile with collection history, quality results and payments.",
        },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  component: FarmerDetail,
});

function FarmerDetail() {
  const { farmer } = Route.useLoaderData();
  const [editing, setEditing] = useState(false);

  const farmerCollections = collections.filter((c) => c.farmerId === farmer.id).slice(0, 12);
  const farmerQuality = qualityTests.filter((q) => q.farmerId === farmer.id).slice(0, 8);
  const farmerPayments = payments.filter((p) => p.farmerId === farmer.id);
  const farmerReceipts = receipts.filter((r) => r.farmerId === farmer.id);

  const chartData = farmerCollections
    .slice(0, 8)
    .reverse()
    .map((c) => ({
      label: `${formatDate(c.date).slice(0, 6)} ${c.shift === "morning" ? "AM" : "PM"}`,
      litres: c.quantity,
    }));

  return (
    <AdminLayout>
      <Button variant="ghost" size="sm" className="-ml-2 w-fit" asChild>
        <Link to="/farmers">
          <ArrowLeft className="mr-1.5 size-4" /> Back to farmers
        </Link>
      </Button>

      <PageHeader
        title={farmer.name}
        description={`${farmer.code} · ${farmer.village}, ${farmer.district}`}
        actions={
          <>
            <StatusBadge value={farmer.status} />
            <Button onClick={() => setEditing(true)}>
              <Pencil className="mr-1.5 size-4" /> Edit farmer
            </Button>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-1">
          <SectionCard title="Contact & location">
            <dl className="space-y-3 text-sm">
              <Row icon={<Phone className="size-4" />} label="Phone" value={farmer.phone} />
              <Row
                icon={<MapPin className="size-4" />}
                label="Village"
                value={`${farmer.village}, ${farmer.district}`}
              />
              <Row
                icon={<Building2 className="size-4" />}
                label="Collection centre"
                value={centreName(farmer.centreId)}
              />
              <Row
                icon={<Milk className="size-4" />}
                label="Cattle"
                value={`${farmer.cows} cows · ${farmer.buffaloes} buffaloes`}
              />
            </dl>
          </SectionCard>

          <SectionCard title="Bank details" description="Used for fortnightly payouts">
            <dl className="space-y-3 text-sm">
              <Row icon={<Banknote className="size-4" />} label="Bank" value={farmer.bankName} />
              <Row label="Account number" value={farmer.accountNumber} />
              <Row label="IFSC" value={farmer.ifsc} />
              <Row label="Member since" value={formatDate(farmer.joinedOn)} />
            </dl>
          </SectionCard>

          <SectionCard title="Average daily supply">
            <p className="text-numeric text-3xl font-semibold">{farmer.avgDailyLitres} L</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Combined morning and evening average over the last 30 days.
            </p>
          </SectionCard>
        </div>

        <div className="space-y-5 lg:col-span-2">
          <SectionCard title="Recent supply" description="Litres per shift">
            {chartData.length ? (
              <SimpleBarChart data={chartData} unit=" L" />
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No collection entries recorded yet.
              </p>
            )}
          </SectionCard>

          <Tabs defaultValue="collections">
            <TabsList>
              <TabsTrigger value="collections">Collections</TabsTrigger>
              <TabsTrigger value="quality">Quality</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="receipts">Receipts</TabsTrigger>
            </TabsList>

            <TabsContent value="collections" className="mt-4">
              <MiniTable
                head={["Date", "Shift", "Qty", "Fat", "SNF", "Amount"]}
                rows={farmerCollections.map((c) => [
                  formatDate(c.date),
                  c.shift,
                  `${c.quantity} L`,
                  `${c.fat}%`,
                  `${c.snf}%`,
                  inr(c.amount),
                ])}
                empty="No collection records for this farmer."
              />
            </TabsContent>

            <TabsContent value="quality" className="mt-4">
              <MiniTable
                head={["Date", "Shift", "Fat", "SNF", "Result"]}
                rows={farmerQuality.map((q) => [
                  formatDate(q.date),
                  q.shift,
                  `${q.fat}%`,
                  `${q.snf}%`,
                  <StatusBadge key={q.id} value={q.status} />,
                ])}
                empty="No quality tests recorded for this farmer."
              />
            </TabsContent>

            <TabsContent value="payments" className="mt-4">
              <MiniTable
                head={["Period", "Litres", "Amount", "Status"]}
                rows={farmerPayments.map((p) => [
                  p.period,
                  `${p.litres} L`,
                  inr(p.amount),
                  <StatusBadge key={p.id} value={p.status} />,
                ])}
                empty="No payouts generated yet."
              />
            </TabsContent>

            <TabsContent value="receipts" className="mt-4">
              <MiniTable
                head={["Receipt no.", "Date", "Amount", "Status"]}
                rows={farmerReceipts.map((r) => [
                  r.number,
                  formatDate(r.date),
                  inr(r.amount),
                  <StatusBadge key={r.id} value={r.status} />,
                ])}
                empty="No receipts issued yet."
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <FarmerFormDialog
        open={editing}
        onOpenChange={setEditing}
        mode="edit"
        initialValues={{
          code: farmer.code,
          name: farmer.name,
          phone: farmer.phone,
          village: farmer.village,
          district: farmer.district,
          centreId: farmer.centreId,
          cows: String(farmer.cows),
          buffaloes: String(farmer.buffaloes),
          bankName: farmer.bankName,
          accountNumber: farmer.accountNumber,
          ifsc: farmer.ifsc,
          status: farmer.status,
        }}
        onSubmit={() => toast.success("Farmer updated", { description: "Demo data is not persisted yet." })}
      />
    </AdminLayout>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="flex items-center gap-2 text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function MiniTable({
  head,
  rows,
  empty,
}: {
  head: string[];
  rows: React.ReactNode[][];
  empty: string;
}) {
  if (!rows.length) {
    return (
      <div className="surface-card p-10 text-center text-sm text-muted-foreground">{empty}</div>
    );
  }
  return (
    <div className="surface-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
            {head.map((h) => (
              <th key={h} className="px-4 py-2.5 text-left font-semibold whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b last:border-0">
              {r.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 capitalize whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
