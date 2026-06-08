import mysql from "mysql2";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

const envPath = fileURLToPath(new URL(".env", import.meta.url));

dotenv.config({ path: envPath });

const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
const missingEnvVars = requiredEnvVars.filter((name) => !process.env[name]);

if (missingEnvVars.length > 0) {
  console.error(`Missing database environment variables: ${missingEnvVars.join(", ")}`);
}

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

if (process.env.DB_PORT) {
  dbConfig.port = Number(process.env.DB_PORT);
}

if (process.env.DB_SSL === "true") {
  dbConfig.ssl = {
    rejectUnauthorized: false,
  };
}

export const db = mysql.createPool(dbConfig);

db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    return;
  }

  connection.release();
  console.log("Connected to MySQL.");
});
