const express = require("express");
const router = express.Router();
const authMiddleware = require("../auth/AuthMiddleWare");
const budgetController = require("../controller/BudgetController");

// All budget routes require authentication
router.use(authMiddleware);

// Create a new budget
router.post("/create", budgetController.createBudget);

// Get all budgets for user
router.get("/", budgetController.getBudgets);

// Update budget
router.put("/update", budgetController.updateBudget);

// Delete budget
router.delete("/delete", budgetController.deleteBudget);

// Get budget summary with current spending
router.get("/summary", budgetController.getBudgetSummary);

module.exports = router;
