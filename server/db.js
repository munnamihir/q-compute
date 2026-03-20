import pkg from "pg";
const { Pool } = pkg;

let pool;

try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  pool.on("connect", () => {
    console.log("✅ Connected to DB");
  });

} catch (err) {
  console.error("❌ DB INIT ERROR:", err);
}

export { pool };
