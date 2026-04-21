import express from "express";
import cors from "cors";
import "dotenv/config";
import sampleRoutes from "./src/routers/sample.routes.js";
import { pool } from "./src/db/pool.js";

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/sample", sampleRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});


(async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Database connected");
        connection.release();
    } catch(error) {
        console.error("Database connection failed:", error);
    }
})();