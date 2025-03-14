import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div class="bg-emerald-700/40  h-screen flex items-center justify-center flex-col">
      <div class='bg-white px-7 py-7 rounded-md shadow-md'>
      <h2 class="font-semibold text-4xl py-5 flex justify-center">Login</h2>
      <form onSubmit={handleSubmit}>
        <label class='text-sm text-slate-800 font-medium mb-2 block'>Email</label>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
          class='w-full text-sm px-4 py-2 rounded-md outline-none border mb-4'/>
        
        <label class='text-sm text-slate-800 font-medium mb-2 block'>Password</label>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required 
          class='w-full text-sm px-4 py-2 rounded-md outline-none border mb-6'/>

        <button type="submit" 
          class='w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded 
          text-white bg-green-600 hover:bg-green-700 focus:outline-none mb-4'>Login</button>
      </form>
      <p class='flex justify-center'>Don't have an account? 
        <Link to="/register">
          <p class='pl-1 font-semibold hover:underline'>Register</p>
        </Link>
      </p>
      </div>
    </div>
  );
}

export default LoginPage;