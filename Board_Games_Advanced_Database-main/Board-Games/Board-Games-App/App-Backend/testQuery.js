// App-Backend/testQuery.js
require("dotenv").config();
const db = require("./src/config/database");
const BoardGame = require("./src/models/BoardGame");

async function test() {
  try {
    await db.authenticate();
    console.log("✅ Connected to DB");

    const games = await BoardGame.findAll();
    console.log("✅ Games fetched:", games.length);
    console.log(games.map(g => g.name));
  } catch (err) {
    console.error("❌ Sequelize test failed:", err.message || err);
  }
}

test();
