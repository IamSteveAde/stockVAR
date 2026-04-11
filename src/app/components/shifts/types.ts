/* ================= STAFF ================= */

export type StaffRole = "owner" | "manager" | "staff";
export type StaffStatus = "active" | "invited" | "archived";

export type Staff = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: StaffStatus;

  /**
   * Login / verification PIN
   * Used to authenticate start & end of shifts
   */
  pin: string;
};

/* ================= SHIFT ================= */

/**
 * Shift lifecycle
 */
export type ShiftStatus = "planned" | "running" | "ended";

/**
 * Physical inventory snapshot
 * Always manually counted (never auto-filled)
 */
export type StockSnapshot = {
  sku: string;
  quantity: number;
};

/**
 * Recurring scheduling rule
 * (Rule-based, industry-standard recurrence)
 */
export type ShiftRecurrence = {
  enabled: boolean;

  /**
   * Days of week this shift repeats on
   * 0 = Sunday, 1 = Monday ... 6 = Saturday
   */
  daysOfWeek: number[];

  /**
   * Optional end date for recurrence
   * YYYY-MM-DD
   */
  until?: string;
};

/**
 * Shift (single scheduled instance)
 */
export type Shift = {
  date: any;
  name: any;
  /* ===== PLANNING ===== */

  id: string;
  label: string;

  /**
   * Scheduled calendar date
   */
  startDate: string; // YYYY-MM-DD

  /**
   * UI-only helper for bulk creation
   * NOT used for runtime logic
   */
  endDate?: string;

  startTime: string; // HH:mm
  endTime: string;   // HH:mm (overnight supported)

  /**
   * Staff assigned to work this shift
   */
  staff: Staff[];

  /**
   * ONE accountable staff member
   * Must authenticate with PIN to start & end shift
   */
  responsibleStaffId: string;
  staffResponsibleName?: string;

  /**
   * Recurrence metadata (optional)
   */
  recurrence?: ShiftRecurrence;

  /**
   * Links generated shifts back to their parent
   * recurring definition
   */
  parentShiftId?: string;
  baseShiftUid?: string;

  /* ===== LIFECYCLE ===== */

  status: ShiftStatus;

  /* ===== EXECUTION (attendance & control) ===== */

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

  /* ===== ACCOUNTABILITY (inventory audit) ===== */

  openingSnapshot?: StockSnapshot[];
  closingSnapshot?: StockSnapshot[];
};
