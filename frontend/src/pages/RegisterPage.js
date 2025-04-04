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
      if (!name || !email || !password) {
        setErrors({ message: "Please fill in all fields" });
        return;
      }

      if (!validateEmail(email)) {
        setErrors({ message: "Invalid email address" });
        return;
      }

      if (password.length < 8) {
        setErrors({ message: "Password must be at least 8 characters long" });
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

  return (
    <div class='bg-emerald-700/40  h-screen flex items-center justify-center flex-col'>
      <div class='bg-white px-7 py-7 rounded-md shadow-md'>
        <h2 class="font-semibold text-4xl py-5 flex justify-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <label class='text-sm text-slate-800 font-medium mb-2 block'>Name</label>  
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required
            class='w-full text-sm px-4 py-2 rounded-md outline-none border mb-4' />
          
          <label class='text-sm text-slate-800 font-medium mb-2 block'>Email</label>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
            class='w-full text-sm px-4 py-2 rounded-md outline-none border mb-4' />
          
          <label class='text-sm text-slate-800 font-medium mb-2 block'>Password</label>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
            class='w-full text-sm px-4 py-2 rounded-md outline-none border mb-6' />
          
          <button type="submit"
            class='w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded 
            text-white bg-green-600 hover:bg-green-700 focus:outline-none mb-4
            transition duration-300 ease-in-out'>Register</button>

          {errors.message && <p style={{ color: 'red' }}>{errors.message}</p>}
        </form>
      </div>
      
    </div>
  );
}

export default RegisterPage;
