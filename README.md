# Inventory API & Express.js

A minimal reference implementation of a REST API built with **Express.js** for CSV-based inventory management, featuring file upload handling, PostgreSQL persistence, and automated stock monitoring with low-stock alerts and anomaly detection.

> [!IMPORTANT]
> **Disclaimer:** This is reference code. Production implementations require proper security measures.

---

## Environment Variables

Create a `.env` file in the root directory and populate it with the following variables:

```env
# Core Database
DATABASE_URL=

# API Default Port
PORT=

# Stock Monitoring
LOW_STOCK_THRESHOLD=

# Rate Limit
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_SECONDS=60
```

---

## Getting Started

Clone the repository, install the dependencies, and fire up the local development server using your preferred package manager:

```bash
# Install dependencies
npm install # or yarn, pnpm, bun

# Start the development server
npm run dev
```

---

## Usage

Send a CSV file to the inventory endpoint using a `multipart/form-data` POST request:

```bash
curl -X POST -F "file=@example/file.csv" http://localhost:3000/api/inventory
```

The API processes the file, stores the data in the database, and returns a report with current stock levels, low-stock alerts, and any detected anomalies.

---

## Deployment & Verification

You can interact with the API through the following execution contexts:

* Localhost: [http://localhost:3000/api/inventory](http://localhost:3000/api/inventory)


```bash
ricardo albrecht - ricardoalbrecht1@gmail.com
```