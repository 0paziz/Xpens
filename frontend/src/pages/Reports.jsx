import { useState, useEffect } from "react";
import API from "../api/api";
import Layout from "../components/Layout";

export default function Reports() {
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    try {
      setError("");
      setLoading(true);
      const s = await API.get("/transactions/summary");
      setSummary(s.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load report data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const expenseData = summary.expensesByCategory || [];
  const monthData = summary.byMonth || [];

  const rightAction = (
    <button
      onClick={() => window.print()}
      className="p-2 rounded-md text-emerald-600 hover:bg-emerald-50 transition"
      aria-label="Print report"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
    </button>
  );

  return (
    <Layout
      title="Reports"
      subtitle="Detailed financial breakdown."
      rightAction={rightAction}
    >
      {/* -------- ERROR -------- */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm flex items-center justify-between gap-2">
          <span>{error}</span>
          <button onClick={fetchSummary} className="underline font-medium whitespace-nowrap hover:text-red-800 transition-colors">
            Retry
          </button>
        </div>
      )}

      {/* -------- LOADING -------- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
          <svg className="animate-spin w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-sm">Loading reports…</span>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6 print:space-y-8">
          {/* -------- OVERVIEW SUMMARY -------- */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:justify-around sm:text-center divide-y sm:divide-y-0 sm:divide-x divide-gray-100 gap-4 sm:gap-0">
              <div className="sm:flex-1 py-1 sm:py-0">
                <p className="text-gray-500 text-xs sm:text-sm font-medium">Total Income</p>
                <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">
                  UGX {summary.income?.toLocaleString() || 0}
                </p>
              </div>
              <div className="sm:flex-1 py-1 sm:py-0">
                <p className="text-gray-500 text-xs sm:text-sm font-medium">Total Expenses</p>
                <p className="text-xl sm:text-2xl font-bold text-red-500 mt-1">
                  UGX {summary.expense?.toLocaleString() || 0}
                </p>
              </div>
              <div className="sm:flex-1 py-1 sm:py-0">
                <p className="text-gray-500 text-xs sm:text-sm font-medium">Net Balance</p>
                <p className={`text-xl sm:text-2xl font-bold mt-1 ${summary.balance >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  UGX {summary.balance?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          {/* -------- TABLES GRID -------- */}
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 print:block print:space-y-8">
            {/* ---- EXPENSES BY CATEGORY ---- */}
            <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                Expenses by Category
              </h2>
              {expenseData.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No expense data available.</p>
              ) : (
                <div className="overflow-x-auto -mx-1">
                  <table className="w-full text-left border-collapse min-w-[280px]">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-xs sm:text-sm">
                        <th className="p-2 sm:p-3 border-b">Category</th>
                        <th className="p-2 sm:p-3 border-b text-right">Amount</th>
                        <th className="p-2 sm:p-3 border-b text-right">% of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenseData.map((item, index) => {
                        const percentage =
                          summary.expense > 0
                            ? ((item.total / summary.expense) * 100).toFixed(1)
                            : 0;
                        return (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-2 sm:p-3 capitalize text-sm">{item.category}</td>
                            <td className="p-2 sm:p-3 text-right font-medium text-sm">
                              UGX {item.total.toLocaleString()}
                            </td>
                            <td className="p-2 sm:p-3 text-right text-gray-500 text-sm">
                              {percentage}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* ---- MONTHLY OVERVIEW ---- */}
            <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                Monthly Overview
              </h2>
              {monthData.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No monthly data available.</p>
              ) : (
                <div className="overflow-x-auto -mx-1">
                  <table className="w-full text-left border-collapse min-w-[320px]">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-xs sm:text-sm">
                        <th className="p-2 sm:p-3 border-b">Month</th>
                        <th className="p-2 sm:p-3 border-b text-right text-emerald-600">Income</th>
                        <th className="p-2 sm:p-3 border-b text-right text-red-500">Expense</th>
                        <th className="p-2 sm:p-3 border-b text-right">Net</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthData.map((item, index) => {
                        const net = item.income - item.expense;
                        return (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-2 sm:p-3 font-medium text-sm">{item.month}</td>
                            <td className="p-2 sm:p-3 text-right text-sm">
                              UGX {item.income.toLocaleString()}
                            </td>
                            <td className="p-2 sm:p-3 text-right text-sm">
                              UGX {item.expense.toLocaleString()}
                            </td>
                            <td className={`p-2 sm:p-3 text-right font-semibold text-sm ${net >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                              UGX {net.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}