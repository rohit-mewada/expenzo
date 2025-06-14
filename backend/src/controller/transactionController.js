import { sql } from "../config/db.js";

/**
 * Get all transactions (admin/debug).
 */
export async function getTransactions(req, res) {
    try {
        const transactions = await sql`select * from transactions`;
        res.status(200).json(transactions);
        console.log("Transactions fetched successfully");
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
}

/**
 * Get transactions for a specific user.
 */
export async function getTransactionByUserId(req, res) {
    try {
        const { userId } = req.params;
        const transactions = await sql`select * from transactions where user_id = ${userId}`;
        if (transactions.length === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json(transactions);
        console.log("Transaction fetched successfully");
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
}

/**
 * Add a new transaction.
 */
export async function addTransaction(req, res) {
    try {
        const { user_id, title, amount, category } = req.body;
        if (!user_id || !title || !category || amount === undefined) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const transactions = await sql`
      insert into transactions (user_id, title, amount, category)
      values (${user_id}, ${title}, ${amount}, ${category}) returning *
    `;
        res.status(201).json({ message: "Transaction created successfully", transactions });
        console.log("Transaction created successfully");
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ error: "Failed to create transaction" });
    }
}

/**
 * Update a transaction by ID.
 */
export async function updateTransaction(req, res) {
    try {
        const { id } = req.params;
        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Invalid transaction id" });
        }
        const { title, amount, category } = req.body;
        if (!title || amount === undefined || !category) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const transaction = await sql`
      update transactions set title = ${title}, amount = ${amount}, category = ${category}
      where id = ${id} returning *
    `;
        if (transaction.length === 0) {
            return res.status(404).json({ message: "Transaction Not Found" });
        }
        res.status(200).json({ message: "Transaction updated successfully", transaction });
        console.log("Transaction updated successfully");
    } catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).json({ error: "Failed to update transaction" });
    }
}

/**
 * Delete a transaction by ID.
 */
export async function deleteTransaction(req, res) {
    try {
        const { id } = req.params;
        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Invalid transaction id" });
        }
        const transaction = await sql`delete from transactions where id = ${id} returning *`;
        if (transaction.length === 0) {
            return res.status(404).json({ message: "Transaction Not Found" });
        }
        res.status(200).json({ message: "Transaction deleted successfully" });
        console.log("Transaction deleted successfully");
    } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({ error: "Failed to delete transaction" });
    }
}

/**
 * Get summary (balance, income, expenses) for a user.
 */
export async function getSummary(req, res) {
    try {
        const { userId } = req.params;
        const balance = await sql`select coalesce(sum(amount), 0) as bal from transactions where user_id = ${userId}`;
        const income = await sql`select coalesce(sum(amount), 0) as inc from transactions where user_id = ${userId} and amount >= 0`;
        const expenses = await sql`select coalesce(sum(amount), 0) as exp from transactions where user_id = ${userId} and amount < 0`;
        return res.status(200).json({
            balance: balance[0].bal,
            income: income[0].inc,
            expenses: expenses[0].exp
        });
    } catch (error) {
        console.error("Error getting summary:", error);
        res.status(500).json({ error: "Failed to get summary" });
    }
}

/** 
 * Get transactions by user ID and date range.
 */
export async function getTransactionByUserIdInDateRange(req, res) {
    try {
        const { userId } = req.params;
        const { filter, start, end } = req.query;

        let startDate, endDate
        const today = new Date();

        switch (filter) {
            case 'today':
                startDate = new Date(today.setHours(0, 0, 0, 0));
                endDate = new Date(today.setHours(23, 59, 59, 999));
                break;
            case 'last7':
                startDate = new Date();
                startDate.setDate(today.getDate() - 6);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date();
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'last30':
                startDate = new Date();
                startDate.setDate(today.getDate() - 29);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date();
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'custom':
                startDate = new Date(start);
                endDate = new Date(end);
                break;
            default:
                return res.status(400).json({ error: 'Invalid filter type' });
        }

        const transactions = await sql`
            select * from transactions
            where user_id = ${userId} and
            created_at >= ${startDate} and
            created_at <= ${endDate}
        `;

        if (transactions.length === 0) {
            return res.status(404).json({ message: "No transactions found in the specified date range" });
        }
        // Ensure transactions are sorted by date in descending order
        transactions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        console.log("Transactions in date range fetched successfully");
        return res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transactions in date range:", error);
        res.status(500).json({ error: "Failed to fetch transactions in date range" });
    }
}