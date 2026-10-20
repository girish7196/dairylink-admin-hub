import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { getExternalSupabase } from "@/lib/external-supabase";

export const RATE_COLUMNS = "id,effective_from,cow_rate_per_litre,buffalo_rate_per_litre,fat_bonus_per_percent,snf_bonus_per_percent,created_at";

const rowSchema = z.object({
  id: z.string(),
  effective_from: z.string(),
  cow_rate_per_litre: z.coerce.number().finite(),
  buffalo_rate_per_litre: z.coerce.number().finite(),
  fat_bonus_per_percent: z.coerce.number().finite(),
  snf_bonus_per_percent: z.coerce.number().finite(),
  created_at: z.string(),
});
export type MilkRateRow = z.infer<typeof rowSchema>;

export function localDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function latestEffectiveRate(rows: MilkRateRow[], today: string): MilkRateRow | undefined {
  return rows.filter((row) => row.effective_from.slice(0, 10) <= today)
    .sort((a, b) => b.effective_from.localeCompare(a.effective_from) || b.created_at.localeCompare(a.created_at))[0];
}

const rateInsertSchema = z.object({
  effective_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid effective date.")
    .refine((value) => !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value, "Choose a valid effective date."),
  cow_rate_per_litre: z.coerce.number().finite().nonnegative(),
  buffalo_rate_per_litre: z.coerce.number().finite().nonnegative(),
  fat_bonus_per_percent: z.coerce.number().finite().nonnegative(),
  snf_bonus_per_percent: z.coerce.number().finite().nonnegative(),
});

export function rateInsertFromForm(values: Record<string, string>) {
  for (const field of ["effective_from", "cow_rate_per_litre", "buffalo_rate_per_litre", "fat_bonus_per_percent", "snf_bonus_per_percent"]) {
    if (!values[field]?.trim()) throw new Error("Enter the effective date, both base rates and both bonuses.");
  }
  const parsed = rateInsertSchema.safeParse(values);
  if (!parsed.success) throw new Error("Enter a valid effective date and non-negative rates and bonuses.");
  return parsed.data;
}

export function rateRequestError(error: { code?: string; message: string }): Error {
  if (error.code === "42501" || /row.level security|permission denied/i.test(error.message)) {
    return new Error("Access to milk rates was denied. A real authorized admin session and the existing milk_rates permissions are required.");
  }
  return new Error(`Milk rates request failed: ${error.message}`);
}

export const milkRatesQueryOptions = () => queryOptions({
  queryKey: ["external-milk-rates"],
  queryFn: async ({ signal }) => {
    const { data, error } = await getExternalSupabase().schema("public").from("milk_rates")
      .select(RATE_COLUMNS).order("effective_from", { ascending: false })
      .order("created_at", { ascending: false }).abortSignal(signal);
    if (error) throw rateRequestError(error);
    return z.array(rowSchema).parse(data);
  },
  retry: false,
});

export async function insertMilkRate(values: Record<string, string>): Promise<void> {
  const payload = rateInsertFromForm(values);
  const { error } = await getExternalSupabase().schema("public").from("milk_rates").insert(payload);
  if (error) throw rateRequestError(error);
}