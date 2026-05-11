import { useBudgetSummary } from "../hooks/useBudgetSummary";

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

export default function BudgetProgressCard() {
  const { budgetSummary, loading, error } = useBudgetSummary();

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#0B1120] border border-transparent dark:border-gray-800 rounded-lg shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-3"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-[#0B1120] border border-transparent dark:border-gray-800 rounded-lg shadow-sm p-6">
        <p className="text-red-500">Error loading budget: {error}</p>
      </div>
    );
  }

  if (!budgetSummary || budgetSummary.length === 0) {
    return (
      <div className="bg-white dark:bg-[#0B1120] border border-transparent dark:border-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Budget Overview</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No budgets set. Create one in Budget Settings.</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    if (status === "exceeded") return "from-red-500 to-red-600";
    if (status === "warning") return "from-yellow-500 to-yellow-600";
    return "from-green-500 to-green-600";
  };

  const getProgressBarColor = (status) => {
    if (status === "exceeded") return "bg-red-500";
    if (status === "warning") return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-4">
      {budgetSummary.map((budget) => (
        <div
          key={`${budget.type}-${budget.category}`}
          className="bg-white dark:bg-[#0B1120] border border-transparent dark:border-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 capitalize flex items-center gap-2">
              <span className="text-2xl">{getCategoryEmoji(budget.category)}</span>
              {budget.category} - {budget.type} Budget
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-white text-sm font-semibold bg-gradient-to-r ${getStatusColor(
                budget.status
              )}`}
            >
              {budget.status === "exceeded" && "Exceeded"}
              {budget.status === "warning" && "Warning"}
              {budget.status === "on-track" && "On Track"}
            </span>
          </div>

          {/* Amounts */}
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span>
                Spent:{" "}
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {budget.currentSpending.toLocaleString("en-UG", {
                    style: "currency",
                    currency: "UGX",
                    maximumFractionDigits: 0,
                  })}
                </span>
              </span>
              <span>
                Budget:{" "}
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {budget.limit.toLocaleString("en-UG", {
                    style: "currency",
                    currency: "UGX",
                    maximumFractionDigits: 0,
                  })}
                </span>
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full ${getProgressBarColor(
                  budget.status
                )} rounded-full transition-all duration-300`}
                style={{
                  width: `${Math.min(parseFloat(budget.percentageUsed), 100)}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {budget.percentageUsed}% used
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {budget.remaining.toLocaleString("en-UG", {
                style: "currency",
                currency: "UGX",
                maximumFractionDigits: 0,
              })}{" "}
              remaining
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
