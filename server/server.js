import express from "express";
import dotenv from "dotenv";

import qcompute from "./qcompute.js";
import authRoutes from "./auth.js";
import { pool } from "./db.js";

// Load env variables
dotenv.config();

const app = express();

// =========================
// DEBUG STARTUP INFO
// =========================
console.log("🚀 Starting server...");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "SET ✅" : "MISSING ❌");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "SET ✅" : "MISSING ❌");

// =========================
// TEST DB CONNECTION (VERY IMPORTANT)
// =========================
(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ DB connection working");
  } catch (err) {
    console.error("❌ DB connection FAILED:", err.message);
  }
})();

// =========================
// MIDDLEWARE
// =========================
app.use(express.json());
app.use(express.static("public"));

// =========================
// ROUTES
// =========================
app.use("/auth", authRoutes);
app.use("/qcompute", qcompute);

// =========================
// HEALTH CHECK
// =========================
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// =========================
// FALLBACK
// =========================
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

// =========================
// ERROR HANDLER
// =========================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
