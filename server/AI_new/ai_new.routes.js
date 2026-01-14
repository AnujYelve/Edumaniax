/**
 * AI New Routes
 * Routes for Prompt Creator Game points system
 */

import { Router } from "express";
import authenticateUser from "../middlewares/authMiddleware.js";
import {
  getPoints,
  addPoints,
  getPromptMasterStatus,
} from "./ai_new.controller.js";

const router = Router();

// GET /api/ai-new/points - Get current user's points
router.get("/points", authenticateUser, getPoints);

// POST /api/ai-new/points/add - Add 10 points for correct answer
router.post("/points/add", authenticateUser, addPoints);

// GET /api/ai-new/prompt-master - Check if user is Prompt Master
router.get("/prompt-master", authenticateUser, getPromptMasterStatus);

export default router;
