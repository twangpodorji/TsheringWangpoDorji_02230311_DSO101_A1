"use client"; // This is a client component which is used to render the user interface of the task manager application

import { useState } from "react";
// Installating the lucide which is a react package for the icon which is being used in the
// user interface for deleting the task
import { Trash2 } from "lucide-react";
import { useEffect } from "react";

export default function Home() {
  // This is the main component of the task manager application
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  const addTask = async () => {
    if (newTaskTitle.trim() === "") return;

    const res = await fetch("http://localhost:4000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTaskTitle,
        description: newTaskDescription,
      }),
    });

    const createdTask = await res.json();
    setTasks([createdTask, ...tasks]);
    setNewTaskTitle("");
    setNewTaskDescription("");
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:4000/tasks/${id}`, {
      method: "DELETE",
    });

    setTasks(tasks.filter((task) => task.id !== id));
  };

  // For initial loading (fetch all tasks)
  useEffect(() => {
    async function fetchTasks() {
      const res = await fetch("http://localhost:4000/tasks");
      const data = await res.json();
      setTasks(data);
    }
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen p-8 pb-20 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8">My Tasks</h1>

      {/* Input section */}
      <div className="flex flex-col gap-4 mb-8 w-full max-w-md">
        <input
          type="text"
          placeholder="Task Title"
          className="border p-2 rounded"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Task Description"
          className="border p-2 rounded"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        />
        <button
          onClick={addTask}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
        >
          New Task
        </button>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-4 w-full max-w-md">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>
              <h2 className="font-bold">{task.title}</h2>
              <p className="text-gray-500">{task.description}</p>
            </div>
            <button onClick={() => deleteTask(task.id)}>
              <Trash2 className="text-red-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
