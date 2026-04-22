import express from "express";
import { createMissionHandler, listMissionsHandler } from "../controllers/mission.controller.js";

const router = express.Router();

router.get("/", listMissionsHandler);
router.post("/", createMissionHandler);

export default router;
