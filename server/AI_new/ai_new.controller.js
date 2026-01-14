/**
 * AI New Controller
 * Handles HTTP requests for Prompt Creator Game points system
 */

import { getUserPoints, addPointsToUser, isPromptMaster } from "./points.service.js";

// SCORE DISPLAY — Configuration for max points (do not modify game logic)
const MAX_POINTS = 1000; // Prompt Master unlock threshold

/**
 * GET /api/ai-new/points
 * Returns current user's prompt game points and max points
 */
export const getPoints = async (req, res) => {
  try {
    const userId = req.user.id;

    // DEBUG: Log user ID
    console.log("[AI_NEW] GET /points - User ID:", userId);

    const points = await getUserPoints(userId);

    // DEBUG: Log value from DB and API response
    console.log("[AI_NEW] GET /points - Value from DB:", points);
    const response = { points, maxPoints: MAX_POINTS };
    console.log("[AI_NEW] GET /points - API response:", JSON.stringify(response));

    res.json(response);
  } catch (error) {
    console.error("[AI_NEW] Error in getPoints:", error);
    res.status(500).json({ 
      error: "Failed to fetch points",
      message: process.env.NODE_ENV === "production" ? null : error.message 
    });
  }
};

/**
 * POST /api/ai-new/points/add
 * Adds 10 points for a correct answer
 * Returns updated points total
 */
export const addPoints = async (req, res) => {
  try {
    const userId = req.user.id;

    // DEBUG: Log user ID
    console.log("[AI_NEW] POST /points/add - User ID:", userId);

    const updatedPoints = await addPointsToUser(userId);

    // DEBUG: Log updated points and API response
    console.log("[AI_NEW] POST /points/add - Updated points:", updatedPoints);
    const response = { points: updatedPoints, maxPoints: MAX_POINTS };
    console.log("[AI_NEW] POST /points/add - API response:", JSON.stringify(response));

    res.json(response);
  } catch (error) {
    console.error("[AI_NEW] Error in addPoints:", error);
    res.status(500).json({ 
      error: "Failed to add points",
      message: process.env.NODE_ENV === "production" ? null : error.message 
    });
  }
};

/**
 * GET /api/ai-new/prompt-master
 * Returns whether user has achieved Prompt Master status (≥ 1000 points)
 */
export const getPromptMasterStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    // TEMPORARY DEBUG LOG
    console.log("[AI_NEW] GET /prompt-master - User ID:", userId);

    const masterStatus = await isPromptMaster(userId);

    // TEMPORARY DEBUG LOG
    console.log("[AI_NEW] GET /prompt-master - Status:", masterStatus);

    res.json({ isPromptMaster: masterStatus });
  } catch (error) {
    console.error("[AI_NEW] Error in getPromptMasterStatus:", error);
    res.status(500).json({ 
      error: "Failed to check prompt master status",
      message: process.env.NODE_ENV === "production" ? null : error.message 
    });
  }
};
