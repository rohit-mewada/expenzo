import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to log the request
app.use((req, res, next) => {
    console.log(`Hey we hit a req, the url is ${req.url} and the method is ${req.method}`);
    next();
});

const PORT = process.env.PORT || 3000;

async function initDB() {
    try {
        await sql`create table if not exists transactions (
            id serial primary key,
            user_id varchar(255) not null,
            title varchar(255) not null,
            amount decimal(10, 2) not null,
            category varchar(255) not null,
            created_at timestamp default current_date
        )`;

        console.log("Database initialized successfully");
    } catch (error) {
        console.error("Error initializing database:", error);
        process.exit(1);
    }
}

app.get("/api/transactions", async (req, res) => {
    try {
        const transactions = await sql`select * from transactions`;
        res.status(200).json(transactions);
        console.log("Transactions fetched successfully");
        console.log(transactions);
    }
    catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});

app.get("/api/transactions/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const transactions = await sql`select * from transactions where user_id = ${userId}`;

        if(transactions.length === 0) {
            return res.status(404).json({ message : "Trasaction not found" });
        }

        res.status(200).json(transactions);
        console.log("Transaction fetched successfully"); 
        console.log(transactions);  
    }
    catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});

app.post("/api/transactions", async (req, res) => {
    try {
        const { user_id, title, amount, category } = req.body;

        if(!user_id || !title || !category || amount === undefined) {
            console.log("All fields are required");
            return res.status(400).json({ error: "All fields are required" });
        }

        const transactions = await sql`insert into transactions (user_id, title, amount, category) values (${user_id}, ${title}, ${amount}, ${category}) returning *`;
        res.status(201).json({ message: "Transaction created successfully", transactions });
        console.log("Transaction created successfully");
        console.log(transactions);
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ error: "Failed to create transaction" });
    }
});

app.put("/api/transactions/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if(isNaN(parseInt(id))) {
            return res.status(400).json({ message : "Invalid transaction id"});
        }

        const { title, amount, category } = req.body;

        if(!title || !amount || !category) {
            console.log("All fields are required");
            return res.status(400).json({ error: "All fields are required" });
        }

        const transaction = await sql`update transactions set title = ${title}, amount = ${amount}, category = ${category} where id = ${id} returning *`;

        if(transaction.length === 0) {
            return res.status(404).json({ message : "Transaction Not Found" });
        }

        res.status(200).json({ message: "Transaction updated successfully", transaction });
        console.log("Transaction updated successfully");
        console.log(transaction);
    }
    catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).json({ error: "Failed to update transaction" });
    }
});

app.delete("/api/transactions/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if(isNaN(parseInt(id))) {
            return res.status(400).json({ message : "Invalid transaction id"});
        }

        const transaction = await sql`delete from transactions where id = ${id} returning *`;

        if(transaction.length === 0) {
            return res.status(404).json({ message : "Transaction Not Found" });
        }

        res.status(200).json({ message: "Transaction deleted successfully" });
        console.log("Transaction deleted successfully");
    }
    catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({ error: "Failed to delete transaction" });
    }
});

app.get("/api/transactions/summary/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const balance = await sql`select coalesce(sum(amount), 0) as bal from transactions where user_id = ${userId}`;
        const income = await sql`select coalesce(sum(amount), 0) as inc from transactions where user_id = ${userId} and amount >= 0`;
        const expenses = await sql`select coalesce(sum(amount), 0) as exp from transactions where user_id = ${userId} and amount < 0`;

        return res.status(200).json({
            "balance" : balance[0].bal,
            "income" : income[0].inc,
            "expenses" : expenses[0].exp
        });

    } catch {
        console.error("Error getting summary:", error);
        res.status(500).json({ error: "Failed to get summary" });
    }
});


// Initialize database before starting the server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error("Failed to initialize database:", error);
  process.exit(1);
});

