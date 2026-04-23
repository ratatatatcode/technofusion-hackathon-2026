import { pool } from "../db/pool.js";
import { redis } from "../db/redis.js";

export const getSDGHeatmap = async () => {
    const CACHE_KEY = "wall:sdg_heatmap";

    try {
        const cachedData = await redis.get(CACHE_KEY);
        if (cachedData) return JSON.parse(cachedData);

        const [rows] = await pool.query(`
            SELECT m.sdg_tag AS sdg, COUNT(s.id) AS count
            FROM submissions s
            JOIN missions m ON s.mission_id = m.id
            WHERE s.status = 'APPROVED'
            GROUP BY m.sdg_tag
        `);

        await redis.setEx(CACHE_KEY, 60, JSON.stringify(rows));
        
        return rows;
    } catch (error) {
        console.error("Heatmap Service Error:", error);
        throw error;
    }
};