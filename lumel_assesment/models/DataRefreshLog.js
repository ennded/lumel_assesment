const mongoose = require("mongoose");

const DataRefreshLogSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["processing", "success", "failed"],
    required: true,
  },
  file_path: {
    type: String,
    required: true,
  },
  records_processed: {
    type: Number,
    default: 0,
  },
  failed_records: {
    type: Number,
    default: 0,
  },
  error_message: {
    type: String,
  },
  start_time: {
    type: Date,
    default: Date.now,
  },
  end_time: {
    type: Date,
  },
  duration_ms: {
    type: Number,
  },
});

DataRefreshLogSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "success") {
    this.end_time = new Date();
    this.duration_ms = this.end_time - this.start_time;
  }
  next();
});

module.exports = mongoose.model("DataRefreshLog", DataRefreshLogSchema);
