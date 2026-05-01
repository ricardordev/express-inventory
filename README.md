## Getting Started

It's just an example of how to use **express.js** to create simple API to accept csv file, process it to store in database and return reports like current stock, low stock alerts and anomalies. It uses **Multer** as middleware for file upload and **PostgreSQL** as database. To check it, run the development server:

## Environment Variables

```bash
# Database connection
DATABASE_URL=

# API Default Port
PORT=

# Qty to trigger alerts
LOW_STOCK_THRESHOLD=
```

## Running

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Endpoint

```bash
http://localhost:3000/api/inventory
```

## Usage Example

```bash
curl -X POST -F "file=@example/file.csv" http://localhost:3000/api/inventory
```


```bash
ricardo albrecht - [EMAIL_ADDRESS]
```