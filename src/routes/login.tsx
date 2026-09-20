import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, Milk } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — DairyLink" },
      {
        name: "description",
        content: "Sign in to the DairyLink admin dashboard to manage milk collection, farmers and payments.",
      },
      { property: "og:title", content: "Admin Sign In — DairyLink" },
      {
        property: "og:description",
        content: "Secure sign in for dairy administrators managing collection centres and farmer payments.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@dairylink.in");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Enter both email and password to continue.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Signed in", { description: "Welcome back to DairyLink Admin." });
      navigate({ to: "/" });
    }, 900);
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15">
            <Milk className="size-5" />
          </span>
          <span className="font-display text-xl font-semibold">DairyLink</span>
        </div>
        <div className="max-w-md">
          <h1 className="font-display text-4xl font-semibold leading-tight">
            Milk collection, quality and payouts in one place.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/80">
            Record morning and evening shifts, track fat and SNF readings, publish rate revisions
            and release farmer payments — all from a single admin workspace.
          </p>
          <dl className="mt-10 grid grid-cols-3 gap-4 text-sm">
            {[
              ["Shifts", "Morning & evening"],
              ["Quality", "Fat & SNF logs"],
              ["Payouts", "Fortnightly cycles"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-primary-foreground/10 p-3">
                <dt className="font-semibold">{k}</dt>
                <dd className="mt-1 text-primary-foreground/75">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="text-xs text-primary-foreground/60">
          Demo workspace — sample dairy society data.
        </p>
      </div>

      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Milk className="size-5" />
            </span>
            <span className="font-display text-xl font-semibold">DairyLink</span>
          </div>

          <h2 className="text-2xl font-semibold">Admin sign in</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Use your administrator account to continue.
          </p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@dairylink.in"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox defaultChecked /> Remember me
              </label>
              <Dialog>
                <DialogTrigger asChild>
                  <button type="button" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset your password</DialogTitle>
                    <DialogDescription>
                      We'll send a reset link to your registered admin email address.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input id="reset-email" type="email" placeholder="you@dairylink.in" />
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => toast.success("Reset link sent to your email.")}
                      className="w-full sm:w-auto"
                    >
                      Send reset link
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Farmer accounts use the DairyLink Android app.
          </p>
        </div>
      </div>
    </div>
  );
}
