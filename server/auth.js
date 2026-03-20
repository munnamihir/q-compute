import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "./db.js";

const router = express.Router();

const SECRET = process.env.JWT_SECRET || "secret";

// =========================
// REGISTER
// =========================
router.post("/register", async (req, res) => {

  try {

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users(username, password_hash) VALUES($1,$2)",
      [username, hash]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("🔥 REGISTER ERROR:", err);
    res.status(500).json({ error: "Register failed", details: err.message });
  }

});

// =========================
// LOGIN
// =========================
router.post("/login", async (req, res) => {

  try {

    const { username, password } = req.body;

    console.log("LOGIN:", username);

    if (!username || !password) {
      return res.status(400).json({ error: "Missing credentials" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE username=$1",
      [username]
    );

    if (!result.rows.length) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = result.rows[0];

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user.id },
      SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);
    res.status(500).json({
      error: "Login failed",
      details: err.message
    });
  }

});

export default router;
