import axios from "axios";

// API Base URL - Update this with your Python Agentic AI backend URL
const API_BASE_URL = import.meta.env.VITE_AI_GAME_BACKEND_URL || "http://localhost:8000";

/**
 * Get a random mission/scenario
 * @returns {Promise<{scenario: string}>}
 */
export const createNewGame = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/mission/random`);
    return response.data;
  } catch (error) {
    console.error("Error getting random mission:", error);
    throw error;
  }
};

/**
 * Evaluate user prompts
 * @param {string} scenario - The scenario text
 * @param {string} system_role - The system prompt
 * @param {string} user_prompt - The user prompt
 * @returns {Promise<{status: string, feedback: string}>}
 */
export const evaluatePrompts = async (scenario, system_role, user_prompt) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/evaluate`, {
      scenario,
      system_role,
      user_prompt,
    });
    return response.data;
  } catch (error) {
    console.error("Error evaluating prompts:", error);
    throw error;
  }
};

/**
 * Get solution for the scenario
 * @param {string} scenario - The scenario text
 * @returns {Promise<{solution: string}>}
 */
export const getSolution = async (scenario) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/solution`, {
      scenario,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting solution:", error);
    throw error;
  }
};

// SCORE DISPLAY — API functions for points (do not modify game logic)
const NODE_API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Fetch current user's points and max points
 * @returns {Promise<{points: number, maxPoints: number}>}
 */
export const fetchPoints = async () => {
  try {
    const token = localStorage.getItem("token");
    
    // DEBUG: Log JWT being sent
    console.log("[FRONTEND] fetchPoints - JWT being sent:", token ? `${token.substring(0, 20)}...` : "NO TOKEN");
    
    if (!token) {
      console.log("[FRONTEND] fetchPoints - No token found, returning default");
      return { points: 0, maxPoints: 1000 };
    }

    const url = `${NODE_API_BASE}/api/ai-new/points`;
    console.log("[FRONTEND] fetchPoints - Calling API:", url);
    console.log("[FRONTEND] fetchPoints - Authorization header:", `Bearer ${token.substring(0, 20)}...`);
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    // DEBUG: Log raw backend response
    console.log("[FRONTEND] fetchPoints - Raw backend response:", response.data);
    console.log("[FRONTEND] fetchPoints - Parsed score:", response.data.points, "Max:", response.data.maxPoints);
    
    return response.data;
  } catch (error) {
    console.error("[FRONTEND] fetchPoints - Error:", error);
    console.error("[FRONTEND] fetchPoints - Error status:", error.response?.status);
    console.error("[FRONTEND] fetchPoints - Error response:", error.response?.data);
    console.error("[FRONTEND] fetchPoints - Error headers:", error.response?.headers);
    // Safe fallback - do NOT reset score on failure
    throw error; // Re-throw to let caller handle
  }
};

/**
 * Add 10 points for a correct answer
 * @returns {Promise<{points: number, maxPoints: number}>}
 */
export const addPoints = async () => {
  try {
    const token = localStorage.getItem("token");
    
    // DEBUG: Log JWT being sent
    console.log("[FRONTEND] addPoints - JWT being sent:", token ? `${token.substring(0, 20)}...` : "NO TOKEN");
    
    if (!token) {
      console.log("[FRONTEND] addPoints - No token found, returning default");
      return { points: 0, maxPoints: 1000 };
    }

    const url = `${NODE_API_BASE}/api/ai-new/points/add`;
    console.log("[FRONTEND] addPoints - Calling API:", url);
    console.log("[FRONTEND] addPoints - Authorization header:", `Bearer ${token.substring(0, 20)}...`);
    
    const response = await axios.post(url, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    // DEBUG: Log raw backend response
    console.log("[FRONTEND] addPoints - Raw backend response:", response.data);
    console.log("[FRONTEND] addPoints - Parsed score:", response.data.points, "Max:", response.data.maxPoints);
    
    return response.data;
  } catch (error) {
    console.error("[FRONTEND] addPoints - Error:", error);
    console.error("[FRONTEND] addPoints - Error status:", error.response?.status);
    console.error("[FRONTEND] addPoints - Error response:", error.response?.data);
    console.error("[FRONTEND] addPoints - Error headers:", error.response?.headers);
    // Re-throw to let caller handle - do NOT reset score on failure
    throw error;
  }
};



