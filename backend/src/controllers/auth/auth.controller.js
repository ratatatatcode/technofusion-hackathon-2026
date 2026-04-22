import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
    findUserByEmail,
    findUserById,
    createUser,
} from "../../services/auth/user.service.js";

const SALT_ROUNDS = 10;

export const register = async (req, res) => {
    try {
        const { id, name, email, password, role, department } = req.body;

        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: "Name, email, and password are required." });
        }

        const allowedRoles = ["student", "admin"];
        if (role && !allowedRoles.includes(role)) {
            return res
                .status(400)
                .json({ message: "Invalid role. Must be student or admin." });
        }

        const existing = await findUserByEmail(email);
        if (existing) {
            return res
                .status(409)
                .json({ message: "Email is already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const userId = await createUser({
            id,
            name,
            email,
            password: hashedPassword,
            role,
            department,
        });

        return res
            .status(201)
            .json({ message: "Registration successful.", userId });
    } catch (err) {
        console.error("[register]", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required." });
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
        );

        return res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
            },
        });
    } catch (err) {
        console.error("[login]", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await findUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        return res.status(200).json({ user });
    } catch (err) {
        console.error("[getUser]", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};
