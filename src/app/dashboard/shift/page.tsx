import ShiftTable from "../../components/shifts/ShiftTable";

export default function ShiftsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Shifts</h1>
      <ShiftTable />
    </div>
  );
}