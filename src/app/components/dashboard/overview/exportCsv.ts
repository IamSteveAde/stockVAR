export function exportToCSV(rows: any[]) {
  if (!rows.length) return;

  const headers = Object.keys(rows[0]).join(",");
  const body = rows.map((r) => Object.values(r).join(",")).join("\n");

  const blob = new Blob([headers + "\n" + body], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "stockvar-report.csv";
  a.click();

  window.URL.revokeObjectURL(url);
}