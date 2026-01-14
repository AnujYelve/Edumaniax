/**
 * Points Service for Prompt Creator Game
 * Handles all points-related database operations
 */

import { prisma } from "../utils/prisma.js";

/**
 * Get current user's prompt game points
 * @param {string} userId - User ID
 * @returns {Promise<number>} Current points
 */
export const getUserPoints = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { promptGamePoints: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Return points, defaulting to 0 if null (backward compatibility)
    const points = user.promptGamePoints ?? 0;
    
    // DEBUG: Log value coming from DB
    console.log(`[POINTS_SERVICE] getUserPoints - User ID: ${userId}, Value from DB: ${user.promptGamePoints}, Returning: ${points}`);
    
    return points;
  } catch (error) {
    console.error("[POINTS_SERVICE] Error getting user points:", error);
    throw error;
  }
};

/**
 * Add 10 points to user's prompt game points
 * @param {string} userId - User ID
 * @returns {Promise<number>} Updated points total
 */
export const addPointsToUser = async (userId) => {
  try {
    // DEBUG: Log user ID
    console.log(`[POINTS_SERVICE] addPointsToUser - User ID: ${userId}`);
    
    // Get current points first
    const currentPoints = await getUserPoints(userId);
    
    // DEBUG: Log previous score
    console.log(`[POINTS_SERVICE] addPointsToUser - Previous score: ${currentPoints}`);

    // Calculate new points
    const newPoints = currentPoints + 10;
    
    // DEBUG: Log calculated new score
    console.log(`[POINTS_SERVICE] addPointsToUser - Calculated new score: ${newPoints}`);

    // Update user's points in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { promptGamePoints: newPoints },
      select: { promptGamePoints: true },
    });

    // DEBUG: Log new score after DB update
    console.log(`[POINTS_SERVICE] addPointsToUser - New score after DB update: ${updatedUser.promptGamePoints}`);
    console.log(`[POINTS_SERVICE] addPointsToUser - Score saved in DB: ${updatedUser.promptGamePoints}`);

    return updatedUser.promptGamePoints;
  } catch (error) {
    console.error("[POINTS_SERVICE] Error adding points:", error);
    throw error;
  }
};

/**
 * Check if user is Prompt Master (≥ 1000 points)
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} True if user is Prompt Master
 */
export const isPromptMaster = async (userId) => {
  try {
    const points = await getUserPoints(userId);
    return points >= 1000;
  } catch (error) {
    console.error("[POINTS_SERVICE] Error checking prompt master status:", error);
    return false;
  }
};
