"use client";

import { useState } from "react";
import {
  CreditCard,
  Calendar,
  Receipt,
  X,
  Download,
  Loader2,
} from "lucide-react";
import { useSubscription } from "@/app/context/SubscriptionContext";
import type { Invoice } from "@/app/types/subscription";
import { downloadSubscriptionInvoice } from "@/lib/api/business";
import { getSession } from "@/lib/api/auth";
import toast from "react-hot-toast";

/* ================= HELPERS ================= */

const formatMoney = (amount: number) =>
  `₦${amount.toLocaleString()}`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

/* ================= MAIN ================= */

export default function Billing() {
  const { subscription } = useSubscription();
  const [openInvoices, setOpenInvoices] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadInvoice = async () => {
    const session = getSession();
    if (!session?.token) {
      toast.error("Please log in to download invoice.");
      return;
    }

    setIsDownloading(true);
    try {
      const response = await downloadSubscriptionInvoice(session.token);
      const blob = await response.blob();
      
      const contentDisp = response.headers.get("Content-Disposition");
      let filename = "invoice.pdf";
      
      if (contentDisp && contentDisp.includes("filename=")) {
        const parts = contentDisp.split("filename=");
        if (parts[1]) {
          filename = parts[1].replace(/["']/g, "");
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error("Download failed:", error);
      toast.error(error.message || "Failed to download invoice.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!subscription) {
    return (
      <section className="bg-white rounded-xl p-6 shadow-sm text-sm text-gray-500">
        No billing information available yet.
      </section>
    );
  }

  /* ================= DERIVED ================= */

  const isTrial = subscription.status === "trial";

  const nextBillingDate = isTrial
    ? subscription.trialEndsAt
    : subscription.nextBillingAt;

  const invoices: Invoice[] = subscription.invoices ?? [];

  return (
    <>
      <section className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* Header */}
        <header>
          <h2 className="font-medium text-lg text-gray-900">
            Billing & subscription
          </h2>
          <p className="text-xs text-gray-500">
            Your current subscription and billing history
          </p>
        </header>

        {/* Summary */}
        <div className="space-y-3 text-sm">
          <InfoRow
            icon={CreditCard}
            label="Current plan"
            value={isTrial ? "Free trial" : "Standard"}
          />

          <InfoRow
            icon={Receipt}
            label="Amount"
            value={
              isTrial || !subscription.amount
                ? "₦0 (Trial)"
                : formatMoney(subscription.amount)
            }
          />

          <InfoRow
            icon={Calendar}
            label={isTrial ? "Trial ends" : "Next billing date"}
            value={
              nextBillingDate
                ? formatDate(nextBillingDate)
                : "—"
            }
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap pt-2">
          {/* <button
            onClick={() => setOpenInvoices(true)}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            View invoices
          </button> */}
          
          <button
            onClick={handleDownloadInvoice}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Downloading…
              </>
            ) : (
              <>
                <Download size={16} />
                Download invoice
              </>
            )}
          </button>
        </div>
      </section>

      {/* ================= INVOICES MODAL ================= */}
      {openInvoices && (
        <InvoicesModal
          invoices={invoices}
          onClose={() => setOpenInvoices(false)}
        />
      )}
    </>
  );
}

/* ================= INFO ROW ================= */

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-gray-500">
        <Icon size={16} />
        <span>{label}</span>
      </div>
      <span className="font-medium text-gray-900">
        {value}
      </span>
    </div>
  );
}

/* ================= INVOICES MODAL ================= */

function InvoicesModal({
  invoices,
  onClose,
}: {
  invoices: Invoice[];
  onClose: () => void;
}) {
  return (
    <Modal title="Invoices" onClose={onClose}>
      {invoices.length === 0 ? (
        <p className="text-sm text-gray-500">
          No invoices yet.
        </p>
      ) : (
        <div className="space-y-3 text-sm">
          {invoices.map((inv) => (
            <InvoiceRow
              key={inv.id}
              date={formatDate(inv.date)}
              amount={formatMoney(inv.amount)}
              status={inv.status}
            />
          ))}
        </div>
      )}
    </Modal>
  );
}

/* ================= INVOICE ROW ================= */

function InvoiceRow({
  date,
  amount,
  status,
}: {
  date: string;
  amount: string;
  status: Invoice["status"]; // ✅ FIXED
}) {
  const statusColor =
    status === "paid"
      ? "text-green-700"
      : status === "pending"
      ? "text-yellow-700"
      : "text-red-600";

  return (
    <div className="flex justify-between items-center border rounded-lg px-4 py-3">
      <div>
        <p className="text-sm">{date}</p>
        <p
          className={`text-xs capitalize ${statusColor}`}
        >
          {status}
        </p>
      </div>
      <span className="font-medium">
        {amount}
      </span>
    </div>
  );
}

/* ================= GENERIC MODAL ================= */

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b">
          <h4 className="font-medium">{title}</h4>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}