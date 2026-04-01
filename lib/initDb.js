import mysql from "mysql2/promise";
import { query } from "./db.js";

let initialized = false;

export async function initDb() {
  if (initialized) return;

  // Step 1: Connect WITHOUT specifying a database to ensure GenAIAssests exists
  let bootstrap;
  try {
    bootstrap = await mysql.createConnection({
      host: "127.0.0.1",
      port: 3306,
      user: "root",
      password: "pushkarkumar",
    });
    await bootstrap.execute("CREATE DATABASE IF NOT EXISTS `GenAIAssests`");
  } finally {
    if (bootstrap) await bootstrap.end();
  }

  // Step 2: Create tables using the normal pool (DB now guaranteed to exist)
  await query(`
    CREATE TABLE IF NOT EXISTS generated_images (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      prompt      TEXT        NOT NULL,
      image_url   TEXT        NOT NULL,
      resolution  VARCHAR(20) DEFAULT NULL,
      created_at  DATETIME    DEFAULT CURRENT_TIMESTAMP,
      deleted_at  DATETIME    DEFAULT NULL
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS generated_videos (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      prompt      TEXT     NOT NULL,
      video_url   TEXT     NOT NULL,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted_at  DATETIME DEFAULT NULL
    )
  `);

  initialized = true;
  console.log("[initDb] Database and tables ready.");
}
