const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/", orderController.createOrder);

router.get("/", orderController.getAllOrders);

router.get("/date-range", orderController.getOrdersByDateRange);

router.get("/:orderId", orderController.getOrderById);

router.put("/:orderId", orderController.updateOrder);

router.delete("/:orderId", orderController.deleteOrder);

module.exports = router;
