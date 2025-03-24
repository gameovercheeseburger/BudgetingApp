const API_BASE_URL = "http://localhost:8080/api/auth"; // Ensure correct backend URL

export const register = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error("Failed to register");
        }

        return response.json();
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
};
