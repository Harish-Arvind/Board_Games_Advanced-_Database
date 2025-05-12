<template>
  <div id="app">
    <h1>🎲 Board Game Library</h1>

    <input
      v-model="search"
      type="text"
      placeholder="Search a board game..."
    />

    <div v-if="loading">Loading games...</div>
    <div v-else-if="filteredGames.length === 0">No results found.</div>

    <div v-else class="games-grid">
      <div
        v-for="game in paginatedGames"
        :key="game.name"
        class="game-card"
        @click="selectGame(game)"
      >
        <img :src="game.image_url" alt="Game image" />
        <div class="card-info">
          <h2>{{ game.name }}</h2>
          <p class="rating">⭐ {{ game.rating ?? 'N/A' }}/10</p>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">←</button>
      <span>Page {{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">→</button>
    </div>

    <!-- MODAL -->
    <div v-if="selectedGame" class="modal-overlay" @click.self="selectedGame = null">
      <div class="modal-card">
        <img :src="selectedGame.image_url" alt="Game image" />
        <h2>{{ selectedGame.name }}</h2>
        <p><strong>Rating:</strong> {{ selectedGame.rating ?? 'N/A' }}/10</p>
        <p><strong>Players:</strong>
          {{ selectedGame.min_players ?? '?' }} to {{ selectedGame.max_players ?? '?' }}
        </p>
        <p class="desc">{{ selectedGame.description || 'No description available.' }}</p>
        <button class="close-btn" @click="selectedGame = null">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getGames } from "./api";

export default {
  data() {
    return {
      games: [],
      search: "",
      loading: true,
      selectedGame: null,
      currentPage: 1,
      gamesPerPage: 8,
    };
  },
  async mounted() {
    try {
      this.games = await getGames();
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      this.loading = false;
    }
  },
  computed: {
    filteredGames() {
      return this.games.filter((game) =>
        game.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    paginatedGames() {
      const start = (this.currentPage - 1) * this.gamesPerPage;
      return this.filteredGames.slice(start, start + this.gamesPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredGames.length / this.gamesPerPage);
    },
  },
  methods: {
    selectGame(game) {
      this.selectedGame = game;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

body {
  font-family: 'Poppins', sans-serif;
  background: #f3f4f6;
  margin: 0;
  padding: 0;
}

#app {
  padding: 2rem;
  max-width: 1200px;
  margin: auto;
  text-align: center;
}

h1 {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
}

input[type="text"] {
  padding: 10px;
  width: 60%;
  max-width: 400px;
  font-size: 16px;
  border-radius: 10px;
  border: 1px solid #ccc;
  margin-bottom: 30px;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}

.game-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
  cursor: pointer;
}
.game-card:hover {
  transform: translateY(-5px);
}
.game-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.card-info {
  padding: 1rem;
}
.card-info h2 {
  font-size: 18px;
  color: #111827;
  margin: 0 0 8px;
}
.rating {
  font-size: 14px;
  color: #f59e0b;
}

.pagination {
  margin-top: 30px;
}
.pagination button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  margin: 0 10px;
  background: #1f2937;
  color: white;
  cursor: pointer;
}
.pagination button:disabled {
  background: #aaa;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(4px);
  z-index: 1000;
}
.modal-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
}
.modal-card img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  margin-bottom: 20px;
}
.modal-card h2 {
  margin-bottom: 10px;
}
.modal-card .desc {
  color: #4b5563;
  margin: 12px 0;
}
.close-btn {
  margin-top: 15px;
  padding: 10px 20px;
  border: none;
  background: #1f2937;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}
.close-btn:hover {
  background: #111827;
}
</style>
