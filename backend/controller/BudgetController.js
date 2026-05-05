const User = require("../models/UserModel");
const Transaction = require("../models/TransectionModel");

// Create a new budget
exports.createBudget = async (req, res) => {
    try {
        const { type, category, limit } = req.body;
        const userId = req.user.id;

        if (!type || !category || !limit) {
            return res.status(400).json({ message: "Budget type, category, and limit are required" });
        }

        if (!["weekly", "monthly", "yearly"].includes(type)) {
            return res.status(400).json({ message: "Invalid budget type. Must be weekly, monthly, or yearly" });
        }

        const validCategories = ["food", "transportation", "entertainment", "utilities", "healthcare", "shopping", "education", "travel", "other"];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ message: "Invalid category" });
        }

        if (limit <= 0) {
            return res.status(400).json({ message: "Budget limit must be greater than 0" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if budget for this type and category already exists
        const existingBudget = user.budgets.find(b => b.type === type && b.category === category);
        if (existingBudget) {
            return res.status(400).json({ message: `A ${type} budget for ${category} already exists. Please update or delete it first.` });
        }

        const newBudget = {
            type,
            category,
            limit,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        user.budgets.push(newBudget);
        await user.save();

        res.status(201).json({ 
            message: "Budget created successfully", 
            budget: user.budgets[user.budgets.length - 1] 
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating budget", error: error.message });
    }
};

// Get all budgets for user
exports.getBudgets = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ budgets: user.budgets });
    } catch (error) {
        res.status(500).json({ message: "Error fetching budgets", error: error.message });
    }
};

// Update budget limit
exports.updateBudget = async (req, res) => {
    try {
        const { type, category, limit } = req.body;
        const userId = req.user.id;

        if (!type || !category || !limit) {
            return res.status(400).json({ message: "Budget type, category, and limit are required" });
        }

        if (limit <= 0) {
            return res.status(400).json({ message: "Budget limit must be greater than 0" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const budget = user.budgets.find(b => b.type === type && b.category === category);
        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }

        budget.limit = limit;
        budget.updatedAt = new Date();
        await user.save();

        res.status(200).json({ message: "Budget updated successfully", budget });
    } catch (error) {
        res.status(500).json({ message: "Error updating budget", error: error.message });
    }
};

// Delete budget
exports.deleteBudget = async (req, res) => {
    try {
        const { type, category } = req.body;
        const userId = req.user.id;

        if (!type || !category) {
            return res.status(400).json({ message: "Budget type and category are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const budgetIndex = user.budgets.findIndex(b => b.type === type && b.category === category);
        if (budgetIndex === -1) {
            return res.status(404).json({ message: "Budget not found" });
        }

        user.budgets.splice(budgetIndex, 1);
        await user.save();

        res.status(200).json({ message: "Budget deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting budget", error: error.message });
    }
};

// Get budget summary with current spending
exports.getBudgetSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.budgets || user.budgets.length === 0) {
            return res.status(200).json({ budgetSummary: [] });
        }

        const today = new Date();
        const summary = [];

        for (const budget of user.budgets) {
            let startDate, endDate;

            if (budget.type === "weekly") {
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 7);
                endDate = today;
            } else if (budget.type === "monthly") {
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            } else if (budget.type === "yearly") {
                startDate = new Date(today.getFullYear(), 0, 1);
                endDate = new Date(today.getFullYear(), 11, 31);
            }

            // Get all expense transactions for this category and period
            const transactions = await Transaction.find({
                user: userId,
                type: "expense",
                category: budget.category,
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            });

            const currentSpending = transactions.reduce((sum, txn) => sum + txn.amount, 0);

            summary.push({
                type: budget.type,
                category: budget.category,
                limit: budget.limit,
                currentSpending,
                percentageUsed: ((currentSpending / budget.limit) * 100).toFixed(2),
                remaining: Math.max(0, budget.limit - currentSpending),
                status: 
                    currentSpending > budget.limit ? "exceeded" :
                    currentSpending >= budget.limit * 0.8 ? "warning" :
                    "on-track"
            });
        }

        res.status(200).json({ budgetSummary: summary });
    } catch (error) {
        res.status(500).json({ message: "Error fetching budget summary", error: error.message });
    }
};
