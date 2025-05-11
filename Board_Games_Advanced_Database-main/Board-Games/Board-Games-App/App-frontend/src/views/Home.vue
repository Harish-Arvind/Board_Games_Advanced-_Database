<template>
  <div>
    <h1>Liste des jeux</h1>
    <ul>
      <li v-for="game in games" :key="game.game_id">{{ game.name }}</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomeView',
  data() {
    return {
      games: []
    };
  },
  mounted() {
   
    axios.get('http://localhost:5000/api/games')
      .then(response => {
        this.games = response.data;
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des jeux :', error);
      });
  }
};
</script>
