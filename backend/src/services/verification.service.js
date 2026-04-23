import { pool } from "../db/pool.js";
import { createHttpError } from "./error.service.js";
import { awardPointsAndUpdateLeaderboard } from "./leaderboard.service.js";

export const verifyAction = Object.freeze({
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
})

const CURRENT_SEASON = process.env.LEADERBOARD_SEASON ?? "2025-S1";

export const verifySubmission = async ({ submissionId, verifierId, action, rejectReason }) => {
    if (!Object.values(verifyAction).includes(action)) {
        throw createHttpError(400, "action must be APPROVED or REJECTED.");
    }

    if (action === VERIFY_ACTION.REJECTED && !rejectReason?.trim()) {
        throw createHttpError(400, "rejectReason is required when rejecting.");
    }

    // fetch submission + mission points
    const [rows] = await pool.query(
        `
            SELECT
                s.id,
                s.status,
                s.student_id AS studentId,
                s.mission_id AS missionId,
                m.points AS missionPoints,
                m.sdg_tag AS sdgTag,
                u.department AS department
            FROM submissions s
            JOIN missions m ON m.id = s.mission_id
            JOIN users u ON u.id = s.student_id
            WHERE s.id = ?
            LIMIT 1
        `,
        [submissionId]
    );

    const submission = rows[0];

    if (!submission) {
        throw createHttpError(404, "Submission not found.");
    }

    if (submission.status !== "PENDING") {
      throw createHttpError(409, "Submission has already been verified.");
    }

    // Update submission status
    await pool.query(
        `
          UPDATE submissions
          SET
            status = ?,
            reject_reason = ?,
            verified_by = ?,
            verified_at = NOW()
          WHERE id = ?
        `,
        [action, rejectReason?.trim() ?? null, verifierId, submissionId],
    );

    if (action === VERIFY_ACTION.APPROVED) {
        await awardPointsAndUpdateLeaderboard({
            studentId: submission.studentId,
            missionId: submission.missionId,
            missionPoints: submission.missionPoints,
            sdgTag: submission.sdgTag,
            department: submission.department,
            season: CURRENT_SEASON,
        });
    }

    return { submissionId, action };

}