const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");

const UserRoute = require("../route/UserRoute");
const TransectionRoute = require("../route/TransectionRoute");
const BudgetRoute = require("../route/BudgetRoute");
const MONGO_URI= process.env.MONGO_URI
const PORT=process.env.PORT;
const app = express();

// middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));


app.use(express.json());

//DB connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("DB has connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port`);
    });
  })
  .catch((error) => {
    console.error("Could not connect to DB:", error);
  });

  // Root test route 
app.get("/", (req, res) => {
  res.json({ status: "Backend running on Vercel" });
});

// routes
app.use("/api/user", UserRoute);
app.use("/api/transactions", TransectionRoute);
app.use("/api/budgets", BudgetRoute);


module.exports = app;
