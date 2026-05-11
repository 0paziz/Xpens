// src/components/SummaryCards.jsx
import { FaArrowUp, FaArrowDown, FaWallet } from "react-icons/fa";

export default function SummaryCards({ data }) {
  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <Card
        title="Income"
        value={data.income}
        icon={<FaArrowUp />}
        bg="bg-emerald-500/10"
        border="border-emerald-500/30"
        text="text-emerald-500"
      />
      <Card
        title="Expense"
        value={data.expense}
        icon={<FaArrowDown />}
        bg="bg-red-500/10"
        border="border-red-500/30"
        text="text-red-500"
      />
      <Card
        title="Balance"
        value={data.balance}
        icon={<FaWallet />}
        bg="bg-blue-500/10"
        border="border-blue-500/30"
        text="text-blue-500"
      />
    </div>
  );
}

function Card({ title, value, icon, bg, border, text }) {
  return (
    <div className={`bg-white dark:bg-[#0B1120] ${bg} ${border} border p-5 rounded-xl hover:scale-105 transition-transform duration-200`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
        <span className={`${text} text-lg`}>{icon}</span>
      </div>
      <p className={`text-2xl font-bold ${text}`}>
        UGX {value?.toLocaleString() ?? 0}
      </p>
    </div>
  );
}