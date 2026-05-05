// src/components/TransactionForm.jsx
import { useState } from "react";

const CATEGORIES = [
  "food",
  "transportation",
  "entertainment",
  "utilities",
  "healthcare",
  "shopping",
  "education",
  "travel",
  "other"
];

const getCategoryEmoji = (category) => {
  const emojis = {
    food: "🍔",
    transportation: "🚗",
    entertainment: "🎬",
    utilities: "💡",
    healthcare: "🏥",
    shopping: "🛍️",
    education: "📚",
    travel: "✈️",
    other: "📌"
  };
  return emojis[category] || "📌";
};

export default function TransactionForm({ onAdd }) {
  const emptyForm = {
    type: "expense",
    amount: "",
    category: "food",
    date: new Date().toISOString().split("T")[0],
  };

  const [form, setForm] = useState(emptyForm);

  const handleSubmit = () => {
    if (!form.amount || !form.category) return;
    onAdd(form);
    setForm(emptyForm);
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-4">
      <h2 className="font-semibold text-gray-800 mb-4">Add Transaction</h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <select
          className="border border-gray-200 p-2.5 rounded-lg bg-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          className="border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
          placeholder="Amount"
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: +e.target.value })}
        />

        <select
          className="border border-gray-200 p-2.5 rounded-lg bg-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {getCategoryEmoji(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        <input
          className="border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <button
          onClick={handleSubmit}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium transition"
        >
          Add
        </button>
      </div>
    </div>
  );
}