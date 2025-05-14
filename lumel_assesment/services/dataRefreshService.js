const { processCSV } = require("./csvProcessor");
const DataRefreshLog = require("../models/DataRefreshLog");
const path = require("path");
const fs = require("fs");

async function refreshData(filePath) {
  const startTime = new Date();
  let logEntry = new DataRefreshLog({
    status: "processing",
    start_time: startTime,
    created_at: new Date(),
  });

  try {
    await logEntry.save();

    if (!fs.existsSync(filePath)) {
      throw new Error("File not found");
    }

    const { processedCount, failedCount, errors } = await processCSV(filePath);

    logEntry.status = "success";
    logEntry.records_processed = processedCount;
    logEntry.failed_records = failedCount;
    logEntry.end_time = new Date();
    logEntry.duration_ms = new Date() - startTime;

    if (failedCount > 0) {
      logEntry.error_message = `${failedCount} records failed to process`;
      logEntry.error_details = errors.slice(0, 10);
    }

    await logEntry.save();
    return { success: true, processedCount, failedCount };
  } catch (err) {
    logEntry.status = "failed";
    logEntry.end_time = new Date();
    logEntry.duration_ms = new Date() - startTime;
    logEntry.error_message = err.message;
    await logEntry.save();

    console.error("Data refresh failed:", err);
    return { success: false, error: err.message };
  }
}

module.exports = { refreshData };
