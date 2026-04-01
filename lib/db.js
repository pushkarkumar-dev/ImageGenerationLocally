import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "pushkarkumar",
  database: "GenAIAssests",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Run a parameterized query against the pool.
 * @param {string} sql
 * @param {any[]} params
 * @returns {Promise<any[]>}
 */
export async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

export default pool;
