const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const orderData = {
      order_id: req.body.order_id,
      customer_id: req.body.customer_id,
      date_of_sale: new Date(req.body.date_of_sale),
      region: req.body.region,
      payment_method: req.body.payment_method,
      shipping_cost: parseFloat(req.body.shipping_cost),
      items: req.body.items.map((item) => ({
        product_id: item.product_id,
        quantity: parseInt(item.quantity),
        unit_price: parseFloat(item.unit_price),
        discount: parseFloat(item.discount) || 0,
      })),
    };

    const order = new Order(orderData);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({
      error: "Validation Error",
      details: err.message,
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ date_of_sale: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrdersByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const orders = await Order.find({
      date_of_sale: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).sort({ date_of_sale: -1 });

    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: "Invalid date format" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ order_id: req.params.orderId });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { order_id: req.params.orderId },
      {
        $set: req.body,
        updated_at: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findOneAndDelete({
      order_id: req.params.orderId,
    });

    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.calculateOrderTotal = (order) => {
  return (
    order.items.reduce((total, item) => {
      return total + item.quantity * (item.unit_price - item.discount);
    }, 0) + order.shipping_cost
  );
};
