import { getLeaderboard } from "../services/leaderboard.service.js";

export const getLeaderboardHandler = async (req, res) => {
    try {
        const season =
            req.query.season ?? process.env.LEADERBOARD_SEASON ?? "2025-S1";
        const department = req.query.department ?? null;
        const limit = Number.parseInt(req.query.limit ?? "20", 10);

        const rows = await getLeaderboard({ season, department, limit });
        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("[Leaderboard error]", error);
        return sendErrorResponse(res, error, "Failed to fetch leaderboard.");
    }
};
