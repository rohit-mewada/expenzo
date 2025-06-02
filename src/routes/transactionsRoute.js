import express from "express";
import { sql } from "../config/db.js";
import { addTransaction, deleteTransaction, getSummary, getTransactionByUserId, getTransactions, updateTransaction } from "../controller/transactionController.js";

const router = express.Router();

router.get("/", getTransactions);

router.get("/:userId", getTransactionByUserId);

router.post("/", addTransaction);

router.put("/:id", updateTransaction);

router.delete("/:id", deleteTransaction);

router.get("/summary/:userId", getSummary);


export default router;