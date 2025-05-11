const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BoardGame = sequelize.define("BoardGame", {
  game_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  min_players: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  max_players: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: "board_games",
  timestamps: false, // ou true si tu as createdAt/updatedAt
});

module.exports = BoardGame;
