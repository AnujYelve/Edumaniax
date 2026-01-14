// middleware/authMiddleware.js

import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";

const authenticateUser = async (req, res, next) => {
  // DEBUG: Log incoming headers
  console.log("[BACKEND] Auth middleware - Incoming headers:", {
    authorization: req.headers.authorization ? `${req.headers.authorization.substring(0, 30)}...` : "MISSING",
    "content-type": req.headers["content-type"],
  });
  
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("[BACKEND] Auth middleware - Missing or malformed auth header");
    return res
      .status(401)
      .json({ message: "Authorization token missing or malformed" });
  }

  const token = authHeader.split(" ")[1];
  console.log("[BACKEND] Auth middleware - Token extracted:", token ? `${token.substring(0, 20)}...` : "MISSING");

  try {
    const decoded = jwt.verify(token, process.env.Jwt_sec);
    console.log("[BACKEND] Auth middleware - Token decoded successfully, user ID:", decoded.id);

    // Check if this is an admin token (virtual user)
    if (decoded.role === 'ADMIN' && decoded.username) {
      // Create virtual admin user object
      req.user = {
        id: decoded.id,
        name: "Administrator",
        role: "ADMIN",
        email: "admin@edumaniax.com",
        phonenumber: "agility",
        username: decoded.username
      };
      next();
      return;
    }

    // For regular users, check database
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      console.log("[BACKEND] Auth middleware - User not found in DB for ID:", decoded.id);
      return res
        .status(401)
        .json({ message: "Invalid token - user not found" });
    }

    console.log("[BACKEND] Auth middleware - User authenticated successfully:", user.id);
    req.user = user;
    next();
  } catch (err) {
    console.error("[BACKEND] Auth middleware - JWT authentication error:", err.message);
    console.error("[BACKEND] Auth middleware - Error details:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authenticateUser;
