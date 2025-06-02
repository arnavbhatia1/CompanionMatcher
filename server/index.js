import express from "express";
import cors from "cors";
import dogs from "./data/dogs.json" assert { type: "json" };
import { scoreMatches } from "./utils/matcher.js";

const PORT = process.env.PORT || 4000;
const app  = express();
app.use(cors());
app.use(express.json());

// Health‑check
app.get("/api/health", (_, res) => res.json({ status: "OK" }));

// POST /api/match  { traits: { breed, size, color, age, temperament } }
app.post("/api/match", (req, res) => {
  const { traits } = req.body;
  if (!traits) return res.status(400).json({ error: "traits object required" });
  const matches = scoreMatches(traits, dogs);
  res.json(matches.slice(0, 10)); // top 10
});

app.listen(PORT, () => console.log(`🐾 API running on :${PORT}`));