import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  IndianRupee,
  Milk,
  Moon,
  Sunrise,
  Users,
  Wallet,
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader, SectionCard } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CollectionAreaChart, PaymentBarChart } from "@/components/common/Charts";
import { Button } from "@/components/ui/button";
import {
  TODAY,
  collectionTrend,
  collectionsOn,
  dashboardStats,
  farmerCode,
  farmerName,
  formatDate,
  inr,
  litres,
  notifications,
  payments,
  paymentTrend,
  titleCase,
} from "@/data/demo";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "Dashboard — DairyLink Admin" },
      {
        name: "description",
        content:
          "Daily overview of milk collection, farmer payouts, quality and collection centre activity.",
      },
      { property: "og:title", content: "Dashboard — DairyLink Admin" },
      {
        property: "og:description",
        content: "Track today's milk collection, milk value and pending farmer payments.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const s = dashboardStats();
  const trend = collectionTrend(14);
  const recentCollections = collectionsOn(TODAY).slice(0, 6);
  const recentPayments = payments.slice(0, 5);

  return (
    <AdminLayout>
      <PageHeader
        title="Dashboard"
        description={`Society overview for ${formatDate(TODAY)} · Morning and evening shifts`}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/reports">View reports</Link>
            </Button>
            <Button asChild>
              <Link to="/collection">Record collection</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total farmers"
          value={String(s.totalFarmers)}
          hint={`${s.activeFarmers} active`}
          icon={Users}
          delta={2.4}
        />
        <StatCard
          label="Today's milk collection"
          value={litres(Number(s.todayLitres.toFixed(1)))}
          hint="across all centres"
          icon={Milk}
          tone="cream"
          delta={3.8}
        />
        <StatCard
          label="Today's milk value"
          value={inr(Math.round(s.todayValue))}
          hint="payable to farmers"
          icon={IndianRupee}
          tone="info"
          delta={1.6}
        />
        <StatCard
          label="Pending payments"
          value={inr(Math.round(s.pendingAmount))}
          hint={`${s.pendingPayments.length} farmers awaiting payout`}
          icon={Wallet}
          tone="warning"
          delta={-4.2}
        />
        <StatCard
          label="Active collection centres"
          value={`${s.activeCentres} / ${s.totalCentres}`}
          hint="1 centre temporarily closed"
          icon={Building2}
        />
        <StatCard
          label="Morning collection"
          value={litres(Number(s.morningLitres.toFixed(1)))}
          hint={`${s.morningCount} entries`}
          icon={Sunrise}
          tone="cream"
        />
        <StatCard
          label="Evening collection"
          value={litres(Number(s.eveningLitres.toFixed(1)))}
          hint={`${s.eveningCount} entries`}
          icon={Moon}
          tone="info"
        />
        <StatCard
          label="Average rate today"
          value={`₹${(s.todayValue / Math.max(s.todayLitres, 1)).toFixed(2)} / L`}
          hint="fat & SNF adjusted"
          icon={IndianRupee}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <SectionCard
          title="Milk collection trend"
          description="Litres collected per shift over the last 14 days"
          className="xl:col-span-2"
        >
          <CollectionAreaChart data={trend} height={420} />
        </SectionCard>

        <SectionCard title="Recent notifications" description="Latest broadcasts to farmers">
          <ul className="space-y-3">
            {notifications.slice(0, 4).map((n) => (
              <li key={n.id} className="rounded-xl border p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium leading-snug">{n.title}</p>
                  {!n.read && <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />}
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{n.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {titleCase(n.type)} · {formatDate(n.date)}
                </p>
              </li>
            ))}
          </ul>
          <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
            <Link to="/notifications">View all notifications</Link>
          </Button>
        </SectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <SectionCard
          title="Payment trend"
          description="Paid vs pending payouts by month"
          className="xl:col-span-2"
        >
          <PaymentBarChart data={paymentTrend()} height={400} />
        </SectionCard>

        <SectionCard title="Recent payments" description="Latest farmer payouts">
          <ul className="divide-y">
            {recentPayments.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-3 first:pt-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{farmerName(p.farmerId)}</p>
                  <p className="text-xs text-muted-foreground">{p.period}</p>
                </div>
                <div className="text-right">
                  <p className="text-numeric text-sm font-semibold">{inr(p.amount)}</p>
                  <StatusBadge value={p.status} className="mt-1" />
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard
        title="Recent milk collections"
        description={`Entries recorded on ${formatDate(TODAY)}`}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link to="/collection">Open collection log</Link>
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 text-left font-semibold">Farmer</th>
                <th className="px-3 py-2 text-left font-semibold">Shift</th>
                <th className="hidden px-3 py-2 text-left font-semibold sm:table-cell">Type</th>
                <th className="px-3 py-2 text-right font-semibold">Qty</th>
                <th className="hidden px-3 py-2 text-right font-semibold md:table-cell">Fat</th>
                <th className="hidden px-3 py-2 text-right font-semibold md:table-cell">SNF</th>
                <th className="px-3 py-2 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentCollections.map((c) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="px-3 py-2.5">
                    <p className="font-medium">{farmerName(c.farmerId)}</p>
                    <p className="text-numeric text-xs text-muted-foreground">
                      {farmerCode(c.farmerId)}
                    </p>
                  </td>
                  <td className="px-3 py-2.5 capitalize">{c.shift}</td>
                  <td className="hidden px-3 py-2.5 capitalize sm:table-cell">{c.milkType}</td>
                  <td className="text-numeric px-3 py-2.5 text-right">{c.quantity} L</td>
                  <td className="text-numeric hidden px-3 py-2.5 text-right md:table-cell">
                    {c.fat}%
                  </td>
                  <td className="text-numeric hidden px-3 py-2.5 text-right md:table-cell">
                    {c.snf}%
                  </td>
                  <td className="text-numeric px-3 py-2.5 text-right font-semibold">
                    {inr(c.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </AdminLayout>
  );
}
