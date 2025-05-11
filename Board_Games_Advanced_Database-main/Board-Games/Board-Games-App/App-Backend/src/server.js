

require("dotenv").config();
console.log("DB_USER =", process.env.DB_USER);

const BoardGame = require('./models/BoardGame');
console.log('>>> Modèle BoardGame chargé :', BoardGame === undefined ? 'NON' : 'OUI');

const express = require("express");
const cors = require("cors");
const db = require("./config/database");

const app = express();
app.use(cors());
app.use(express.json());

// Test DB connection
db.authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error: " + err));

// ✅ Route test
app.get("/", (req, res) => {
  res.send("Board Game App API Running");
});



app.get('/api/games', async (req, res) => {
  try {
    const games = await BoardGame.findAll();
    console.log("Jeux récupérés :", games); // 🔍 LOG ICI
    res.json(games);
  } catch (error) {
    console.error("Erreur récupération des jeux :", error); // 🔍
    res.status(500).json({ error: 'Erreur serveur' });
  }
});






const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
