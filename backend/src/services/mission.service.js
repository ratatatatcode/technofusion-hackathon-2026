import { pool } from "../db/pool.js";
import { invalidateMissionFeedCache } from "./feed-cache.service.js";
import { createHttpError } from "./error.service.js";

const MAX_TITLE_LENGTH = 150;
const MAX_CATEGORY_TIER_LENGTH = 50;
const MAX_DEPARTMENT_LENGTH = 100;
const MAX_DURATION_LENGTH = 60;
const MAX_SDG_TAG_LENGTH = 30;
const MAX_GOAL_LENGTH = 1000;
const MAX_EVIDENCE_REQUIREMENTS_LENGTH = 1000;

export const validateMissionPayload = (payload = {}) => {
    const errors = [];
    const title = typeof payload.title === "string" ? payload.title.trim() : "";
    const categoryTier = typeof payload.categoryTier === "string" ? payload.categoryTier.trim() : "";
    const department = typeof payload.department === "string" ? payload.department.trim() : "";
    const goal = typeof payload.goal === "string" ? payload.goal.trim() : "";
    const duration = typeof payload.duration === "string" ? payload.duration.trim() : "";
    const sdgTag = typeof payload.sdgTag === "string" ? payload.sdgTag.trim() : "";
    const evidenceRequirements = typeof payload.evidenceRequirements === "string" ? payload.evidenceRequirements.trim() : "";
    const points = Number.parseInt(payload.points, 10);
    const createdBy = Number.parseInt(payload.createdBy, 10);

    if (!title) {
        errors.push("title is required.");
    } else if (title.length > MAX_TITLE_LENGTH) {
        errors.push(`title must be ${MAX_TITLE_LENGTH} characters or fewer.`);
    }

    if (!categoryTier) {
        errors.push("categoryTier is required.");
    } else if (categoryTier.length > MAX_CATEGORY_TIER_LENGTH) {
        errors.push(`categoryTier must be ${MAX_CATEGORY_TIER_LENGTH} characters or fewer.`);
    }

    if (!department) {
        errors.push("department is required.");
    } else if (department.length > MAX_DEPARTMENT_LENGTH) {
        errors.push(`department must be ${MAX_DEPARTMENT_LENGTH} characters or fewer.`);
    }

    if (!goal) {
        errors.push("goal is required.");
    } else if (goal.length > MAX_GOAL_LENGTH) {
        errors.push(`goal must be ${MAX_GOAL_LENGTH} characters or fewer.`);
    }

    if (!duration) {
        errors.push("duration is required.");
    } else if (duration.length > MAX_DURATION_LENGTH) {
        errors.push(`duration must be ${MAX_DURATION_LENGTH} characters or fewer.`);
    }

    if (!sdgTag) {
        errors.push("sdgTag is required.");
    } else if (sdgTag.length > MAX_SDG_TAG_LENGTH) {
        errors.push(`sdgTag must be ${MAX_SDG_TAG_LENGTH} characters or fewer.`);
    }

    if (!evidenceRequirements) {
        errors.push("evidenceRequirements is required.");
    } else if (evidenceRequirements.length > MAX_EVIDENCE_REQUIREMENTS_LENGTH) {
        errors.push(`evidenceRequirements must be ${MAX_EVIDENCE_REQUIREMENTS_LENGTH} characters or fewer.`);
    }

    if (!Number.isInteger(points) || points <= 0) {
        errors.push("points must be a positive integer.");
    }

    if (!Number.isInteger(createdBy) || createdBy <= 0) {
        errors.push("createdBy must be a positive integer.");
    }

    return {
        errors,
        value: {
            title,
            categoryTier,
            department,
            goal,
            duration,
            sdgTag,
            points,
            evidenceRequirements,
            createdBy,
        },
    };
};

export const createMission = async (payload) => {
    const { errors, value } = validateMissionPayload(payload);

    if (errors.length > 0) {
        throw createHttpError(400, "Invalid mission payload.", errors);
    }

    const [result] = await pool.query(
        `
            INSERT INTO missions (
                title,
                category_tier,
                department,
                goal,
                duration,
                sdg_tag,
                points,
                evidence_requirements,
                created_by,
                is_active,
                created_at,
                updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
        `,
        [
            value.title,
            value.categoryTier,
            value.department,
            value.goal,
            value.duration,
            value.sdgTag,
            value.points,
            value.evidenceRequirements,
            value.createdBy,
        ],
    );

    const [rows] = await pool.query(
        `
            SELECT
                id,
                title,
                category_tier AS categoryTier,
                department,
                goal,
                duration,
                sdg_tag AS sdgTag,
                points,
                evidence_requirements AS evidenceRequirements,
                created_by AS createdBy,
                is_active AS isActive,
                created_at AS createdAt,
                updated_at AS updatedAt
            FROM missions
            WHERE id = ?
        `,
        [result.insertId],
    );

    const cacheState = invalidateMissionFeedCache();

    return {
        ...rows[0],
        feedCacheInvalidatedAt: cacheState.invalidatedAt,
    };
};

export const listMissions = async (filters = {}) => {
    const conditions = ["is_active = 1"];
    const values = [];

    if (filters.department) {
        conditions.push("department = ?");
        values.push(filters.department.trim());
    }

    if (filters.categoryTier) {
        conditions.push("category_tier = ?");
        values.push(filters.categoryTier.trim());
    }

    if (filters.sdgTag) {
        conditions.push("sdg_tag = ?");
        values.push(filters.sdgTag.trim());
    }

    const [rows] = await pool.query(
        `
            SELECT
                id,
                title,
                category_tier AS categoryTier,
                department,
                goal,
                duration,
                sdg_tag AS sdgTag,
                points,
                evidence_requirements AS evidenceRequirements,
                created_at AS createdAt,
                updated_at AS updatedAt
            FROM missions
            WHERE ${conditions.join(" AND ")}
            ORDER BY created_at DESC, id DESC
        `,
        values,
    );

    return rows;
};
