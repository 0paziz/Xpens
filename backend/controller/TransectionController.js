const Transection = require("../models/TransectionModel");

async function createTransaction(req, res) {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { type, amount, category, description, date } = req.body;
    if (!type || !amount || !category) {
      return res.status(400).json({ message: "type, amount and category are required" });
    }

    const doc = await Transection.create({
      user: userId,
      type,
      amount,
      category,
      description: description || "",
      date: date || Date.now(),
    });

    res.status(201).json(doc);
  } catch (err) {
    console.error("createTransaction error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getTransactions(req, res) {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const list = await Transection.find({ user: userId }).sort({ date: -1 });
    res.json(list);
  } catch (err) {
    console.error("getTransactions error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getTransactionById(req, res) {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const item = await Transection.findById(id);

    if (!item) return res.status(404).json({ message: "Not found" });

    if (item.user.toString() !== userId) return res.status(403).json({ message: "Forbidden" });

    res.json(item);
  } catch (err) {
    console.error("getTransactionById error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateTransaction(req, res) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    // find and update in one step
    const updated = await Transection.findOneAndUpdate(
      { _id: id, user: userId }, 
      req.body, // update data
      { new: true }   
    );

    if (!updated) {
      return res.status(404).json({ message: "Not found or unauthorized" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteTransaction(req, res) {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const item = await Transection.findById(id);

    if (!item) return res.status(404).json({ message: "Not found" });

    if (item.user.toString() !== userId) return res.status(403).json({ message: "Forbidden" });

    await item.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteTransaction error:", err);
    res.status(500).json({ message: "Server error" });
  }
}


const mongoose = require("mongoose");

async function getDashboardSummary(req, res) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await Transection.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },

      // ✅ Normalize fields safely
      {
        $addFields: {
          amount: {
            $convert: {
              input: "$amount",
              to: "double",
              onError: 0,   // if invalid → 0
              onNull: 0,    // if null → 0
            },
          },
          safeDate: {
            $ifNull: ["$date", "$$NOW"],  // ✅ FIX: use $$NOW instead of new Date()
          },
        },
      },

      {
        $facet: {
          // ✅ totals
          totals: [
            {
              $group: {
                _id: "$type",
                total: { $sum: "$amount" },
              },
            },
          ],

          // ✅ category (expenses only)
          byCategory: [
            { $match: { type: "expense" } },
            {
              $group: {
                _id: "$category",
                total: { $sum: "$amount" },
              },
            },
          ],

          // ✅ monthly
          byMonth: [
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m",
                    date: "$safeDate",
                  },
                },
                income: {
                  $sum: {
                    $cond: [
                      { $eq: ["$type", "income"] },
                      "$amount",
                      0,
                    ],
                  },
                },
                expense: {
                  $sum: {
                    $cond: [
                      { $eq: ["$type", "expense"] },
                      "$amount",
                      0,
                    ],
                  },
                },
              },
            },
            { $sort: { _id: 1 } },
          ],
        },
      },
    ]);

    const data = result[0] || {};

    // ✅ totals extraction
    let income = 0;
    let expense = 0;

    (data.totals || []).forEach((t) => {
      if (t._id === "income") income = t.total;
      if (t._id === "expense") expense = t.total;
    });

    // ✅ category formatting
    const expensesByCategory = (data.byCategory || [])
      .map((item) => ({
        category: item._id || "Uncategorized",
        total: Number(item.total) || 0,  // ✅ FIX: ensure numeric
      }))
      .filter((item) => item.total > 0);  // ✅ FIX: remove zero values

    // ✅ month formatting
    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const byMonth = (data.byMonth || []).map((item) => {
      const [year, month] = item._id.split("-");
      const monthIndex = parseInt(month) - 1;
      return {
        _id: item._id,
        month: monthNames[monthIndex] || "Unknown",
        income: Number(item.income) || 0,  // ✅ FIX: ensure numeric
        expense: Number(item.expense) || 0,  // ✅ FIX: ensure numeric
      };
    });

    res.json({
      income,
      expense,
      balance: income - expense,
      expensesByCategory,
      byMonth,
    });

  } catch (err) {
    console.error("getDashboardSummary error:", err);
    res.status(500).json({ message: "Server error" });
  }
}


module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getDashboardSummary,
};