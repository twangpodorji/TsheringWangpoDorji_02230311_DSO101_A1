"use client";
// Import necessary libraries and components of the React application
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react"; // Icon for delete button because it looks nice and is widely used

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000"; // Default to localhost if not set and for local development
console.log("API_URL:", API_URL);

// Main component for the home page of the application which manages tasks
export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null); // Track which task is being edited
  const [editingTaskTitle, setEditingTaskTitle] = useState("");
  const [editingTaskDescription, setEditingTaskDescription] = useState("");

  // Fetching all tasks from the backend API
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);// make a GET request to the API
      if (!res.ok) throw new Error("Failed to fetch tasks");// Check if the response is ok 
      const data = await res.json();// Parse the response data as JSON
      setTasks(data);// Update the state with the fetched tasks
    } catch (err) {
      console.error("Error fetching tasks:", err.message);// any errors that occur during the fetch
    }
  };

  // Add a new task to the backend 
  const addTask = async () => {
    if (newTaskTitle.trim() === "") return; // Prevent adding empty tasks with an empty title
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST", // HTTP method to create a new task
        headers: { "Content-Type": "application/json" }, // specify the content type as JSON
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDescription,
        }),
      });
      if (!res.ok) throw new Error("Failed to create task"); // handles errors if the response is not ok
      const createdTask = await res.json();
      setTasks([createdTask, ...tasks]); //add the new tsk to the list 
      setNewTaskTitle("");
      setNewTaskDescription(""); // clear the input fields 
    } catch (err) {
      console.error("Error adding task:", err.message); // if errors occur during the fetch
    }
  };

  // Update a task
  const updateTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT", // HTTP method to update an existing task
        headers: { "Content-Type": "application/json" }, // specify the content type as JSON
        body: JSON.stringify({
          title: editingTaskTitle,
          description: editingTaskDescription,
        }),
      });
      if (!res.ok) throw new Error("Failed to update task"); // Check if the response is ok
      const updatedTask = await res.json();
      const updatedTasks = tasks.map((task) =>
        task.id === id ? updatedTask : task
      );
      setTasks(updatedTasks);
      setEditingTaskId(null); // Exit edit mode 
    } catch (err) {
      console.error("Error updating task:", err.message);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete task");
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err.message);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
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
          className="bg-blue-500 hover:bg-blue- text-white p-2 rounded"
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-4 w-full max-w-md">
        {tasks.map((task) => (
          <div key={task.id} className="border rounded p-4 flex flex-col gap-2">
            {editingTaskId === task.id ? (
              // Edit Mode
              <div>
                <input
                  type="text"
                  className="border p-2 rounded mb-2 w-full"
                  value={editingTaskTitle}
                  onChange={(e) => setEditingTaskTitle(e.target.value)}
                />
                <input
                  type="text"
                  className="border p-2 rounded mb-2 w-full"
                  value={editingTaskDescription}
                  onChange={(e) => setEditingTaskDescription(e.target.value)}
                />
                <button
                  onClick={() => updateTask(task.id)}
                  className="bg-green-500 hover:bg-green-600 text-white p-2 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingTaskId(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              // View Mode for the task 
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-bold">{task.title}</h2>
                  <p className="text-gray-500">{task.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingTaskId(task.id);
                      setEditingTaskTitle(task.title);
                      setEditingTaskDescription(task.description);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
