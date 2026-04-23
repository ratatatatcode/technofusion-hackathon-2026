import express from "express";
import cors from "cors";
import "dotenv/config";
import { pool } from "./src/db/pool.js";

import authRouter from "./src/routers/auth/auth.routes.js";
import missionRouter from "./src/routers/mission.routes.js";
import submissionRouter from "./src/routers/submission.routes.js";
import verifyRouter from "./src/routers/verification.route.js";
import problemRouter from "./src/routers/problem.routes.js";
import wallRouter from "./src/routers/wall.routes.js";

const app = express();
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }),
);

// add limit for submission test
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/mission", missionRouter);
app.use("/api/submission", submissionRouter);
app.use("/api/verify", verifyRouter);
app.use("/api/problems", problemRouter);
app.use("/api/wall", wallRouter);

app.get("/", (req, res) =>
    res.status(404).json({ message: "Route not found" }),
);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

(async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Database connected");
        connection.release();
    } catch (error) {
        console.error("Database connection failed:", error);
    }
})();
