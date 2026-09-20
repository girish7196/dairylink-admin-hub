/**
 * Demo data layer for DairyLink Admin.
 *
 * Every page reads from the typed accessors at the bottom of this file.
 * Swapping to Supabase later means replacing the accessor bodies only —
 * the shapes below mirror the intended database tables.
 */

export type Status = "active" | "inactive" | "suspended";
export type Shift = "morning" | "evening";
export type MilkType = "cow" | "buffalo";
export type PaymentStatus = "pending" | "processing" | "paid" | "failed";
export type QualityStatus = "excellent" | "good" | "average" | "rejected";

export interface Farmer {
  id: string;
  code: string;
  name: string;
  phone: string;
  village: string;
  district: string;
  centreId: string;
  cows: number;
  buffaloes: number;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  status: Status;
  joinedOn: string;
  avgDailyLitres: number;
}

export interface Centre {
  id: string;
  name: string;
  village: string;
  district: string;
  address: string;
  supervisor: string;
  contact: string;
  farmers: number;
  status: Status;
}

export interface Collection {
  id: string;
  date: string;
  farmerId: string;
  centreId: string;
  shift: Shift;
  milkType: MilkType;
  quantity: number;
  fat: number;
  snf: number;
  rate: number;
  amount: number;
}

export interface QualityTest {
  id: string;
  date: string;
  farmerId: string;
  shift: Shift;
  milkType: MilkType;
  fat: number;
  snf: number;
  status: QualityStatus;
  testedBy: string;
}

export interface MilkRate {
  id: string;
  milkType: MilkType;
  baseRate: number;
  fatBonus: number;
  snfBonus: number;
  effectiveFrom: string;
  note: string;
  current: boolean;
}

export interface Payment {
  id: string;
  farmerId: string;
  period: string;
  litres: number;
  amount: number;
  method: "bank_transfer" | "upi" | "cash";
  status: PaymentStatus;
  reference: string;
  paidOn: string | null;
}

export interface Receipt {
  id: string;
  number: string;
  farmerId: string;
  date: string;
  period: string;
  litres: number;
  amount: number;
  status: PaymentStatus;
}

export interface Employee {
  id: string;
  name: string;
  role: "supervisor" | "collection_operator" | "lab_technician" | "driver" | "accountant";
  phone: string;
  centreId: string;
  status: Status;
  joinedOn: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "payment" | "quality" | "rate" | "general" | "alert";
  date: string;
  read: boolean;
  audience: string;
}

export const centres: Centre[] = [
  {
    id: "c1",
    name: "Shirwal Collection Centre",
    village: "Shirwal",
    district: "Satara",
    address: "Near Gram Panchayat Office, Shirwal - 412801",
    supervisor: "Ramesh Jadhav",
    contact: "+91 98220 41122",
    farmers: 84,
    status: "active",
  },
  {
    id: "c2",
    name: "Wai Chilling Point",
    village: "Wai",
    district: "Satara",
    address: "Krishna Road, Opp. Veterinary Hospital, Wai - 412803",
    supervisor: "Sunita Pawar",
    contact: "+91 98604 77310",
    farmers: 62,
    status: "active",
  },
  {
    id: "c3",
    name: "Baramati Dairy Hub",
    village: "Malegaon BK",
    district: "Pune",
    address: "MIDC Road, Malegaon Budruk, Baramati - 413115",
    supervisor: "Ganesh Shinde",
    contact: "+91 97650 22841",
    farmers: 103,
    status: "active",
  },
  {
    id: "c4",
    name: "Indapur Collection Centre",
    village: "Indapur",
    district: "Pune",
    address: "Market Yard Gate No. 2, Indapur - 413106",
    supervisor: "Kavita Deshmukh",
    contact: "+91 99219 65403",
    farmers: 47,
    status: "active",
  },
  {
    id: "c5",
    name: "Phaltan Village Point",
    village: "Phaltan",
    district: "Satara",
    address: "Station Road, Phaltan - 415523",
    supervisor: "Arjun More",
    contact: "+91 90283 11975",
    farmers: 29,
    status: "inactive",
  },
];

const villages = [
  ["Shirwal", "Satara", "c1"],
  ["Khandala", "Satara", "c1"],
  ["Wai", "Satara", "c2"],
  ["Bhuinj", "Satara", "c2"],
  ["Malegaon BK", "Pune", "c3"],
  ["Sonwadi", "Pune", "c3"],
  ["Indapur", "Pune", "c4"],
  ["Phaltan", "Satara", "c5"],
] as const;

const firstNames = [
  "Sandeep",
  "Vitthal",
  "Anita",
  "Mahadev",
  "Sarika",
  "Balasaheb",
  "Nanda",
  "Prakash",
  "Jyoti",
  "Dattatray",
  "Shobha",
  "Kiran",
  "Rohini",
  "Namdev",
  "Ashwini",
  "Tukaram",
  "Manisha",
  "Bhagwan",
  "Vaishali",
  "Popat",
  "Sunanda",
  "Ravindra",
  "Chhaya",
  "Hanumant",
];
const lastNames = [
  "Kadam",
  "Jadhav",
  "Shinde",
  "Pawar",
  "Bhosale",
  "More",
  "Salunkhe",
  "Gaikwad",
  "Chavan",
  "Nikam",
  "Yadav",
  "Ingle",
];
const banks = ["Bank of Maharashtra", "State Bank of India", "IDBI Bank", "Satara DCC Bank"];

/** Deterministic pseudo-random so demo data is stable between renders/SSR. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

const rnd = seeded(42);

export const farmers: Farmer[] = Array.from({ length: 48 }, (_, i) => {
  const [village, district, centreId] = villages[i % villages.length]!;
  const name = `${firstNames[i % firstNames.length]!} ${lastNames[(i * 5) % lastNames.length]!}`;
  const cows = Math.floor(rnd() * 8) + 1;
  const buffaloes = Math.floor(rnd() * 5);
  const status: Status = i % 17 === 0 ? "inactive" : i % 23 === 0 ? "suspended" : "active";
  return {
    id: `f${i + 1}`,
    code: `DL-${String(1001 + i)}`,
    name,
    phone: `+91 9${String(800000000 + Math.floor(rnd() * 99999999)).slice(0, 9)}`,
    village,
    district,
    centreId,
    cows,
    buffaloes,
    bankName: banks[i % banks.length]!,
    accountNumber: `XXXXXX${String(1000 + i * 7).slice(-4)}`,
    ifsc: ["MAHB0000521", "SBIN0001234", "IBKL0000289", "HDFC0000912"][i % 4]!,
    status,
    joinedOn: `202${3 + (i % 3)}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
    avgDailyLitres: Number((cows * 6.4 + buffaloes * 5.1 + rnd() * 4).toFixed(1)),
  };
});

export const TODAY = "2026-09-20";

function dateOffset(days: number) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export const milkRates: MilkRate[] = [
  {
    id: "r1",
    milkType: "cow",
    baseRate: 34.5,
    fatBonus: 1.8,
    snfBonus: 1.2,
    effectiveFrom: dateOffset(12),
    note: "Monsoon season revision approved by the board.",
    current: true,
  },
  {
    id: "r2",
    milkType: "buffalo",
    baseRate: 52.0,
    fatBonus: 2.4,
    snfBonus: 1.5,
    effectiveFrom: dateOffset(12),
    note: "Monsoon season revision approved by the board.",
    current: true,
  },
  {
    id: "r3",
    milkType: "cow",
    baseRate: 33.0,
    fatBonus: 1.7,
    snfBonus: 1.1,
    effectiveFrom: dateOffset(58),
    note: "Quarterly revision.",
    current: false,
  },
  {
    id: "r4",
    milkType: "buffalo",
    baseRate: 50.5,
    fatBonus: 2.2,
    snfBonus: 1.4,
    effectiveFrom: dateOffset(58),
    note: "Quarterly revision.",
    current: false,
  },
  {
    id: "r5",
    milkType: "cow",
    baseRate: 31.75,
    fatBonus: 1.5,
    snfBonus: 1.0,
    effectiveFrom: dateOffset(121),
    note: "Summer flush rate.",
    current: false,
  },
];

export function currentRate(milkType: MilkType) {
  return milkRates.find((r) => r.current && r.milkType === milkType)!;
}

const collectionRnd = seeded(7);

export const collections: Collection[] = (() => {
  const rows: Collection[] = [];
  let n = 1;
  for (let day = 0; day < 30; day++) {
    const date = dateOffset(day);
    for (const shift of ["morning", "evening"] as Shift[]) {
      const count = shift === "morning" ? 22 : 16;
      for (let i = 0; i < count; i++) {
        const farmer = farmers[(day * 7 + i * 3 + (shift === "evening" ? 5 : 0)) % farmers.length]!;
        if (farmer.status !== "active") continue;
        const milkType: MilkType = farmer.buffaloes > farmer.cows ? "buffalo" : "cow";
        const rateRow = currentRate(milkType);
        const quantity = Number(
          (farmer.avgDailyLitres * (shift === "morning" ? 0.58 : 0.42) + collectionRnd() * 3).toFixed(1),
        );
        const fat = Number(
          ((milkType === "cow" ? 3.6 : 6.2) + collectionRnd() * 1.2 - 0.4).toFixed(1),
        );
        const snf = Number((8.3 + collectionRnd() * 0.9).toFixed(1));
        const rate = Number(
          (
            rateRow.baseRate +
            (fat - (milkType === "cow" ? 3.5 : 6.0)) * rateRow.fatBonus +
            (snf - 8.5) * rateRow.snfBonus
          ).toFixed(2),
        );
        rows.push({
          id: `col${n++}`,
          date,
          farmerId: farmer.id,
          centreId: farmer.centreId,
          shift,
          milkType,
          quantity,
          fat,
          snf,
          rate,
          amount: Number((quantity * rate).toFixed(2)),
        });
      }
    }
  }
  return rows;
})();

export const qualityTests: QualityTest[] = collections.slice(0, 120).map((c, i) => {
  const status: QualityStatus =
    c.fat >= (c.milkType === "cow" ? 4.0 : 6.5) && c.snf >= 8.7
      ? "excellent"
      : c.fat >= (c.milkType === "cow" ? 3.4 : 5.8) && c.snf >= 8.4
        ? "good"
        : c.snf >= 8.1
          ? "average"
          : "rejected";
  return {
    id: `q${i + 1}`,
    date: c.date,
    farmerId: c.farmerId,
    shift: c.shift,
    milkType: c.milkType,
    fat: c.fat,
    snf: c.snf,
    status,
    testedBy: ["Sunita Pawar", "Ganesh Shinde", "Kavita Deshmukh"][i % 3]!,
  };
});

export const payments: Payment[] = farmers.slice(0, 36).map((f, i) => {
  const litres = Number((f.avgDailyLitres * 10).toFixed(1));
  const amount = Number((litres * (f.buffaloes > f.cows ? 54 : 36)).toFixed(2));
  const status: PaymentStatus =
    i % 6 === 0 ? "pending" : i % 11 === 0 ? "processing" : i % 17 === 0 ? "failed" : "paid";
  return {
    id: `p${i + 1}`,
    farmerId: f.id,
    period: i % 2 === 0 ? "01–10 Sep 2026" : "11–20 Sep 2026",
    litres,
    amount,
    method: i % 3 === 0 ? "upi" : i % 7 === 0 ? "cash" : "bank_transfer",
    status,
    reference: status === "paid" ? `TXN${String(890021 + i * 13)}` : "—",
    paidOn: status === "paid" ? dateOffset((i % 9) + 1) : null,
  };
});

export const receipts: Receipt[] = payments.map((p, i) => ({
  id: `rc${i + 1}`,
  number: `RCT-2609-${String(101 + i)}`,
  farmerId: p.farmerId,
  date: p.paidOn ?? dateOffset(i % 5),
  period: p.period,
  litres: p.litres,
  amount: p.amount,
  status: p.status,
}));

export const employees: Employee[] = [
  { id: "e1", name: "Ramesh Jadhav", role: "supervisor", phone: "+91 98220 41122", centreId: "c1", status: "active", joinedOn: "2021-06-14" },
  { id: "e2", name: "Sunita Pawar", role: "lab_technician", phone: "+91 98604 77310", centreId: "c2", status: "active", joinedOn: "2022-02-01" },
  { id: "e3", name: "Ganesh Shinde", role: "supervisor", phone: "+91 97650 22841", centreId: "c3", status: "active", joinedOn: "2020-11-09" },
  { id: "e4", name: "Kavita Deshmukh", role: "lab_technician", phone: "+91 99219 65403", centreId: "c4", status: "active", joinedOn: "2023-04-18" },
  { id: "e5", name: "Arjun More", role: "collection_operator", phone: "+91 90283 11975", centreId: "c5", status: "inactive", joinedOn: "2022-09-23" },
  { id: "e6", name: "Sachin Bhosale", role: "driver", phone: "+91 98811 30442", centreId: "c1", status: "active", joinedOn: "2023-01-11" },
  { id: "e7", name: "Pallavi Nikam", role: "accountant", phone: "+91 97302 55418", centreId: "c3", status: "active", joinedOn: "2021-08-30" },
  { id: "e8", name: "Dnyaneshwar Kale", role: "collection_operator", phone: "+91 96072 84410", centreId: "c2", status: "active", joinedOn: "2024-03-05" },
  { id: "e9", name: "Rupali Salunkhe", role: "collection_operator", phone: "+91 90496 12238", centreId: "c4", status: "active", joinedOn: "2024-07-22" },
  { id: "e10", name: "Vijay Gaikwad", role: "driver", phone: "+91 98345 67012", centreId: "c3", status: "suspended", joinedOn: "2022-12-02" },
];

export const notifications: Notification[] = [
  {
    id: "n1",
    title: "Cow milk rate revised to ₹34.50/L",
    message:
      "The new base rate is effective from this morning's collection. Fat bonus is now ₹1.80 per point.",
    type: "rate",
    date: dateOffset(0),
    read: false,
    audience: "All farmers",
  },
  {
    id: "n2",
    title: "Fortnightly payment released",
    message: "Payments for 01–10 Sep 2026 have been credited to registered bank accounts.",
    type: "payment",
    date: dateOffset(1),
    read: false,
    audience: "All farmers",
  },
  {
    id: "n3",
    title: "Low SNF readings at Wai Chilling Point",
    message:
      "Nine samples recorded SNF below 8.2 in the evening shift. Supervisors, please re-check the analyser calibration.",
    type: "quality",
    date: dateOffset(1),
    read: true,
    audience: "Wai Chilling Point",
  },
  {
    id: "n4",
    title: "Cattle vaccination camp on 26 Sep",
    message: "Free FMD vaccination camp at Shirwal Collection Centre between 9 AM and 2 PM.",
    type: "general",
    date: dateOffset(3),
    read: true,
    audience: "Shirwal Collection Centre",
  },
  {
    id: "n5",
    title: "Evening collection delayed by 45 minutes",
    message: "Tanker route to Baramati Dairy Hub is delayed due to road repair work near Sonwadi.",
    type: "alert",
    date: dateOffset(4),
    read: true,
    audience: "Baramati Dairy Hub",
  },
  {
    id: "n6",
    title: "Update your bank details",
    message: "Farmers with pending IFSC verification should visit their collection centre this week.",
    type: "general",
    date: dateOffset(6),
    read: true,
    audience: "23 farmers",
  },
];

/* ---------------- accessors (swap these for Supabase queries later) --------------- */

export const farmerById = (id: string) => farmers.find((f) => f.id === id);
export const centreById = (id: string) => centres.find((c) => c.id === id);
export const farmerName = (id: string) => farmerById(id)?.name ?? "Unknown farmer";
export const farmerCode = (id: string) => farmerById(id)?.code ?? "—";
export const centreName = (id: string) => centreById(id)?.name ?? "—";

export const collectionsOn = (date: string) => collections.filter((c) => c.date === date);

export function dashboardStats() {
  const today = collectionsOn(TODAY);
  const morning = today.filter((c) => c.shift === "morning");
  const evening = today.filter((c) => c.shift === "evening");
  const sum = (rows: Collection[], key: "quantity" | "amount") =>
    rows.reduce((t, r) => t + r[key], 0);
  return {
    totalFarmers: farmers.length,
    activeFarmers: farmers.filter((f) => f.status === "active").length,
    todayLitres: sum(today, "quantity"),
    todayValue: sum(today, "amount"),
    pendingPayments: payments.filter((p) => p.status === "pending" || p.status === "processing"),
    pendingAmount: payments
      .filter((p) => p.status === "pending" || p.status === "processing")
      .reduce((t, p) => t + p.amount, 0),
    activeCentres: centres.filter((c) => c.status === "active").length,
    totalCentres: centres.length,
    morningLitres: sum(morning, "quantity"),
    morningCount: morning.length,
    eveningLitres: sum(evening, "quantity"),
    eveningCount: evening.length,
  };
}

export function collectionTrend(days = 14) {
  return Array.from({ length: days }, (_, i) => {
    const date = dateOffset(days - 1 - i);
    const rows = collectionsOn(date);
    return {
      date,
      label: new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      morning: Number(
        rows.filter((r) => r.shift === "morning").reduce((t, r) => t + r.quantity, 0).toFixed(1),
      ),
      evening: Number(
        rows.filter((r) => r.shift === "evening").reduce((t, r) => t + r.quantity, 0).toFixed(1),
      ),
      litres: Number(rows.reduce((t, r) => t + r.quantity, 0).toFixed(1)),
      value: Number(rows.reduce((t, r) => t + r.amount, 0).toFixed(0)),
    };
  });
}

export function paymentTrend() {
  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  const base = [812000, 868500, 905300, 874200, 941800, 623400];
  const pend = [42000, 38500, 51200, 33800, 47600, 118900];
  return months.map((m, i) => ({ label: m, paid: base[i]!, pending: pend[i]! }));
}

export function qualityBreakdown() {
  const counts: Record<QualityStatus, number> = {
    excellent: 0,
    good: 0,
    average: 0,
    rejected: 0,
  };
  qualityTests.forEach((q) => (counts[q.status] += 1));
  return (Object.keys(counts) as QualityStatus[]).map((k) => ({ label: k, value: counts[k] }));
}

export function centrePerformance() {
  return centres.map((c) => {
    const rows = collectionsOn(TODAY).filter((r) => r.centreId === c.id);
    return {
      label: c.name.replace(/ (Collection Centre|Chilling Point|Dairy Hub|Village Point)/, ""),
      litres: Number(rows.reduce((t, r) => t + r.quantity, 0).toFixed(1)),
      amount: Number(rows.reduce((t, r) => t + r.amount, 0).toFixed(0)),
      farmers: c.farmers,
    };
  });
}

export const inr = (n: number) =>
  `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: n % 1 ? 2 : 0 })}`;

export const litres = (n: number) => `${n.toLocaleString("en-IN", { maximumFractionDigits: 1 })} L`;

export const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export const titleCase = (s: string) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
