import axios from "axios";

// API Base URL - Update this with your Python Agentic AI backend URL
const API_BASE_URL = import.meta.env.VITE_AI_GAME_BACKEND_URL || "http://localhost:8000";

/**
 * Create a new game and get scenario
 * @returns {Promise<{seed: string, scenario: string}>}
 */
export const createNewGame = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/new-game`);
    return response.data;
  } catch (error) {
    console.error("Error creating new game:", error);
    throw error;
  }
};

/**
 * Evaluate user prompts
 * @param {string} scenario - The scenario text
 * @param {string} system_input - The system prompt
 * @param {string} user_input - The user prompt
 * @returns {Promise<{result: "correct" | "incorrect", feedback: string}>}
 */
export const evaluatePrompts = async (scenario, system_input, user_input) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/evaluate`, {
      scenario,
      system_input,
      user_input,
    });
    return response.data;
  } catch (error) {
    console.error("Error evaluating prompts:", error);
    throw error;
  }
};

/**
 * Get hint for the current attempt
 * @param {string} scenario - The scenario text
 * @param {string} system_input - The system prompt
 * @param {string} user_input - The user prompt
 * @param {number} attempt_number - 1-based attempt number
 * @returns {Promise<{solution_text: string}>}
 */
export const getHint = async (scenario, system_input, user_input, attempt_number) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/hint`, {
      scenario,
      system_input,
      user_input,
      attempt_number,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting hint:", error);
    throw error;
  }
};

/**
 * Get solution for the scenario
 * @param {string} scenario - The scenario text
 * @returns {Promise<{solution_text: string}>}
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


