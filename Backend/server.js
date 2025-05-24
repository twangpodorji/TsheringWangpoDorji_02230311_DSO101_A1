const dotenv = require('dotenv');

// Load the appropriate .env file
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env' });
}

const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection with Sequelize 
const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: 5432,
  dialect: "postgres",
  logging: console.log, // Log SQL queries for debugging
});

// Define Task Model
const Task = sequelize.define("Task", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
});

// Sync Database
sequelize
  .sync()
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Error syncing database:", err));

// Routes

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.findAll({ order: [["createdAt", "DESC"]] });
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create a new task
app.post("/tasks", async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTask = await Task.create({ title, description });
    res.status(201).json(newTask);
  } catch (err) {
    console.error("Error creating task:", err.message);
    res.status(400).json({ message: "Failed to create task" });
  }
});

// Update a task
app.put("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const { title, description } = req.body;
    await task.update({ title, description });
    res.json(task);
  } catch (err) {
    console.error("Error updating task:", err.message);
    res.status(400).json({ message: "Failed to update task" });
  }
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.destroy();
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Error deleting task:", err.message);
    res.status(500).json({ message: "Failed to delete task" });
  }
});

// Default route to check if the server is running
app.get("/", (req, res) => {
  res.send("Hello Wangpo Your Server is Ready!");
});

// New route to get user by ID
app.get("/user/:id", (req, res) => {
  res.send(`User ID: ${req.params.id}`);
});

// Catch-all route for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
console.log("Server is starting...");
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
