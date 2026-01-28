export default function StaffStatusBadge({
  status,
}: {
  status: "invited" | "active" | "disabled";
}) {
  const styles = {
    invited: "bg-yellow-100 text-yellow-800",
    active: "bg-green-100 text-green-800",
    disabled: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}