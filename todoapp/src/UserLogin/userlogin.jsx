import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Form Data:", formData); 

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


    const { message, token, user } = response.data;

  
    // alert(
    //   `${message}\n\nUser: ${user.username}\nToken: ${token.substring(
    //     0,
    //     20
    //   )}...`
    // );

    console.log("Message:", message);
    console.log("Token:", token);
    console.log("User:", user);

    if (token) {
      localStorage.setItem("token", token); 
      setMessage("Login successful!");
      navigate("/todoapp");
    } else {
      setMessage("No token received. Login failed.");
    }
  } catch (error) {
    console.error("Error during login:", error);
    setMessage(
      error.response?.data?.error || "Login failed. Please try again."
    );
  }
};




  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm p-6 bg-white shadow-lg rounded-lg">
        <div className=" mt-10 mb-14 justify-center text-center items-center">
          <p className="text-2xl font-medium">Welcome Back to TaskNest</p>
          <p className="text-md font-normal">
            Log in to access your tasks and <br /> stay on track.
          </p>
        </div>
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

        <div
          onClick={() => (window.location.href = "/registration")}
          className="mt-6 text-center text-blue-600 cursor-pointer hover:underline"
        >
          <p>Don’t have an account? Register here</p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
