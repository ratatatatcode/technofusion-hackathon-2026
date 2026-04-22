import express from "express";
import {
    register,
    login,
    getUser,
} from "../../controllers/auth/auth.controller.js";
import { authMiddleware } from "../../controllers/auth/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authMiddleware, getUser);

export default router;
