import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PrismaClient } from "./generated/prisma/index.js";
import { cors } from "hono/cors";
import * as dotenv from "dotenv";
dotenv.config();

const app = new Hono();
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
    },
  },
});

app.use("*", cors({ origin: "http://localhost:3000" }));
// Getting the task list
app.get("/tasks", async (c) => {
  const tasks = await prisma.task.findMany();
  return c.json(tasks);
});

// POST create a new task
app.post("/tasks", async (c) => {
  const body = await c.req.json();
  const { title, description } = body;
  const task = await prisma.task.create({
    data: { title, description },
  });

  return c.json(task);
});

// PUT update a task
app.put("/tasks/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json();
  const { title, description } = body;

  const updatedTask = await prisma.task.update({
    where: { id },
    data: { title, description },
  });

  return c.json(updatedTask);
});

// DELETE a task
app.delete("/tasks/:id", async (c) => {
  const id = Number(c.req.param("id"));

  await prisma.task.delete({
    where: { id },
  });

  return c.text("Task deleted");
});

// Default route to check if the server is running
app.get("/", (c) => {
  return c.text("Hello Wangpo Your Server is Ready!");
});

app.all("*", (c) => {
  return c.json({ error: "Route not found" }, 404);
});

// Start server
serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT) || 4000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
