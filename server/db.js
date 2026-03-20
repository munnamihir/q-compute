import pkg from "pg";
const { Pool } = pkg;

console.log("DB URL exists:", process.env.DATABASE_URL ? "YES ✅" : "NO ❌");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Debug connection
pool.on("connect", () => {
  console.log("✅ DB connected");
});

pool.on("error", (err) => {
  console.error("🔥 DB ERROR:", err);
});

export { pool };
