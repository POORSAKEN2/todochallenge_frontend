import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      "http://localhost:8080/users/auth/register",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      setMessage("Registration successful!");
    } else {
      setMessage("Registration failed. Please try again.");
    }
  } catch (error) {
    console.error("Error during registration:", error);
    setMessage(
      error.response?.data?.message || "Registration failed. Please try again."
    );
  }
};



  return (
    <div className="max-w-sm mx-auto mt-12 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
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
          Register
        </button>
      </form>

      {message && <p className="mt-4 text-center text-red-500">{message}</p>}

      <div
        onClick={() => (window.location.href = "/userLogin")}
        className="mt-6 text-center text-blue-600 cursor-pointer hover:underline"
      >
        <p>Already have an account? Login here</p>
      </div>
    </div>
  );
};

export default Register;
