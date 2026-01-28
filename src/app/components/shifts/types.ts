export type Staff = {
  id: string;
  fullName: string;
  role: "owner" | "manager" | "staff";
};

export type Shift = {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate?: string;
  staff: Staff[];
};