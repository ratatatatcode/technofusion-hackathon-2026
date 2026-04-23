import { verifySubmission } from "../services/verification.service.js";
import { sendErrorResponse } from "../services/error.service.js";

export const verifySubmissionHandler = async (req, res) => {
    try {
        const result = await verifySubmission({
            submissionId: Number.parseInt(req.params.id, 10),
            verifierId: req.user.id,
            action: req.body.action,
            rejectReason: req.body.rejectReason,
        });
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("[Verification error]", error);
        return sendErrorResponse(res, error, "Failed to verify submission.");
    }
};