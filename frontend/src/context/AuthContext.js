import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("userData");
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser({ 
            token,
            ...parsedUser
          });
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        // Clear corrupted data
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      
      if (!data.token || !data.user) {
        throw new Error("Invalid server response");
      }

      // Store auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));
      
      // Update state
      setUser({
        token: data.token,
        ...data.user
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Re-throw to handle in components
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUser(null);
    navigate("/login");
  }, [navigate]);

  // Add function to check auth status
  const isAuthenticated = useCallback(() => {
    return !!user?.token;
  }, [user]);

  // Add function to refresh user data
  const refreshUser = async () => {
    if (!user?.token) return;
    
    try {
      const response = await fetch("http://localhost:8080/api/users/me", {
        headers: {
          "Authorization": `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("userData", JSON.stringify(userData));
        setUser(prev => ({ ...prev, ...userData }));
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isInitializing,
      login, 
      logout,
      isAuthenticated,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;