import test from "node:test";
import assert from "node:assert/strict";
import { decodeSubmissionFileContent, validateSubmissionPayload } from "./src/services/submission.service.js";
import { sanitizeFileName } from "./src/services/storage.service.js";

test("decodeSubmissionFileContent decodes data URLs", () => {
    const fileBuffer = decodeSubmissionFileContent("data:text/plain;base64,SGVsbG8=");

    assert.equal(fileBuffer.toString("utf8"), "Hello");
});

test("validateSubmissionPayload accepts a well-formed submission payload", () => {
    const { errors, value } = validateSubmissionPayload({
        missionId: 7,
        studentId: 15,
        fileName: "evidence.png",
        mimeType: "image/png",
        textSummary: "Collected recyclables from the campus grounds.",
        eventCode: "HACKFEST2026",
        fileContentBase64: "aGVsbG8=",
    });

    assert.deepEqual(errors, []);
    assert.equal(value.missionId, 7);
    assert.equal(value.studentId, 15);
    assert.equal(value.textSummary, "Collected recyclables from the campus grounds.");
    assert.equal(value.fileBuffer.toString("utf8"), "hello");
});

test("validateSubmissionPayload rejects malformed submissions", () => {
    const { errors } = validateSubmissionPayload({
        missionId: 0,
        studentId: "bad",
        fileName: "",
        textSummary: "",
        fileContentBase64: "not-base64$",
    });

    assert.deepEqual(errors, [
        "missionId must be a positive integer.",
        "studentId must be a positive integer.",
        "fileName is required.",
        "textSummary is required.",
        "fileContentBase64 must be valid base64 content.",
    ]);
});

test("sanitizeFileName strips unsafe path characters", () => {
    assert.equal(sanitizeFileName("../../my proof?.pdf"), "my-proof-.pdf");
});
