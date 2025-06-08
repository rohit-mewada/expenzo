import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import ratelimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";

dotenv.config();

const app = express();

// Apply rate limiter middleware
app.use(ratelimiter);

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to log the request
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 3000;

// Mount transactions API route
app.use("/api/transactions", transactionsRoute);

// Initialize database before starting the server
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });

