import express from "express";
import { createSubmissionHandler } from "../controllers/submission.controller.js";

const router = express.Router();

router.post("/", createSubmissionHandler);

export default router;
