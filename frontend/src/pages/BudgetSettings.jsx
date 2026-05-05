import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { budgetAPI } from "../api/api";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import Layout from "../components/Layout";

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

export default function BudgetSettings() {
  const { budgets, loadBudgets } = useContext(AuthContext);
  const [formData, setFormData] = useState({ type: "monthly", category: "food", limit: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingKey, setEditingKey] = useState(null);
  const [editLimit, setEditLimit] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "limit" ? parseFloat(value) || "" : value,
    });
  };

  const handleCreateBudget = async (e) => {
    e.preventDefault();
    if (!formData.type || !formData.category || !formData.limit || formData.limit <= 0) {
      setError("Please fill in all fields correctly");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await budgetAPI.createBudget({
        type: formData.type,
        category: formData.category,
        limit: formData.limit,
      });
      setSuccess("Budget created successfully!");
      setFormData({ type: "monthly", category: "food", limit: "" });
      await loadBudgets();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error creating budget");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBudget = async (budget) => {
    if (!editLimit || editLimit <= 0) {
      setError("Budget limit must be greater than 0");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await budgetAPI.updateBudget({
        type: budget.type,
        category: budget.category,
        limit: parseFloat(editLimit),
      });
      setSuccess("Budget updated successfully!");
      setEditingKey(null);
      setEditLimit("");
      await loadBudgets();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating budget");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBudget = async (budget) => {
    if (!window.confirm(`Are you sure you want to delete the ${budget.type} budget for ${budget.category}?`)) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await budgetAPI.deleteBudget({
        type: budget.type,
        category: budget.category,
      });
      setSuccess("Budget deleted successfully!");
      await loadBudgets();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting budget");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (budget) => {
    setEditingKey(`${budget.type}-${budget.category}`);
    setEditLimit(budget.limit.toString());
  };

  const cancelEditing = () => {
    setEditingKey(null);
    setEditLimit("");
  };

  return (
    <Layout
      title="Budget"
      subtitle="Manage your spending budgets by category and time period"
    >
      <div className="max-w-6xl mx-auto">
        {/* Alert Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Create Budget Form */}
          <div className="md:col-span-1 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaPlus className="mr-2 text-green-600" /> Create Budget
            </h2>
            <form onSubmit={handleCreateBudget}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Budget Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={loading}
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={loading}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {getCategoryEmoji(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Budget Limit
                </label>
                <input
                  type="number"
                  name="limit"
                  value={formData.limit}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={loading}
                  min="0"
                  step="0.01"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
              >
                {loading ? "Creating..." : "Create Budget"}
              </button>
            </form>
          </div>

          {/* Budgets List */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Budgets</h2>

            {budgets && budgets.length > 0 ? (
              <div className="space-y-3 max-h-150 overflow-y-auto">
                {budgets.map((budget) => {
                  const editKey = `${budget.type}-${budget.category}`;
                  return (
                    <div
                      key={editKey}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getCategoryEmoji(budget.category)}</span>
                          {editingKey === editKey ? (
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-gray-700 font-semibold capitalize">
                                {budget.type} - {budget.category}:
                              </span>
                              <input
                                type="number"
                                value={editLimit}
                                onChange={(e) => setEditLimit(e.target.value)}
                                className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                min="0"
                                step="0.01"
                              />
                              <button
                                onClick={() => handleUpdateBudget(budget)}
                                disabled={loading}
                                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition disabled:bg-gray-400"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditing}
                                disabled={loading}
                                className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 transition disabled:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              <div>
                                <p className="text-gray-700 font-semibold capitalize">
                                  {budget.category} ({budget.type})
                                </p>
                                <p className="text-sm text-gray-500">
                                  Limit: {" "}
                                  <span className="font-bold text-green-600">
                                    {budget.limit.toLocaleString("en-UG", {
                                      style: "currency",
                                      currency: "UGX",
                                    })}
                                  </span>
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                        {budget.createdAt && editingKey !== editKey && (
                          <p className="text-xs text-gray-400 mt-1 ml-10">
                            Created: {new Date(budget.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      {editingKey !== editKey && (
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => startEditing(budget)}
                            disabled={loading}
                            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition disabled:bg-gray-400"
                            title="Edit budget"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteBudget(budget)}
                            disabled={loading}
                            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition disabled:bg-gray-400"
                            title="Delete budget"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No budgets set yet</p>
                <p className="text-gray-400">Create your first budget to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
