export type StaffRole = "owner" | "manager" | "staff";
export type StaffStatus = "active" | "invited" | "archived";

export type Staff = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: StaffStatus;
  pin: string;
};

/**
 * Shift lifecycle:
 * planned → running → ended
 */
export type ShiftStatus = "planned" | "running" | "ended";

export type StockSnapshot = {
  sku: string;
  quantity: number;
};

export type Shift = {
  /* ===== PLANNING ===== */
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate?: string;
  staff: Staff[];

  /* ===== LIFECYCLE ===== */
  status: ShiftStatus;

  /* ===== EXECUTION (attendance) ===== */
  startedAt?: string;
  startedBy?: {
    staffId: string;
    name: string;
  };

  endedAt?: string;
  endedBy?: {
    staffId: string;
    name: string;
  };

  /* ===== ACCOUNTABILITY ===== */
  openingSnapshot?: StockSnapshot[];
  closingSnapshot?: StockSnapshot[];
};
