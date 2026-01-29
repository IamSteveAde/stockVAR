"use client";

import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";

export default function HelpPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock request
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Help & Support
          </h1>
          <p className="mt-2 text-gray-600 max-w-xl">
            Need help with StockVAR? Send us a message and our team will
            respond within the same day.
          </p>
        </div>

        {/* Success state */}
        {sent ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center space-y-4">
            <div className="mx-auto h-14 w-14 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <CheckCircle size={28} />
            </div>

            <h2 className="text-lg font-semibold">
              Message sent successfully
            </h2>

            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Thanks for reaching out. Our support team will get back to you
              within the same day.
            </p>
          </div>
        ) : (
          /* Form */
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Stock not updating correctly"
                  className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-[#0F766E]"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  required
                  className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-[#0F766E]"
                >
                  <option value="">Select a category</option>
                  <option>Stock & Inventory</option>
                  <option>Staff & Shifts</option>
                  <option>Reports & Variance</option>
                  <option>Billing</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Describe the issue you're experiencing..."
                  className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-[#0F766E] resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#0F766E] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#0B5F58] transition disabled:opacity-60"
              >
                <Mail size={16} />
                {loading ? "Sending..." : "Send message"}
              </button>

              {/* SLA note */}
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <CheckCircle size={14} className="text-green-600" />
                We typically respond within a few hours (same business day).
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}