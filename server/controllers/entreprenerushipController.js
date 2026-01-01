import prisma from "../utils/prisma.js";

export const markChallengeComplete = async (req, res) => {
  const { moduleIndex, challengeIndex } = req.body;
  const userId = req.user.id;

  // Always use "6-9" for new challenge records (class-based restrictions removed)
  const userClass = "6-9";
 
  try {
    const progress = await prisma.entrepreneurshipChallenge.upsert({
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

    res.json({ success: true, progress });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, error: "Failed to update progress" });
  }
};

export const getUserProgress = async (req, res) => {
  const userId = req.user.id;

  try {
    const progress = await prisma.entrepreneurshipChallenge.findMany({
      where: { userId, completed: true },
    });

    res.json({ success: true, progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch progress" });
  }
};
