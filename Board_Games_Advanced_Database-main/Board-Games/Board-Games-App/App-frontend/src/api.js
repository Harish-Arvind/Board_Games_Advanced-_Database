import axios from "axios";

const API_BASE = "http://localhost:5000"; // ✅ Corrigé

export async function getGames() {
  const response = await axios.get(`${API_BASE}/api/games`);
  return response.data;
}
