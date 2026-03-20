import express from "express";
import { nanoid } from "nanoid";

const router = express.Router();

// ===== In-memory DB =====
let tasks = [];
let users = {};
let transactions = [];

// ===== Generate Tasks =====
function generateTasks() {
  if (tasks.length < 5) {
    for (let i = 0; i < 5; i++) {
      tasks.push({
        id: nanoid(6),
        number: Math.floor(Math.random() * 50),
        reward: 0.02
      });
    }
  }
}

// ===== Get Tasks =====
router.get("/tasks", (req, res) => {
  generateTasks();
  res.json(tasks);
});

// ===== Submit Task =====
router.post("/submit", (req, res) => {

  const { taskId, result, userId } = req.body;

  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(400).json({ error: "Invalid task" });
  }

  if (result === task.number * 2) {

    tasks = tasks.filter(t => t.id !== taskId);

    if (!users[userId]) {
      users[userId] = { balance: 0 };
    }

    users[userId].balance += task.reward;

    transactions.push({
      id: nanoid(6),
      userId,
      reward: task.reward,
      time: new Date().toISOString()
    });

    return res.json({
      success: true,
      reward: task.reward,
      total: users[userId].balance
    });
  }

  res.json({ success: false });
});

// ===== Wallet =====
router.get("/wallet/:userId", (req, res) => {
  const user = users[req.params.userId];
  res.json(user || { balance: 0 });
});

// ===== Transactions =====
router.get("/transactions/:userId", (req, res) => {
  const data = transactions.filter(t => t.userId === req.params.userId);
  res.json(data);
});

// ===== Withdraw =====
router.post("/withdraw", (req, res) => {

  const { userId } = req.body;

  if (!users[userId] || users[userId].balance <= 0) {
    return res.json({ error: "No balance available" });
  }

  const amount = users[userId].balance;

  users[userId].balance = 0;

  res.json({
    success: true,
    message: `Withdrawal of $${amount.toFixed(2)} requested`
  });
});

export default router;
