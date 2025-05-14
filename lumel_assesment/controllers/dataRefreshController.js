const fs = require("fs");
const path = require("path");
const { processCSV } = require("../services/csvProcessor");
const DataRefreshLog = require("../models/DataRefreshLog");

exports.refreshData = async (req, res, next) => {
  try {
    const { filePath } = req.body;
    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
      const dataDir = path.join(__dirname, "../data");
      const availableFiles = fs.existsSync(dataDir)
        ? fs.readdirSync(dataDir).join(", ")
        : "Data directory not found";

      return res.status(400).json({
        success: false,
        error: `File not found at: ${absolutePath}`,
        availableFiles,
      });
    }

    const refreshResult = await processCSV(absolutePath);

    await DataRefreshLog.create({
      status: "success",
      records_processed: refreshResult.processedCount,
      failed_records: refreshResult.failedCount,
      file_path: filePath,
    });

    return res.json({
      success: true,
      processedRecords: refreshResult.processedCount,
      failedRecords: refreshResult.failedCount,
      errors: refreshResult.errors?.slice(0, 5) || [],
    });
  } catch (err) {
    await DataRefreshLog.create({
      status: "failed",
      error_message: err.message,
      file_path: req.body.filePath,
    });

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
