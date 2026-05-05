import { useState, useEffect } from "react";
import { budgetAPI } from "../api/api";

export const useBudgetSummary = () => {
  const [budgetSummary, setBudgetSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBudgetSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await budgetAPI.getBudgetSummary();
      setBudgetSummary(response.data.budgetSummary || []);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching budget summary");
      console.error("Error fetching budget summary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetSummary();
  }, []);

  return { budgetSummary, loading, error, refetch: fetchBudgetSummary };
};

export default useBudgetSummary;
