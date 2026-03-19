import express from "express";
import { nanoid } from "nanoid";

const router = express.Router();

let tasks = [];

// Generate tasks
router.get("/tasks", (req, res) => {

  if (tasks.length === 0) {
    for (let i = 0; i < 5; i++) {
      tasks.push({
        id: nanoid(6),
        number: Math.floor(Math.random() * 50),
        reward: 0.02
      });
    }
  }

  res.json(tasks);
});

// Submit result
router.post("/submit", (req, res) => {

  const { taskId, result } = req.body;

  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(400).json({ error: "Invalid task" });
  }

  if (result === task.number * 2) {

    tasks = tasks.filter(t => t.id !== taskId);

    return res.json({
      success: true,
      reward: task.reward
    });
  }

  res.json({ success: false });

});

export default router;
