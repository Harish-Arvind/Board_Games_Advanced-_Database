require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/database");
const BoardGame = require("./models/BoardGame");

const app = express();
app.use(cors());
app.use(express.json());

db.authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ DB connection error:", err));

app.get("/", (req, res) => {
  res.send("Board Game App API Running");
});

app.get("/api/games", async (req, res) => {
  try {
    const games = await BoardGame.findAll({
      attributes: ['name', 'image_url', 'description', 'rating', 'min_players', 'max_players']
    });
    res.json(games);
  } catch (error) {
    console.error("❌ Error fetching games:", error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
