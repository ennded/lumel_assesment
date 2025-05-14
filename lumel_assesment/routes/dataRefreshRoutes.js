const express = require("express");
const router = express.Router();
const controller = require("../controllers/dataRefreshController");

router.post("/", controller.refreshData);

module.exports = router;
