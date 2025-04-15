import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate input fields
      if (!name || !email || !password) {
        setErrors({ message: "Please fill in all fields" });
        return;
      }

      if (!validateEmail(email)) {
        setErrors({ message: "Invalid email address" });
        return;
      }

      // Password complexity check
      if (!validatePassword(password)) {
        setErrors({ message: "Password must be at least 6 characters long, contain one uppercase letter, one number, and one special character." });
        return;
      }

      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      if (response.ok) {
        navigate("/login");
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ message: error.message });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Password validation function with complexity requirements
  const validatePassword = (password) => {
    // Regular expression to check for:
    // - Minimum 6 characters
    // - At least one uppercase letter
    // - At least one number
    // - At least one special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  return (
    <div className="bg-emerald-700/40 h-screen flex items-center justify-center flex-col">
      <div className="bg-white px-7 py-7 rounded-md shadow-md">
        <h2 className="font-semibold text-4xl py-5 flex justify-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <label className="text-sm text-slate-800 font-medium mb-2 block">Name</label>  
          <input 
            type="text" 
            placeholder="Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required
            className="w-full text-sm px-4 py-2 rounded-md outline-none border mb-4" 
          />
          
          <label className="text-sm text-slate-800 font-medium mb-2 block">Email</label>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            className="w-full text-sm px-4 py-2 rounded-md outline-none border mb-4" 
          />
          
          <label className="text-sm text-slate-800 font-medium mb-2 block">Password</label>
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            className="w-full text-sm px-4 py-2 rounded-md outline-none border mb-6" 
          />
          
          <button 
            type="submit"
            className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded 
            text-white bg-green-600 hover:bg-green-700 focus:outline-none mb-4
            transition duration-300 ease-in-out"
          >
            Register
          </button>

          {errors.message && <p style={{ color: 'red' }}>{errors.message}</p>}
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
