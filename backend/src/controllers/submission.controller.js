import { createSubmission } from "../services/submission.service.js";
import { sendErrorResponse } from "../services/error.service.js";

export const createSubmissionHandler = async (req, res) => {
    try {
        const submission = await createSubmission(req.body);

        return res.status(201).json({
            success: true,
            message: "Submission created successfully.",
            data: submission,
        });
    } catch (error) {
        console.error("[Submission creation error]", error);
        return sendErrorResponse(res, error, "Failed to create submission.");
    }
};
