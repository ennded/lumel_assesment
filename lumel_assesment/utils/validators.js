const validateOrderData = (order) => {
  const requiredFields = [
    "order_id",
    "product_id",
    "customer_id",
    "date_of_sale",
    "quantity_sold",
    "unit_price",
  ];

  const errors = [];

  requiredFields.forEach((field) => {
    if (!order[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  if (order.quantity_sold && isNaN(parseInt(order.quantity_sold))) {
    errors.push("Quantity must be a number");
  }

  if (order.unit_price && isNaN(parseFloat(order.unit_price))) {
    errors.push("Unit price must be a number");
  }

  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }

  return {
    ...order,
    quantity_sold: parseInt(order.quantity_sold),
    unit_price: parseFloat(order.unit_price),
    discount: parseFloat(order.discount) || 0,
  };
};

module.exports = { validateOrderData };
