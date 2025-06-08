import { neon } from "@neondatabase/serverless";
import "dotenv/config";

/**
 * Neon SQL instance.
 */
export const sql = neon(process.env.DATABASE_URL);

/**
 * Initialize the database and create the transactions table if it doesn't exist.
 */
export async function initDB() {
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
