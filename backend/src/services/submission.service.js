import crypto from "node:crypto";
import { pool } from "../db/pool.js";
import { createHttpError } from "./error.service.js";
import { removeStoredSubmissionFile, storeSubmissionFile } from "./storage.service.js";

export const SUBMISSION_STATUS = Object.freeze({
    PENDING: "PENDING",
});

const MAX_FILE_NAME_LENGTH = 255;
const MAX_SUMMARY_LENGTH = 1000;
const MAX_EVENT_CODE_LENGTH = 50;
const MAX_FILE_SIZE_BYTES = Number.parseInt(process.env.MAX_SUBMISSION_FILE_SIZE_BYTES ?? "10000000", 10);
const allowedMimeTypeValues = (process.env.ALLOWED_SUBMISSION_MIME_TYPES ?? "")
    .split(",")
    .map((mimeType) => mimeType.trim())
    .filter(Boolean);
const allowedMimeTypes = new Set(allowedMimeTypeValues);

const normalizeBase64Content = (fileContentBase64) => {
    if (!fileContentBase64) {
        return "";
    }

    const commaIndex = fileContentBase64.indexOf(",");
    if (fileContentBase64.startsWith("data:") && commaIndex !== -1) {
        return fileContentBase64.slice(commaIndex + 1);
    }

    return fileContentBase64;
};

export const decodeSubmissionFileContent = (fileContentBase64) => {
    const normalizedContent = normalizeBase64Content(fileContentBase64).trim();

    if (!normalizedContent) {
        throw createHttpError(400, "fileContentBase64 is required.");
    }

    if (!/^[A-Za-z0-9+/=\s]+$/.test(normalizedContent)) {
        throw createHttpError(400, "fileContentBase64 must be valid base64 content.");
    }

    const fileBuffer = Buffer.from(normalizedContent, "base64");

    if (fileBuffer.length === 0) {
        throw createHttpError(400, "Decoded file content cannot be empty.");
    }

    return fileBuffer;
};

export const validateSubmissionPayload = (payload = {}) => {
    const errors = [];
    const missionId = Number.parseInt(payload.missionId, 10);
    const studentId = Number.parseInt(payload.studentId, 10);
    const fileName = typeof payload.fileName === "string" ? payload.fileName.trim() : "";
    const mimeType = typeof payload.mimeType === "string" ? payload.mimeType.trim() : "application/octet-stream";
    const textSummary = typeof payload.textSummary === "string" ? payload.textSummary.trim() : "";
    const eventCode = typeof payload.eventCode === "string" ? payload.eventCode.trim() : "";
    let fileBuffer = null;

    if (!Number.isInteger(missionId) || missionId <= 0) {
        errors.push("missionId must be a positive integer.");
    }

    if (!Number.isInteger(studentId) || studentId <= 0) {
        errors.push("studentId must be a positive integer.");
    }

    if (!fileName) {
        errors.push("fileName is required.");
    } else if (fileName.length > MAX_FILE_NAME_LENGTH) {
        errors.push(`fileName must be ${MAX_FILE_NAME_LENGTH} characters or fewer.`);
    }

    if (!textSummary) {
        errors.push("textSummary is required.");
    } else if (textSummary.length > MAX_SUMMARY_LENGTH) {
        errors.push(`textSummary must be ${MAX_SUMMARY_LENGTH} characters or fewer.`);
    }

    if (eventCode.length > MAX_EVENT_CODE_LENGTH) {
        errors.push(`eventCode must be ${MAX_EVENT_CODE_LENGTH} characters or fewer.`);
    }

    try {
        fileBuffer = decodeSubmissionFileContent(payload.fileContentBase64);
    } catch (error) {
        errors.push(error.message);
    }

    if (fileBuffer && fileBuffer.length > MAX_FILE_SIZE_BYTES) {
        errors.push(`file size must be ${MAX_FILE_SIZE_BYTES} bytes or fewer.`);
    }

    if (allowedMimeTypes.size > 0 && !allowedMimeTypes.has(mimeType)) {
        errors.push(`mimeType must be one of: ${[...allowedMimeTypes].join(", ")}.`);
    }

    return {
        errors,
        value: {
            missionId,
            studentId,
            fileName,
            mimeType,
            textSummary,
            eventCode,
            fileBuffer,
        },
    };
};

const createFileHash = (fileBuffer) => {
    return crypto.createHash("sha256").update(fileBuffer).digest("hex");
};

export const createSubmission = async (payload) => {
    const { errors, value } = validateSubmissionPayload(payload);

    if (errors.length > 0) {
        throw createHttpError(400, "Invalid submission payload.", errors);
    }

    const [missionRows] = await pool.query(
        `
            SELECT id, is_active AS isActive
            FROM missions
            WHERE id = ?
        `,
        [value.missionId],
    );

    const mission = missionRows[0];

    if (!mission) {
        throw createHttpError(404, "Mission not found.");
    }

    if (!mission.isActive) {
        throw createHttpError(409, "Mission is not accepting submissions.");
    }

    const fileHash = createFileHash(value.fileBuffer);
    const [duplicateRows] = await pool.query(
        `
            SELECT id
            FROM submissions
            WHERE file_hash = ?
            LIMIT 1
        `,
        [fileHash],
    );

    if (duplicateRows.length > 0) {
        throw createHttpError(409, "Duplicate submission detected.", ["An identical file has already been submitted."]);
    }

    let storedFile = null;

    try {
        storedFile = await storeSubmissionFile({
            buffer: value.fileBuffer,
            fileHash,
            fileName: value.fileName,
            missionId: value.missionId,
            studentId: value.studentId,
        });

        const [result] = await pool.query(
            `
                INSERT INTO submissions (
                    mission_id,
                    student_id,
                    file_hash,
                    file_url,
                    original_file_name,
                    mime_type,
                    text_summary,
                    event_code,
                    status,
                    submitted_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `,
            [
                value.missionId,
                value.studentId,
                fileHash,
                storedFile.relativeFilePath,
                value.fileName,
                value.mimeType,
                value.textSummary,
                value.eventCode || null,
                SUBMISSION_STATUS.PENDING,
            ],
        );

        const [rows] = await pool.query(
            `
                SELECT
                    id,
                    mission_id AS missionId,
                    student_id AS studentId,
                    file_hash AS fileHash,
                    file_url AS fileUrl,
                    original_file_name AS fileName,
                    mime_type AS mimeType,
                    text_summary AS textSummary,
                    event_code AS eventCode,
                    status,
                    submitted_at AS submittedAt
                FROM submissions
                WHERE id = ?
            `,
            [result.insertId],
        );

        return rows[0];
    } catch (error) {
        if (storedFile?.relativeFilePath) {
            await removeStoredSubmissionFile(storedFile.relativeFilePath);
        }

        if (error.code === "ER_DUP_ENTRY") {
            throw createHttpError(409, "Duplicate submission detected.", ["An identical file has already been submitted."]);
        }

        throw error;
    }
};
