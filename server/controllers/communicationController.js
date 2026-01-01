import prisma from "../utils/prisma.js";
import connectionManager from "../connectionManager.js";

export const markChallengeComplete = async (req, res) => {
  const { moduleIndex, challengeIndex } = req.body;
  const userId = req.user.id;

   if (moduleIndex === undefined || challengeIndex === undefined) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  // Always use "6-9" for new challenge records (class-based restrictions removed)
  const userClass = "6-9";
  
  try {
    const progress = await connectionManager.safeQuery(async () => {
      return await prisma.communicationChallenge.upsert({
        where: {
           userId_userClass_moduleIndex_challengeIndex: {
            userId,
            userClass,
            moduleIndex,
            challengeIndex,
          },
        },
        update: {
          completed: true,
          completedAt: new Date(),
        },
        create: {
          userId,
          userClass,
          moduleIndex,
          challengeIndex,
          completed: true,
          completedAt: new Date(),
        },
      });
    });

    res.json({ success: true, progress });
  } catch (err) {
    console.error("Communication challenge error:", err);
    
    // Handle specific database connection errors
    if (err.message?.includes('temporarily unavailable')) {
      return res.status(503).json({ 
        success: false, 
        error: "Database temporarily unavailable. Please try again." 
      });
    }
    
    res.status(500).json({ success: false, error: "Failed to update progress" });
  }
};
 
export const getUserProgress = async (req, res) => {
  const userId = req.user.id;

  try {
    const progress = await connectionManager.safeQuery(async () => {
      return await prisma.communicationChallenge.findMany({
        where: { userId, completed: true },
      });
    });

    res.json({ success: true, progress });
  } catch (err) {
    console.error("Get progress error:", err);
    
    // Handle specific database connection errors
    if (err.message?.includes('temporarily unavailable')) {
      return res.status(503).json({ 
        success: false, 
        error: "Database temporarily unavailable. Please try again." 
      });
    }
    
    res.status(500).json({ success: false, error: "Failed to fetch progress" });
  }
};
