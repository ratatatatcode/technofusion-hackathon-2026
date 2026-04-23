import express from "express";
import { createProblemHandler } from "../controllers/problem.controller.js";
import { authMiddleware } from "../controllers/auth/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createProblemHandler);

export default router;
