import { createMission, listMissions } from "../services/mission.service.js";
import { sendErrorResponse } from "../services/error.service.js";

export const createMissionHandler = async (req, res) => {
    try {
        const mission = await createMission(req.body);

        return res.status(201).json({
            success: true,
            message: "Mission created successfully.",
            data: mission,
        });
    } catch (error) {
        console.error("[Mission creation error]", error);
        return sendErrorResponse(res, error, "Failed to create mission.");
    }
};

export const listMissionsHandler = async (req, res) => {
    try {
        const missions = await listMissions(req.query);

        return res.status(200).json({
            success: true,
            message: "Mission feed fetched successfully.",
            data: missions,
        });
    } catch (error) {
        console.error("[Mission feed error]", error);
        return sendErrorResponse(res, error, "Failed to fetch mission feed.");
    }
};
