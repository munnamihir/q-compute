import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "./db.js";

const router = express.Router();

const SECRET = process.env.JWT_SECRET || "secret";

// REGISTER
router.post("/register", async (req, res) => {

  const { username, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO users(username, password_hash) VALUES($1,$2)",
    [username, hash]
  );

  res.json({ success: true });
});

// LOGIN
router.post("/login", async (req, res) => {

  const { username, password } = req.body;

  const user = await pool.query(
    "SELECT * FROM users WHERE username=$1",
    [username]
  );

  if (!user.rows.length) return res.status(401).json({ error: "Invalid" });

  const valid = await bcrypt.compare(password, user.rows[0].password_hash);

  if (!valid) return res.status(401).json({ error: "Invalid" });

  const token = jwt.sign({ id: user.rows[0].id }, SECRET);

  res.json({ token });
});

export default router;
