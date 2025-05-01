import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const UserLogin = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      "http://localhost:8080/users/auth/login",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extract data from response
    const { message, token, user } = response.data;

    console.log("Message:", message);
    console.log("Token:", token);
    console.log("User:", user);

    if (token) {
      localStorage.setItem("token", token); // Save JWT
      setMessage("Login successful!");
      navigate("/todoapp");
    } else {
      setMessage("No token received. Login failed.");
    }
  } catch (error) {
    console.error("Error during login:", error);
    setMessage(
      error.response?.data?.message || "Login failed. Please try again."
    );
  }
};



  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
      </form>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
};

export default UserLogin;
