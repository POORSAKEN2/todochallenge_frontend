import React, { useEffect, useState } from "react";

const TodoAppScreen = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");


  useEffect(() => {
   getTodos();
  });

  const getTodos = async () => {

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/todos", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        alert("Todos fetched successfully!\n" + JSON.stringify(data, null, 2));
        console.log(data); 
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (error) {
      setMessage("Failed to connect to server.");
    }
  }





  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // assumes you store JWT here
    if (!token) {
      setMessage("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, completed: false }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Todo added!");
        setTitle("");
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (error) {
      setMessage("Failed to connect to server.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Todo</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter todo title"
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Todo
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-red-500">{message}</p>}


      <div className="">

      </div>
    </div>
  );
};

export default TodoAppScreen;
