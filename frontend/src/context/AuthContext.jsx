import { createContext, useState, useEffect } from "react";
import { budgetAPI } from "../api/api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [budgetsLoading, setBudgetsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token });
      // Load budgets when user is restored
      loadBudgets();
    }
  }, []);

  const loadBudgets = async () => {
    setBudgetsLoading(true);
    try {
      const response = await budgetAPI.getBudgets();
      setBudgets(response.data.budgets || []);
    } catch (error) {
      console.error("Error loading budgets:", error);
      setBudgets([]);
    } finally {
      setBudgetsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setBudgets([]);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, budgets, setBudgets, budgetsLoading, loadBudgets }}>
      {children}
    </AuthContext.Provider>
  );
}