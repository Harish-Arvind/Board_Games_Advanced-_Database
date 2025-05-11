const BoardGame = require('./models/BoardGame');
const db = require('./config/database');

const seedGames = async () => {
  await db.sync(); // Synchronise la structure si nécessaire

  await BoardGame.bulkCreate([
    { name: "Catan", min_players: 3, max_players: 4 },
    { name: "Carcassonne", min_players: 2, max_players: 5 },
    { name: "7 Wonders", min_players: 2, max_players: 7 }
  ]);

  console.log("Jeux insérés !");
  process.exit();
};

seedGames();
