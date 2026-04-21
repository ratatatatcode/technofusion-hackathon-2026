import express from "express";
import cors from "cors";
import "dotenv/config";
import sampleRoutes from "./src/routers/sample.routes.js";
import missionRoutes from "./src/routers/mission.routes.js";
import submissionRoutes from "./src/routers/submission.routes.js";

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use(express.json({ limit: process.env.REQUEST_BODY_LIMIT ?? "12mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/sample", sampleRoutes);
app.use("/missions", missionRoutes);
app.use("/submissions", submissionRoutes);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
