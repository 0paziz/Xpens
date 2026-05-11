// src/components/EditTransactionModal.jsx
import { useState, useEffect } from "react";

export default function EditTransactionModal({ isOpen, onClose, data, onUpdate }) {
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (data) {
      setForm({
        type: data.type,
        amount: data.amount,
        category: data.category,
        date: data.date ? new Date(data.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      });
    }
  }, [data]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white dark:bg-[#0B1120] border border-transparent dark:border-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl mb-4 font-bold text-gray-800 dark:text-gray-100">Edit Transaction</h2>

        <div className="space-y-3">
          <select
            className="border border-gray-200 dark:border-gray-700 p-2.5 w-full rounded-lg bg-white dark:bg-[#0B1120] text-gray-800 dark:text-gray-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <input
            className="border border-gray-200 dark:border-gray-700 p-2.5 w-full rounded-lg bg-transparent text-gray-800 dark:text-gray-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
            type="number"
            value={form.amount}
            placeholder="Amount"
            onChange={(e) => setForm({ ...form, amount: +e.target.value })}
          />

          <input
            className="border border-gray-200 dark:border-gray-700 p-2.5 w-full rounded-lg bg-transparent text-gray-800 dark:text-gray-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
            value={form.category}
            placeholder="Category"
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <input
            className="border border-gray-200 dark:border-gray-700 p-2.5 w-full rounded-lg bg-transparent text-gray-800 dark:text-gray-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition"
          >
            Cancel
          </button>

          <button
            onClick={() => onUpdate(form)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}