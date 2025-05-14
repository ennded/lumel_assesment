const express = require("express");
const router = express.Router();
const controller = require("../controllers/analysisController");

const {
  getRevenueByCategory,
  getRevenueByProduct,
  getRevenueByRegion,
  getTotalRevenue,
} = require("../controllers/analysisController");

router.get("/revenue/category", getRevenueByCategory);
router.get("/revenue/product", getRevenueByProduct);
router.get("/revenue/region", getRevenueByRegion);
router.get("/revenue/total", getTotalRevenue);

module.exports = router;
