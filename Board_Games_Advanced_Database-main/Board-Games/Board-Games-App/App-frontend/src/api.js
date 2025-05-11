// src/api.js
import axios from "axios";

const API_BASE = "http://localhost:5000"; // Assure-toi que le backend tourne ici

export async function getGames() {
  const response = await axios.get(`${API_BASE}/api/games`);
  return response.data;
}
