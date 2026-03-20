import express from "express";
import { nanoid } from "nanoid";
import { pool } from "./db.js";
import { auth } from "./middleware.js";

const router = express.Router();

// GET TASK
router.get("/task", auth, async (req, res) => {

  let task = await pool.query(
    "SELECT * FROM tasks WHERE status='pending' LIMIT 1"
  );

  if (!task.rows.length) {

    const id = nanoid(6);
    const number = Math.floor(Math.random() * 50);

    await pool.query(
      "INSERT INTO tasks(id, number, reward) VALUES($1,$2,$3)",
      [id, number, 0.02]
    );

    task = await pool.query("SELECT * FROM tasks WHERE id=$1", [id]);
  }

  res.json(task.rows[0]);
});

// SUBMIT TASK
router.post("/submit", auth, async (req, res) => {

  const { taskId, result } = req.body;

  const task = await pool.query(
    "SELECT * FROM tasks WHERE id=$1",
    [taskId]
  );

  if (!task.rows.length) {
    return res.status(400).json({ error: "Invalid task" });
  }

  const t = task.rows[0];

  if (result === t.number * 2) {

    await pool.query("UPDATE tasks SET status='done' WHERE id=$1", [taskId]);

    await pool.query(
      "UPDATE users SET balance = balance + $1 WHERE id=$2",
      [t.reward, req.user.id]
    );

    await pool.query(
      "INSERT INTO transactions(id,user_id,reward) VALUES($1,$2,$3)",
      [nanoid(6), req.user.id, t.reward]
    );

    return res.json({ success: true });
  }

  res.json({ success: false });
});

export default router;
