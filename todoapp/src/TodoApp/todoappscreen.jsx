import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import 'flowbite';

const TodoAppScreen = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedTodoId, setSelectedTodoId] = useState(null);
const [searchTerm, setSearchTerm] = useState("");
const [showLogoutModal, setShowLogoutModal] = useState(false);



const openModal = (id) => {
  setSelectedTodoId(id);
  setIsModalOpen(true);
};


  const navigate = useNavigate(); 

  useEffect(() => {
    const token = localStorage.getItem("token");
     if (!token) {
       navigate("/userLogin");
       return;
     }
  });
  useEffect(() => {
   getTodos();
  });

const handleToggleComplete = async (todo) => {
  const token = localStorage.getItem("token");
  if (!token) {
    setMessage("Please log in first.");
    return;
  }

  try {
    await axios.put(
      `http://localhost:8080/todos/${todo.id}`,
      {
        title: todo.title,
        completed: !todo.completed,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    setMessage("Todo updated.");
    getTodos();
  } catch (error) {
    setMessage(
      error.response?.data?.error || "Failed to update todo. Try again."
    );
  }
};

const filteredTodos = todos.filter((todo) =>
  todo.title.toLowerCase().includes(searchTerm.toLowerCase())
);


const handleDelete = async (id) => {



  const token = localStorage.getItem("token");
  if (!token) {
    setMessage("Please log in first.");
    return;
  }

  try {
    await axios.delete(`http://localhost:8080/todos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setMessage("Todo deleted.");
    getTodos();
    setIsModalOpen(false); 
  } catch (error) {
    setMessage("Failed to delete todo.");
  }
};

 const getTodos = async () => {
   const token = localStorage.getItem("token");
   if (!token) {
     setMessage("No token found. Please log in.");
     return;
   }

   try {
     const response = await axios.get("http://localhost:8080/todos", {
       headers: {
         Authorization: `Bearer ${token}`,
       },
     });

     setTodos(response.data);
     setMessage("Todos fetched successfully.");
   } catch (error) {
     setMessage(
       error.response?.data?.error || "Failed to fetch todos from server."
     );
   }
 };

 const handleSubmit = async (e) => {
   e.preventDefault();

   const token = localStorage.getItem("token");
   if (!token) {
     setMessage("No token found. Please log in.");
     return;
   }

   try {
     const response = await axios.post(
       "http://localhost:8080/todos",
       { title, completed: false },
       {
         headers: {
           Authorization: `Bearer ${token}`,
           "Content-Type": "application/json",
         },
       }
     );

     setMessage("Todo added!");
     setTitle("");
     getTodos(); 
   } catch (error) {
     setMessage(
       error.response?.data?.error || "Failed to add todo. Try again."
     );
   }
 };

const handleConfirmLogout = () => {
  localStorage.removeItem("token");
  setMessage("Logged out successfully.");
  setShowLogoutModal(false);
  navigate("/userLogin");
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="w-full max-w-2xl h-full md:h-[90vh] bg-[#f5f5f7] p-4 rounded-xl flex flex-col overflow-hidden">
        {/* Top Section */}
        <div className="px-2 sm:px-4 pt-4">
          <h2 className="text-xl font-medium mb-4 text-gray-800">Your To Do</h2>
          <form onSubmit={(e) => e.preventDefault()} className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search todos..."
              />
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-[#1d1d1f] hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Todo List */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-[#f5f5f7]">
          <div className="space-y-4">
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <span className="text-gray-800 font-medium">
                    {todo.title}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleComplete(todo)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      {todo.completed ? "Undo" : "Mark as Done"}
                    </button>
                    <button
                      onClick={() => openModal(todo.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No todos found.</p>
            )}
          </div>
        </div>

        {/* Add Todo + Logout */}
        <div className="bg-gray-100 p-4 border-t">
          <form onSubmit={handleSubmit} className="space-y-2">
            <p>Add New</p>
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
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700"
            >
              Add Todo
            </button>
          </form>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-400 bg-opacity-70 flex justify-center items-center z-50 px-4">
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow-md">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
              >
                <svg
                  className="w-3 h-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
              <div className="p-4 md:p-5 text-center">
                <svg
                  className="mx-auto mb-4 text-red-500 w-12 h-12"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 className="mb-5 text-lg font-medium text-gray-700 leading-snug">
                  WARNING! This is a permanent action and cannot be undone.
                  <br />
                  <span className="font-light text-sm leading-tight text-black">
                    Are you sure you want to delete this todo?
                  </span>
                </h3>
                <button
                  onClick={() => handleDelete(selectedTodoId)}
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                >
                  Yes, I'm sure
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  type="button"
                  className="py-2.5 px-5 ml-3 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoAppScreen;
