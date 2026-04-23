import { createProblemWithQuests } from "../services/problem.service.js";
import { sendErrorResponse } from "../services/error.service.js";

export const createProblemHandler = async (req, res) => {
    try {
        const { title, description } = req.body;
        const result = await createProblemWithQuests({
            userId: req.user.id,
            title,
            description,
        });

        return res.status(201).json({
            success: true,
            message: "Problem posted and AI quests generated.",
            data: result,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
            stack: error.stack,
        });
    }
};
