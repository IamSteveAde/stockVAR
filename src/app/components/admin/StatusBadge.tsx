export type Status =
  | "active"
  | "trial"
  | "expired"
  | "suspended";

const STATUS_CONFIG: Record<
  Status,
  {
    label: string;
    className: string;
  }
> = {
  active: {
    label: "Active",
    className: "bg-green-100 text-green-700",
  },
  trial: {
    label: "Trial",
    className: "bg-yellow-100 text-yellow-700",
  },
  expired: {
    label: "Expired",
    className: "bg-red-100 text-red-700",
  },
  suspended: {
    label: "Suspended",
    className: "bg-gray-200 text-gray-700",
  },
};

export default function StatusBadge({
  status,
}: {
  status: Status;
}) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
