const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unit_price: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const OrderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    unique: true,
  },
  customer_id: {
    type: String,
    required: true,
  },
  date_of_sale: {
    type: Date,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  payment_method: {
    type: String,
    required: true,
  },
  shipping_cost: {
    type: Number,
    required: true,
    min: 0,
  },
  items: {
    type: [OrderItemSchema],
    required: true,
    validate: {
      validator: (v) => Array.isArray(v) && v.length > 0,
      message: "Order must have at least one item",
    },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

OrderSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("Order", OrderSchema);
