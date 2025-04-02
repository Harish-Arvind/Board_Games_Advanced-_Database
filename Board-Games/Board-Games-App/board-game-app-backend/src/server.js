require("dotenv").config();
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

app.get("/", (req, res) => res.send("Board Game App API Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
