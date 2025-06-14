import express from "express";
import {
    addTransaction,
    deleteTransaction,
    getSummary,
    getTransactionByUserId,
    getTransactionByUserIdInDateRange,
    getTransactions,
    updateTransaction
} from "../controller/transactionController.js";

const router = express.Router();

// Get all transactions (admin/debug)
router.get("/", getTransactions);

// Get transactions for a specific user
router.get("/:userId", getTransactionByUserId);

// Add a new transaction
router.post("/", addTransaction);

// Update a transaction by ID
router.put("/:id", updateTransaction);

// Delete a transaction by ID
router.delete("/:id", deleteTransaction);

// Get summary for a user
router.get("/summary/:userId", getSummary);

// Get transactions by user ID in date range
router.get("/date/:userId", getTransactionByUserIdInDateRange);

export default router;