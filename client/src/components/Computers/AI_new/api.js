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



