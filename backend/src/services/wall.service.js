import { pool } from "../db/pool.js";

export const getWallFeed = async ({ limit = 10 } = {}) => {
    const [rows] = await pool.query(
        `
            SELECT
                s.id AS submissionId,
                u.name AS studentName,
                u.department,
                m.title AS missionTitle,
                m.sdg_tag AS sdgTag,
                m.points,
                s.submitted_at AS submittedAt
            FROM submissions s
            JOIN users u ON u.id = s.student_id
            JOIN missions m ON m.id = s.mission_id
            WHERE s.status = 'APPROVED'
            ORDER BY s.submitted_at DESC
            LIMIT ?
        `,
        [limit],
    );

    return rows;
};

export const getSdgHeatMap = async () => {
    const [rows] = await pool.query(
        `
            SELECT
                m.sdg_tag AS sdgTag,
                COUNT(s.id) AS completionCount
            FROM submissions s
            JOIN missions m ON m.id = s.mission_id
            WHERE s.status = 'APPROVED'
            GROUP BY m.sdg_tag
            ORDER BY completionCount DESC
        `,
    );

    return rows;
};
