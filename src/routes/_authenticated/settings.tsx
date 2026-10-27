import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LogOut, Monitor, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader, SectionCard } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme, type Theme } from "@/lib/theme";
import { useAdminSignOut } from "@/lib/admin-auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — DairyLink Admin" },
      {
        name: "description",
        content: "Admin profile, appearance, language, notification preferences and system defaults.",
      },
      { property: "og:title", content: "Settings — DairyLink Admin" },
      {
        property: "og:description",
        content: "Configure your DairyLink admin profile, theme and notification preferences.",
      },
    ],
  }),
  component: SettingsPage,
});

const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const signOut = useAdminSignOut();
  const [language, setLanguage] = useState("en");
  const [prefs, setPrefs] = useState({
    collectionAlerts: true,
    qualityAlerts: true,
    paymentAlerts: true,
    weeklyDigest: false,
  });

  return (
    <AdminLayout>
      <PageHeader
        title="Settings"
        description="Manage your admin account and how the dashboard behaves"
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Admin profile" description="Shown to other administrators">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="fullname">Full name</Label>
              <Input id="fullname" defaultValue="Anil Deshpande" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input id="admin-email" type="email" defaultValue="admin@dairylink.in" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-phone">Phone</Label>
              <Input id="admin-phone" type="tel" defaultValue="+91 98500 12345" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input id="designation" defaultValue="Dairy Administrator" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="society">Society</Label>
              <Input id="society" defaultValue="DairyLink Dairy Society" />
            </div>
          </div>
          <Button className="mt-4" onClick={() => toast.success("Profile saved")}>
            Save profile
          </Button>
        </SectionCard>

        <div className="space-y-5">
          <SectionCard title="Appearance" description="Choose how DairyLink Admin looks">
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setTheme(o.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors",
                    theme === o.value
                      ? "border-primary bg-primary-soft text-primary"
                      : "hover:bg-accent",
                  )}
                >
                  <o.icon className="size-5" />
                  {o.label}
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Language" description="Used across the admin dashboard">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-2 text-xs text-muted-foreground">
              Farmer app language is set separately by each farmer.
            </p>
          </SectionCard>

          <SectionCard title="Notification preferences" description="Alerts sent to your email">
            <div className="space-y-4">
              {[
                ["collectionAlerts", "Collection summaries", "Morning and evening shift totals"],
                ["qualityAlerts", "Quality alerts", "Rejected samples and low SNF readings"],
                ["paymentAlerts", "Payment updates", "Payout runs and failed transfers"],
                ["weeklyDigest", "Weekly digest", "A Monday summary of society performance"],
              ].map(([key, title, desc]) => (
                <div key={key} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <Switch
                    checked={prefs[key as keyof typeof prefs]}
                    onCheckedChange={(v) => setPrefs((p) => ({ ...p, [key as string]: v }))}
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      <SectionCard title="System settings" description="Defaults applied across the society">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Payment cycle</Label>
            <Select defaultValue="fortnightly">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="fortnightly">Fortnightly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Select defaultValue="inr">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inr">Indian Rupee (₹)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Morning shift cut-off</Label>
            <Input type="time" defaultValue="09:30" />
          </div>
          <div className="space-y-2">
            <Label>Evening shift cut-off</Label>
            <Input type="time" defaultValue="19:30" />
          </div>
        </div>
        <Button variant="outline" className="mt-4" onClick={() => toast.success("System settings saved")}>
          Save system settings
        </Button>
      </SectionCard>

      <SectionCard title="Session" description="You will need to sign in again to continue">
        <Button variant="destructive" onClick={() => void signOut()}>
          <LogOut className="mr-1.5 size-4" /> Log out
        </Button>
      </SectionCard>
    </AdminLayout>
  );
}
