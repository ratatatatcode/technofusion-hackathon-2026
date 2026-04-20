import { pool } from "../db/pool.js";

// Follow CRUD: POST, GET, PUT, DELETE
export const createSample = async (message) => {
    const [result] = await pool.query(`INSERT INTO sample (message) VALUES (?)`, [message]);
    
    return result;
}

export const readSampleById = async (id) => {
    const [rows] = await pool.query(`SELECT * FROM sample WHERE id = ?`, [id]);

    return rows[0] || null;
}

/* 
INSERT [result] =
{
    fieldCount: 0,
    affectedRows: 1,
    insertId: _,
    warningStatus: 0
}
    
UPDATE [result] =
{
  affectedRows: 1,
  changedRows: 1
}

DELETE [result] =
{
  affectedRows: 1
}
*/
