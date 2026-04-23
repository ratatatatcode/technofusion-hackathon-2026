import express from "express";
import { authMiddleware } from "../controllers/auth/auth.middleware.js";
import { roleMiddleware } from "../controllers/auth/role.middleware.js";
import { verifySubmissionHandler } from "../controllers/verification.controller.js";
import { getLeaderboardHandler } from "../controllers/leaderboard.controller.js";

const router = express.Router();

router.patch(
    "/submissions/:id/verify",
    authMiddleware,
    roleMiddleware(["ADMIN"]),
    verifySubmissionHandler,
);
router.get("/leaderboard", getLeaderboardHandler);

export default router;
