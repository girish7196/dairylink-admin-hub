import { EntityFormDialog, type FormValues } from "@/components/forms/EntityFormDialog";
import { centres } from "@/data/demo";

export function FarmerFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  mode = "add",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (values: FormValues) => void;
  initialValues?: FormValues;
  mode?: "add" | "edit";
}) {
  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "add" ? "Add farmer" : "Edit farmer"}
      description="Farmer records are shared with the DairyLink farmer app."
      submitLabel={mode === "add" ? "Add farmer" : "Save changes"}
      onSubmit={onSubmit}
      initialValues={initialValues}
      footerNote="Demo mode — changes are not saved."
      fields={[
        { name: "code", label: "Farmer code", placeholder: "DL-1049", required: true },
        { name: "name", label: "Full name", placeholder: "Sandeep Kadam", required: true },
        { name: "phone", label: "Phone", type: "tel", placeholder: "+91 98220 00000", required: true },
        { name: "village", label: "Village", placeholder: "Shirwal", required: true },
        { name: "district", label: "District", placeholder: "Satara", required: true },
        {
          name: "centreId",
          label: "Collection centre",
          type: "select",
          required: true,
          options: centres.map((c) => ({ value: c.id, label: c.name })),
        },
        { name: "cows", label: "Cows", type: "number", placeholder: "4" },
        { name: "buffaloes", label: "Buffaloes", type: "number", placeholder: "2" },
        { name: "bankName", label: "Bank name", placeholder: "Bank of Maharashtra" },
        { name: "accountNumber", label: "Account number", placeholder: "XXXXXX4821" },
        { name: "ifsc", label: "IFSC code", placeholder: "MAHB0000521" },
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
  );
}
