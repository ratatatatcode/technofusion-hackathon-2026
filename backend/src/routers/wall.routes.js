import { Router } from "express";
import { getWallFeedHandler, getSdgHeatMapHandler } from "../controllers/wall.controller.js";

const router = Router();

router.get("/feed", getWallFeedHandler);
router.get("/sdg-heat", getSdgHeatMapHandler);

export default router;