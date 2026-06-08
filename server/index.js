import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { db } from "./db.js";

const envPath = fileURLToPath(new URL(".env", import.meta.url));

dotenv.config({ path: envPath });

const app = express();

app.use(cors());
app.use(express.json());

const handleDbError = (res, err) => {
  console.error("Database query failed:", err.message);
  return res.status(500).json({
    error: "Database query failed",
    message: err.message,
  });
};

app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API Express + MySQL !");
});

app.get("/health", (req, res) => {
  db.query("SELECT 1 AS ok", (err) => {
    if (err) return handleDbError(res, err);
    return res.json({ status: "ok", database: "connected" });
  });
});

app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";

  db.query(sql, (err, data) => {
    if (err) return handleDbError(res, err);
    return res.json(data);
  });
});

app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const sql = "INSERT INTO users (name, email) VALUES (?, ?)";

  db.query(sql, [name, email], (err) => {
    if (err) return handleDbError(res, err);
    return res.json({ message: "Utilisateur ajoute avec succes !" });
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
