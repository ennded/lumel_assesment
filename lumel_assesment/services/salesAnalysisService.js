const Order = require("../models/Order");
const Product = require("../models/Product");

async function calculateRevenueByCategory(startDate, endDate) {
  const matchStage = {
    $match: {
      date_of_sale: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    },
  };

  const lookupStage = {
    $lookup: {
      from: "products",
      localField: "items.product_id",
      foreignField: "product_id",
      as: "productDetails",
    },
  };

  const unwindStages = [{ $unwind: "$items" }, { $unwind: "$productDetails" }];

  const groupStage = {
    $group: {
      _id: "$productDetails.category",
      totalRevenue: {
        $sum: {
          $multiply: [
            "$items.quantity",
            { $subtract: ["$items.unit_price", "$items.discount"] },
          ],
        },
      },
      count: { $sum: 1 },
    },
  };

  const sortStage = { $sort: { totalRevenue: -1 } };

  const pipeline = [
    matchStage,
    lookupStage,
    ...unwindStages,
    groupStage,
    sortStage,
  ];

  return Order.aggregate(pipeline);
}

async function calculateRevenueByProduct(startDate, endDate) {
  const matchStage = {
    $match: {
      date_of_sale: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    },
  };

  const lookupStage = {
    $lookup: {
      from: "products",
      localField: "items.product_id",
      foreignField: "product_id",
      as: "productDetails",
    },
  };

  const unwindStages = [{ $unwind: "$items" }, { $unwind: "$productDetails" }];

  const groupStage = {
    $group: {
      _id: {
        productId: "$productDetails.product_id",
        productName: "$productDetails.name",
      },
      totalRevenue: {
        $sum: {
          $multiply: [
            "$items.quantity",
            { $subtract: ["$items.unit_price", "$items.discount"] },
          ],
        },
      },
      totalQuantity: { $sum: "$items.quantity" },
      category: { $first: "$productDetails.category" },
    },
  };

  const sortStage = { $sort: { totalRevenue: -1 } };

  const pipeline = [
    matchStage,
    lookupStage,
    ...unwindStages,
    groupStage,
    sortStage,
  ];

  return Order.aggregate(pipeline);
}

async function calculateRevenueByRegion(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        date_of_sale: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $unwind: "$items",
    },
    {
      $group: {
        _id: "$region",
        totalRevenue: {
          $sum: {
            $multiply: [
              "$items.quantity",
              { $subtract: ["$items.unit_price", "$items.discount"] },
            ],
          },
        },
        totalOrders: { $sum: 1 },
      },
    },
    { $sort: { totalRevenue: -1 } },
  ];

  return Order.aggregate(pipeline);
}

async function calculateTotalRevenue(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        date_of_sale: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $unwind: "$items",
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: {
            $multiply: [
              "$items.quantity",
              { $subtract: ["$items.unit_price", "$items.discount"] },
            ],
          },
        },
        totalOrders: { $sum: 1 },
        avgOrderValue: { $avg: "$items.unit_price" },
      },
    },
  ];

  const result = await Order.aggregate(pipeline);
  return (
    result[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      avgOrderValue: 0,
    }
  );
}

module.exports = {
  calculateRevenueByCategory,
  calculateRevenueByProduct,
  calculateRevenueByRegion,
  calculateTotalRevenue,
};
