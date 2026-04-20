import express from "express";
import { sampleSqlCreate, sampleSqlRead } from "../controllers/sample.controller.js";

const router = express.Router();

// Follow CRUD: POST, GET, PUT, DELETE
router.post("/create", sampleSqlCreate);
router.get("/read/:id", sampleSqlRead);

export default router;