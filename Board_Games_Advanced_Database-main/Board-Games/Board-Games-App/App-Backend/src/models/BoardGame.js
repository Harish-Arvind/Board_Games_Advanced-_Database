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
  image_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  year_published: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
rating: {
  type: DataTypes.FLOAT,
  allowNull: true,
},
  min_players: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  max_players: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

}, {
  tableName: "board_games",
  timestamps: false,
});

module.exports = BoardGame;
