import { getWallFeed, getSdgHeatMap } from "../services/wall.service.js";
import { sendErrorResponse } from "../services/error.service.js";

export const getWallFeedHandler = async (req, res) => {
    try {
        const limit = Math.min(
            Number.parseInt(req.query.limit ?? "10", 10),
            50,
        );
        const feed = await getWallFeed({ limit });

        return res.status(200).json({ success: true, data: feed });
    } catch (error) {
        console.error("[Wall feed error]", error);
        return sendErrorResponse(res, error, "Failed to fetch wall feed.");
    }
};

export const getSdgHeatMapHandler = async (req, res) => {
    try {
        const heatMap = await getSdgHeatMap();

        return res.status(200).json({ success: true, data: heatMap });
    } catch (error) {
        console.error("[SDG heat map error]", error);
        return sendErrorResponse(res, error, "Failed to fetch SDG heat map.");
    }
};
