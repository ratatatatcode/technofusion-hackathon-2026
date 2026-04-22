import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const defaultStorageDirectory = process.env.SUBMISSION_STORAGE_DIR
    ? path.resolve(process.cwd(), process.env.SUBMISSION_STORAGE_DIR)
    : path.resolve(process.cwd(), "uploads", "submissions");

export const sanitizeFileName = (fileName) => {
    const normalizedFileName = path.basename(fileName).trim();
    const safeFileName = normalizedFileName.replace(/[^a-zA-Z0-9._-]/g, "-");

    return safeFileName || "submission.bin";
};

export const storeSubmissionFile = async ({ buffer, fileHash, fileName, missionId, studentId }) => {
    const missionDirectory = path.join(defaultStorageDirectory, `mission-${missionId}`, `student-${studentId}`);
    const sanitizedFileName = sanitizeFileName(fileName);
    const storedFileName = `${Date.now()}-${fileHash.slice(0, 12)}-${sanitizedFileName}`;
    const absoluteFilePath = path.join(missionDirectory, storedFileName);

    await mkdir(missionDirectory, { recursive: true });
    await writeFile(absoluteFilePath, buffer);

    return {
        absoluteFilePath,
        relativeFilePath: path.relative(process.cwd(), absoluteFilePath).split(path.sep).join("/"),
    };
};

export const removeStoredSubmissionFile = async (relativeFilePath) => {
    const absoluteFilePath = path.resolve(process.cwd(), relativeFilePath);
    await rm(absoluteFilePath, { force: true });
};
