import { useEffect, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface Field {
  name: string;
  label: string;
  type?: "text" | "number" | "tel" | "date" | "select" | "textarea";
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  full?: boolean;
  hint?: string;
}

export type FormValues = Record<string, string>;

export function EntityFormDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  initialValues = {},
  submitLabel = "Save",
  onSubmit,
  footerNote,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  fields: Field[];
  initialValues?: FormValues;
  submitLabel?: string;
  onSubmit: (values: FormValues) => void | Promise<void>;
  footerNote?: ReactNode;
}) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setValues(initialValues);
      setErrors({});
      setSubmitError(null);
      setSaving(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const set = (name: string, value: string) =>
    setValues((v) => ({ ...v, [name]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSubmitError(null);
    const next: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.required && !String(values[f.name] ?? "").trim()) {
        next[f.name] = `${f.label} is required`;
      }
    });
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    try {
      await onSubmit(values);
      onOpenChange(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(value) => { if (!saving) onOpenChange(value); }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.name} className={cn("space-y-2", f.full && "sm:col-span-2")}>
              <Label htmlFor={f.name}>
                {f.label}
                {f.required && <span className="ml-0.5 text-destructive">*</span>}
              </Label>

              {f.type === "select" ? (
                <Select value={values[f.name] ?? ""} onValueChange={(v) => set(f.name, v)}>
                  <SelectTrigger id={f.name} className="w-full">
                    <SelectValue placeholder={f.placeholder ?? "Select"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(f.options ?? []).map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : f.type === "textarea" ? (
                <Textarea
                  id={f.name}
                  value={values[f.name] ?? ""}
                  placeholder={f.placeholder}
                  onChange={(e) => set(f.name, e.target.value)}
                  rows={3}
                />
              ) : (
                <Input
                  id={f.name}
                  type={f.type ?? "text"}
                  step={f.type === "number" ? "0.1" : undefined}
                  value={values[f.name] ?? ""}
                  placeholder={f.placeholder}
                  onChange={(e) => set(f.name, e.target.value)}
                />
              )}

              {errors[f.name] ? (
                <p className="text-xs text-destructive">{errors[f.name]}</p>
              ) : f.hint ? (
                <p className="text-xs text-muted-foreground">{f.hint}</p>
              ) : null}
            </div>
          ))}

          {submitError && <p role="alert" className="text-sm text-destructive sm:col-span-2">{submitError}</p>}
          <DialogFooter className="sm:col-span-2">
            {footerNote && (
              <p className="mr-auto self-center text-xs text-muted-foreground">{footerNote}</p>
            )}
            <Button type="button" variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              {saving ? "Saving…" : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
