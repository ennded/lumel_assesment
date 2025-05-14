# Sales Data Analysis API - Backend Assessment

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-blue)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A robust backend API for processing and analyzing sales data from CSV files, with MongoDB storage and RESTful endpoints.

## 📌 Features

- CSV data loading with validation
- Daily data refresh mechanism
- Revenue analysis endpoints
- Error logging and monitoring
- Normalized database schema

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- MongoDB 6.0+
- npm v9+

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ennded/lumel_assesment.git

# 2. Navigate into the project folder
cd lumel_assesment/lumel_assesment

# 3. Install dependencies
npm install

# 4. Start the server
npm node app.js

```

### API Endpoints

1] post data

POST http://localhost:5000/api/orders

- Method: POST,

Body: {"order_id": "ORD1001", "customer_id": "CUST001", "date_of_sale": "2023-01-15", "region": "North", "payment_method": "Credit Card", "shipping_cost": 10.99, "items": [{"product_id": "PROD001", "quantity": 2, "unit_price": 29.99, "discount": 5.0}]},

Response: {"order_id": "ORD1001", "customer_id": "CUST001", "date_of_sale": "2023-01-15T00:00:00.000Z", "region": "North", "payment_method": "Credit Card", "shipping_cost": 10.99, "items": [{"product_id": "PROD001", "quantity": 2, "unit_price": 29.99, "discount": 5, "_id": "68250bf8817f9d1434765943"}], "\_id": "68250bf8817f9d1434765942", "created_at": "2025-05-14T21:32:40.773Z", "updated_at": "2025-05-14T21:32:40.777Z", "\_\_v": 0}

2] get all orders

GET http://localhost:5000/api/orders

- Method: GET,

Response: {
"order_id": "ORD1001",
"customer_id": "CUST001",
"date_of_sale": "2023-01-15T00:00:00.000Z",
"region": "North",
"payment_method": "Credit Card",
"shipping_cost": 10.99,
"items": [
{
"product_id": "PROD001",
"quantity": 2,
"unit_price": 29.99,
"discount": 5,
"_id": "682510d2817f9d1434765955"
}
],
"\_id": "682510d2817f9d1434765954",
"created_at": "2025-05-14T21:53:22.990Z",
"updated_at": "2025-05-14T21:53:22.991Z",
"\_\_v": 0
}

3] get orders by data range

GET http://localhost:5000/api/orders/date-range?startDate=2023-01-01&endDate=2023-12-31

- Method: GET,
  Response: [
  {
  "\_id": "68250bf8817f9d1434765942",
  "order_id": "ORD1001",
  "customer_id": "CUST001",
  "date_of_sale": "2023-01-15T00:00:00.000Z",
  "region": "North",
  "payment_method": "Credit Card",
  "shipping_cost": 10.99,
  "items": [
  {
  "product_id": "PROD001",
  "quantity": 2,
  "unit_price": 29.99,
  "discount": 5,
  "_id": "68250bf8817f9d1434765943"
  }
  ],
  "created_at": "2025-05-14T21:32:40.773Z",
  "updated_at": "2025-05-14T21:32:40.777Z",
  "\_\_v": 0
  }
  ]

4] Get single order

GET http://localhost:5000/api/orders/ORD1001

- Method: GET,

response: {
"\_id": "68250bf8817f9d1434765942",
"order_id": "ORD1001",
"customer_id": "CUST001",
"date_of_sale": "2023-01-15T00:00:00.000Z",
"region": "North",
"payment_method": "Credit Card",
"shipping_cost": 10.99,
"items": [
{
"product_id": "PROD001",
"quantity": 2,
"unit_price": 29.99,
"discount": 5,
"_id": "68250bf8817f9d1434765943"
}
],
"created_at": "2025-05-14T21:32:40.773Z",
"updated_at": "2025-05-14T21:32:40.777Z",
"\_\_v": 0
}

5]update order

PUT http://localhost:5000/api/orders/ORD1001

- Method: PUT,

Body: {
"region":"South"
}

response:{
"\_id": "68250bf8817f9d1434765942",
"order_id": "ORD1001",
"customer_id": "CUST001",
"date_of_sale": "2023-01-15T00:00:00.000Z",
"region": "South",
"payment_method": "Credit Card",
"shipping_cost": 10.99,
"items": [
{
"product_id": "PROD001",
"quantity": 2,
"unit_price": 29.99,
"discount": 5,
"_id": "68250bf8817f9d1434765943"
}
],
"created_at": "2025-05-14T21:32:40.773Z",
"updated_at": "2025-05-14T21:37:36.335Z",
"\_\_v": 0
}

6] delete order

DELETE http://localhost:5000/api/orders/ORD1001

- Method: DELETE,

response:{
"message": "Order deleted successfully"
}

7] trigger data refresh

POST http://localhost:5000/api/refresh

- Method: POST,

response: {
"message": "Data refresh triggered successfully"
}

8] get revenue by category
GET http://localhost:5000/api/analysis/revenue/category?startDate=2023-01-01&endDate=2023-12-31

- Method: GET,

response: {
"category": "Electronics",
"total_revenue": 10000
}

9] get revenue by region
GET http://localhost:5000/api/analysis/revenue/region?startDate=2023-01-01&endDate=2023-12-31

- Method: GET,

response: {
"region": "North",
"total_revenue": 5000
}

10] get revenue by product

GET http://localhost:5000/api/analysis/revenue/product?startDate=2023-01-01&endDate=2023-12-31

- Method: GET,

response: {
"product_id": "PROD001",
"total_revenue": 2000
}

11] get total revenue

GET http://localhost:5000/api/analysis/revenue/total?startDate=2023-01-01&endDate=2023-12-31

- Method: GET,

response: {
"totalRevenue": 0,
"totalOrders": 0,
"avgOrderValue": 0
}

backend_assesment/
├── config/ # Configuration files
├── controllers/ # Route controllers
├── models/ # MongoDB models
├── routes/ # API routes
├── services/ # Business logic
├── data/ # Sample CSV files
├── docs/ # Documentation
├── .env.example # Environment template
├── app.js # Main application
└── README.md

### Development

create .env file
MONGO_URI=mongodb://localhost:27017/sales_data
PORT=5000
Testing Endpoints
bash

# Test data load

curl -X POST http://localhost:5000/api/refresh \
 -H "Content-Type: application/json" \
 -d '{"filePath":"data/sample_data.csv"}'

# Test analysis

curl "http://localhost:5000/api/analysis/revenue/total?startDate=2023-01-01&endDate=2023-12-31"
