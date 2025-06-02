import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import ratelimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";

dotenv.config();

const app = express();

//rate limiter
app.use(ratelimiter);

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to log the request
app.use((req, res, next) => {
    console.log(`Hey we hit a req, the url is ${req.url} and the method is ${req.method}`);
    next();
});

const PORT = process.env.PORT || 3000;

app.use("/api/transactions", transactionsRoute)

// Initialize database before starting the server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error("Failed to initialize database:", error);
  process.exit(1);
});

