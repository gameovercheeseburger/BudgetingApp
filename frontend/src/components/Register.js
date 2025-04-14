import { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.userName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.text();

      if (response.ok) {
        alert("✅ " + data);
        if (onRegister) onRegister(); // Call parent callback if needed
      } else {
        alert("⚠️ " + data);
      }
    } catch (err) {
      alert("Something went wrong: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="intro">
      <div>
        <h1>
          Take Control of <span className="accent">Your Money</span>
        </h1>
        <p>
          Personal budgeting is the secret to financial success. Sign up today!
        </p>
        <form onSubmit={handleSubmit}>
          <label>Enter Name</label>
          <input
            type="text"
            name="userName"
            placeholder="Enter name"
            value={formData.userName}
            onChange={handleChange}
            required
          />
          <label>Enter Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label>Enter Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn btn--dark" disabled={isSubmitting}>
            {isSubmitting ? (
              <span>Creating User...</span>
            ) : (
              <>
                <span>Create New User</span>
                <PlusCircleIcon width={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
