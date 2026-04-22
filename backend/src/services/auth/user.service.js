import { pool } from "../../db/pool.js";

export const findUserByEmail = async (email) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
        email,
    ]);
    return rows[0] || null;
};

export const findUserById = async (id) => {
    const [rows] = await pool.query(
        "SELECT id, name, email, role, department, created_at FROM users WHERE id = ?",
        [id],
    );
    return rows[0] || null;
};

export const createUser = async ({
    id,
    name,
    email,
    password,
    role,
    department,
}) => {
    const [result] = await pool.query(
        "INSERT INTO users (id, name, email, password, role, department) VALUES (?, ?, ?, ?, ?, ?)",
        [id, name, email, password, role || "student", department || null],
    );
    return result.insertId;
};
