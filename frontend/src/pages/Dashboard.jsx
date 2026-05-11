// ===================== IMPORTS =====================
import { useState, useEffect, useContext } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import EditTransactionModal from "../components/EditTransactionModal";
import API from "../api/api";
import Layout from "../components/Layout";
import SummaryCards from "../components/SummaryCards";
import BudgetProgressCard from "../components/BudgetProgressCard";
import TransactionList from "../components/TransactionList";
import { AuthContext } from "../context/AuthContext";

// ===================== FORMAT HELPERS =====================

const formatUGX = (value) =>
  new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    minimumFractionDigits: 0,
  }).format(value);

const formatUGXShort = (value) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value;
};

// ===================== CUSTOM TOOLTIP =====================

const BarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs sm:text-sm">
        <p className="font-semibold mb-1 text-gray-700">{label}</p>
        {payload.map((entry) => (
          <p key={entry.dataKey} style={{ color: entry.fill }}>
            {entry.dataKey}: {formatUGX(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ===================== MAIN COMPONENT =====================

export default function Dashboard() {
  // -------- STATE --------
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({});
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useContext(AuthContext);

  // -------- FETCH DATA --------
  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");
      const t = await API.get("/transactions/");
      const s = await API.get("/transactions/summary");
      setTransactions(t.data);
      setSummary(s.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // -------- ACTIONS --------
  const del = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const editOpen = (item) => {
    setSelected(item);
    setOpen(true);
  };

  const update = async (updatedData) => {
    try {
      await API.put(`/transactions/${selected._id}`, updatedData);
      setOpen(false);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  // -------- CHART DATA --------
  const monthData = (summary.byMonth || [])
    .map((item) => ({
      month: item?.month || "Unknown",
      income: Number(item?.income) || 0,
      expense: Number(item?.expense) || 0,
    }))
    .filter((item) => !isNaN(item.income) && !isNaN(item.expense));

  // ===================== UI =====================
  return (
    <Layout
      title="Dashboard"
      subtitle={user?.name ? `Welcome back, ${user.name}` : "Welcome back"}
    >
      {/* -------- ERROR STATE -------- */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 flex items-center justify-between gap-2 text-sm">
          <span>{error}</span>
          <button
            onClick={fetchAll}
            className="underline font-medium whitespace-nowrap hover:text-red-800 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* -------- LOADING STATE -------- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
          <svg className="animate-spin w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-sm">Loading your data…</span>
        </div>
      ) : (
        <>
          {/* -------- SUMMARY CARDS -------- */}
          <SummaryCards data={summary} />

          {/* -------- BUDGET PROGRESS -------- */}
          <div className="mt-6">
            <h2 className="text-base sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800 dark:text-gray-100">
              Budget Overview
            </h2>
            <BudgetProgressCard />
          </div>

          {/* -------- BAR CHART -------- */}
          <div className="bg-white dark:bg-[#0B1120] border border-transparent dark:border-gray-800 p-4 sm:p-5 rounded-xl shadow-sm mt-6">
            <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 text-sm sm:text-base">
              Monthly Overview
            </h2>

            {monthData.length === 0 ? (
              <p className="text-center text-gray-400 py-12 text-sm">
                No monthly data available
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 220 : 300}>
                <BarChart
                  data={monthData}
                  margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tickFormatter={formatUGXShort}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={48}
                  />
                  <Tooltip content={<BarTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
                  />
                  <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* -------- RECENT TRANSACTIONS -------- */}
          <div className="mt-6 sm:mt-8">
            <h2 className="text-base sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800 dark:text-gray-100">
              Recent Transactions
            </h2>

            <TransactionList
              data={transactions.slice(0, 5)}
              onDelete={del}
              onEdit={editOpen}
            />
          </div>

          {/* -------- EDIT MODAL -------- */}
          <EditTransactionModal
            isOpen={open}
            onClose={() => setOpen(false)}
            data={selected}
            onUpdate={update}
          />
        </>
      )}
    </Layout>
  );
}