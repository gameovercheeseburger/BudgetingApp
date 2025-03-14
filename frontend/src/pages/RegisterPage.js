import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    if (response.ok) {
      navigate("/login");
    }
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
            text-white bg-green-600 hover:bg-green-700 focus:outline-none mb-4'>Register</button>
        </form>
      </div>
      
    </div>
  );
}

export default RegisterPage;