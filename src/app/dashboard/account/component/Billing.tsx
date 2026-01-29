"use client";

import { useState } from "react";
import {
  CreditCard,
  Calendar,
  Receipt,
  X,
} from "lucide-react";

/* ================= MAIN ================= */

export default function Billing() {
  const [openInvoices, setOpenInvoices] = useState(false);

  return (
    <>
      <section
        aria-labelledby="billing-heading"
        className="bg-white rounded-xl shadow-sm p-6 space-y-6"
      >
        {/* Header */}
        <header>
          <h2
            id="billing-heading"
            className="font-medium text-lg text-gray-900"
          >
            Billing & subscription
          </h2>
          <p className="text-xs text-gray-500">
            Your current subscription and billing history
          </p>
        </header>

        {/* Billing summary */}
        <div className="space-y-3 text-sm">
          <InfoRow
            icon={CreditCard}
            label="Current plan"
            value="Standard"
          />

          <InfoRow
            icon={Receipt}
            label="Amount"
            value="₦50,000 / month"
          />

          <InfoRow
            icon={Calendar}
            label="Next billing date"
            value="February 28, 2026"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap pt-2">
          <button
            onClick={() => setOpenInvoices(true)}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            View invoices
          </button>
        </div>
      </section>

      {/* ================= INVOICES MODAL ================= */}
      {openInvoices && (
        <InvoicesModal onClose={() => setOpenInvoices(false)} />
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

function InvoicesModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Invoices" onClose={onClose}>
      <div className="space-y-3 text-sm">
        <InvoiceRow date="Jan 28, 2026" amount="₦50,000" />
        <InvoiceRow date="Dec 28, 2025" amount="₦50,000" />
        <InvoiceRow date="Nov 28, 2025" amount="₦50,000" />
      </div>
    </Modal>
  );
}

function InvoiceRow({
  date,
  amount,
}: {
  date: string;
  amount: string;
}) {
  return (
    <div className="flex justify-between border rounded-lg px-4 py-3">
      <span>{date}</span>
      <span className="font-medium">{amount}</span>
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
