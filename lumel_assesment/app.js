require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const { processCSV } = require("./services/csvProcessor");

const app = express();

connectDB();

app.use(express.json());

app.use("/api/refresh", require("./routes/dataRefreshRoutes"));
app.use("/api/analysis", require("./routes/analysisRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
