// src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// User API functions
export const userAPI = {
  // Get user profile
  getProfile: () =>
    API.get("/user/profile"),

  // Update user profile
  updateProfile: (profileData) =>
    API.put("/user/profile", profileData),
};

// Budget API functions
export const budgetAPI = {
  // Create a new budget
  createBudget: (budgetData) =>
    API.post("/budgets/create", budgetData),

  // Get all budgets for the user
  getBudgets: () =>
    API.get("/budgets"),

  // Update a budget
  updateBudget: (budgetData) =>
    API.put("/budgets/update", budgetData),

  // Delete a budget
  deleteBudget: (budgetData) =>
    API.delete("/budgets/delete", { data: budgetData }),

  // Get budget summary with current spending
  getBudgetSummary: () =>
    API.get("/budgets/summary"),
};

export default API;