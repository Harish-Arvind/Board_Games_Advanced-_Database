<template>
  <div id="app">
    <h1>Board Game List</h1>
    <div v-if="games.length === 0">Loading...</div>
    <div v-else class="games-list">
      <div v-for="game in games" :key="game.game_id" class="game-card">
        <h2>{{ game.name }}</h2>
        <p>Players: {{ game.min_players }} to {{ game.max_players }}</p>
        <img
          :src="game.image_url"
          @error="onImageError"
          alt="Game image"
          width="200"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getGames } from "./api";

export default {
  name: "App",
  data() {
    return {
      games: [],
    };
  },
  mounted() {
    getGames()
      .then((data) => {
        this.games = data;
      })
      .catch((error) => {
        console.error("Error fetching games:", error);
      });
  },
  methods: {
    onImageError(event) {
      event.target.src = "/images/default.jpg";
    },
  },
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
}
#app {
  padding: 20px;
}
.games-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.game-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  width: 220px;
  text-align: center;
  background-color: #f9f9f9;
}
</style>
