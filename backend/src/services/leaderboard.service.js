import { pool } from "../db/pool.js";

const BADGE_RULES = [
    {
        badge_type: "first_mission",
        threshold_type: "mission_count",
        threshold_value: 1,
    },
    {
        badge_type: "five_missions",
        threshold_type: "mission_count",
        threshold_value: 5,
    },
    {
        badge_type: "point_starter",
        threshold_type: "total_pts",
        threshold_value: 50,
    },
    {
        badge_type: "point_climber",
        threshold_type: "total_pts",
        threshold_value: 200,
    },
];

export const awardPointsAndUpdateLeaderboard = async ({
    studentId,
    missionId,
    missionPoints,
    sdgTag,
    department,
    season,
}) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        await conn.query(
            `
        INSERT INTO student_points (student_id, season, total_pts)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE total_pts = total_pts + VALUES(total_pts)
      `,
            [studentId, season, missionPoints],
        );

        const [[totals]] = await conn.query(
            `
                SELECT
                    sp.total_pts AS totalPts,
                    COUNT(DISTINCT s.mission_id) AS missionCount
                FROM student_points sp
                LEFT JOIN submissions s
                    ON s.student_id = sp.student_id
                    AND s.status = 'APPROVED'
                WHERE sp.student_id = ? AND sp.season = ?
                GROUP BY sp.total_pts
            `,
            [studentId, season],
        );

        const earnedBadges = BADGE_RULES.filter((rule) => {
            if (rule.threshold_type === "total_pts")
                return totals.totalPts >= rule.threshold_value;
            if (rule.threshold_type === "mission_count")
                return totals.missionCount >= rule.threshold_value;
            return false;
        }).map((rule) => rule.badge_type);

        if (earnedBadges.length > 0) {
            await conn.query(
                `
          INSERT IGNORE INTO badges (student_id, badge_type)
          VALUES ${earnedBadges.map(() => "(?, ?)").join(", ")}
        `,
                earnedBadges.flatMap((badge) => [studentId, badge]),
            );
        }

        await conn.commit();

        return {
            totalPts: totals.totalPts,
            missionCount: totals.missionCount,
            earnedBadges,
        };
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

export const getLeaderboard = async ({ season, department, limit = 20 }) => {
    const [rows] = await pool.query(
        `
            SELECT
                u.id AS studentId,
                u.name AS name,
                u.department,
                sp.total_pts AS totalPts,
            RANK() OVER (
                PARTITION BY sp.season
                ORDER BY sp.total_pts DESC
            ) AS overallRank,
            RANK() OVER (
                PARTITION BY sp.season, u.department
                ORDER BY sp.total_pts DESC
            ) AS deptRank
            FROM student_points sp
            JOIN users u ON u.id = sp.student_id
            WHERE sp.season = ?
                AND (? IS NULL OR u.department = ?)
            ORDER BY sp.total_pts DESC
            LIMIT ?
        `,
        [season, department ?? null, department ?? null, limit],
    );

    return rows;
};
