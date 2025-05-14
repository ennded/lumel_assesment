const service = require("../services/salesAnalysisService");

exports.getRevenueByCategory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const results = await service.calculateRevenueByCategory(
      startDate,
      endDate
    );
    res.json(results);
  } catch (err) {
    console.error("Error in getRevenueByCategory:", err);
    res.status(500).json({ error: "Failed to calculate revenue by category" });
  }
};

exports.getRevenueByProduct = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Both startDate and endDate are required" });
    }

    const results = await service.calculateRevenueByProduct(startDate, endDate);
    res.json(results);
  } catch (err) {
    console.error("Error in getRevenueByProduct:", err);
    res.status(500).json({ error: "Failed to calculate revenue by product" });
  }
};

exports.getRevenueByRegion = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Both startDate and endDate are required" });
    }

    const results = await service.calculateRevenueByRegion(startDate, endDate);
    res.json(results);
  } catch (err) {
    console.error("Error in getRevenueByRegion:", err);
    res.status(500).json({ error: "Failed to calculate revenue by region" });
  }
};

exports.getTotalRevenue = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Both startDate and endDate are required" });
    }

    const result = await service.calculateTotalRevenue(startDate, endDate);
    res.json(result);
  } catch (err) {
    console.error("Error in getTotalRevenue:", err);
    res.status(500).json({ error: "Failed to calculate total revenue" });
  }
};
