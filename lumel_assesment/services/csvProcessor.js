const csv = require("csv-parser");
const fs = require("fs");
const { Transform } = require("stream");
const { validateOrderData } = require("../utils/validators");
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const Order = require("../models/Order");
const path = require("path");
const filePath = path.join(__dirname, "data", "sales_data_.csv");

async function processCSV(filePath, batchSize = 1000) {
  return new Promise((resolve, reject) => {
    let batch = [];
    let processedCount = 0;
    let failedCount = 0;
    const errors = [];

    const processBatch = async (batch) => {
      try {
        await Promise.all([upsertCustomers(batch), upsertProducts(batch)]);

        const orderPromises = batch.map((record) =>
          processOrderRecord(record).catch((err) => {
            failedCount++;
            errors.push({ record: record.order_id, error: err.message });
          })
        );

        await Promise.all(orderPromises);
        processedCount += batch.length - failedCount;
      } catch (err) {
        failedCount += batch.length;
        errors.push({ error: err.message });
      }
    };

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("error", reject)
      .pipe(
        new Transform({
          objectMode: true,
          transform: async (record, encoding, callback) => {
            try {
              const validated = validateOrderData(record);
              batch.push(validated);

              if (batch.length >= batchSize) {
                await processBatch([...batch]);
                batch = [];
              }
              callback();
            } catch (err) {
              failedCount++;
              errors.push({ record: record.order_id, error: err.message });
              callback();
            }
          },
        })
      )
      .on("finish", async () => {
        if (batch.length > 0) {
          await processBatch(batch);
        }
        resolve({ processedCount, failedCount, errors });
      })
      .on("error", reject);
  });
}

async function upsertCustomers(batch) {
  const customers = batch.map((record) => ({
    customer_id: record.customer_id,
    name: record.customer_name,
    email: record.customer_email,
    address: record.customer_address,
  }));

  const bulkOps = customers.map((customer) => ({
    updateOne: {
      filter: { customer_id: customer.customer_id },
      update: { $set: customer },
      upsert: true,
    },
  }));

  if (bulkOps.length > 0) {
    await Customer.bulkWrite(bulkOps, { ordered: false });
  }
}

async function upsertProducts(batch) {
  const products = batch.map((record) => ({
    product_id: record.product_id,
    name: record.product_name,
    category: record.category,
    unit_price: record.unit_price,
  }));

  const bulkOps = products.map((product) => ({
    updateOne: {
      filter: { product_id: product.product_id },
      update: { $set: product },
      upsert: true,
    },
  }));

  if (bulkOps.length > 0) {
    await Product.bulkWrite(bulkOps, { ordered: false });
  }
}

async function processOrderRecord(record) {
  try {
    const validated = validateOrderData(record);
    const orderData = {
      order_id: record.order_id,
      customer_id: record.customer_id,
      date_of_sale: new Date(record.date_of_sale),
      region: record.region,
      payment_method: record.payment_method,
      shipping_cost: parseFloat(record.shipping_cost),
      items: [
        {
          product_id: record.product_id,
          quantity: parseInt(record.quantity_sold),
          unit_price: parseFloat(record.unit_price),
          discount: parseFloat(record.discount) || 0,
        },
      ],
    };

    await Order.updateOne(
      { order_id: orderData.order_id },
      { $set: orderData },
      { upsert: true }
    );

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err.message,
      record: record.order_id,
    };
  }
}

module.exports = { processCSV };
