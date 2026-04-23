import { pool } from "../db/pool.js";
import { generateQuestsFromProblem } from "./ai.service.js";

export const createProblemWithQuests = async ({
    userId,
    title,
    description,
}) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [probResult] = await connection.query(
            "INSERT INTO problems (user_id, title, description) VALUES (?, ?, ?)",
            [userId, title, description],
        );
        const problemId = probResult.insertId;

        const quests = await generateQuestsFromProblem(title, description);

        const questValues = quests.map((q) => [
            problemId,
            q.title,
            q.description,
            q.duration,
        ]);
        await connection.query(
            "INSERT INTO problem_quests (problem_id, title, description, duration) VALUES ?",
            [questValues],
        );

        await connection.commit();
        return { problemId, title, quests };
    } catch (error) {
        await connection.rollback();
        console.error("AI Quest Generation Failed:", error);
        throw error;
    } finally {
        connection.release();
    }
};
