import { createSample, readSampleById } from "../services/sample.service.js";

// Follow CRUD: POST, GET, PUT, DELETE
export const sampleSqlCreate = async (req, res) => {
    const { message } = req.body;

    try {
        await createSample(message);

        return res.status(201).json({ success: true, message: "Created successfully." });
    } catch (err) {
        console.error(`[Create error] ${err}`);
        return res.status(500).json({ success: false, message: "Failed to create." });
    }
}

export const sampleSqlRead = async (req, res) => {
    const { id } = req.params;

    try {
        const data = await readSampleById(id);

        if (!data) {
            return res.status(404).json({ success: false, message: "Message not found." })
        }

        return res.status(209).json({ success: true, message: "Found successfully.", data });
    } catch (err) {
        console.error(`[Read error] ${err}`);
        return res.status(500).json({ success: false, message: "Failed to read." });
    }
}