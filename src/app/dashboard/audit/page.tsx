import AuditTable from "./AuditTable";

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Audit Trail</h1>
        <p className="text-sm text-gray-500">
          Complete record of all actions performed on the system
        </p>
      </div>

      <AuditTable />
    </div>
  );
}
