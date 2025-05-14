const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  customer_id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "is invalid"],
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip_code: String,
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

CustomerSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

CustomerSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("Customer", CustomerSchema);
