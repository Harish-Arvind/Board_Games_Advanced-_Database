const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Test de base
app.get('/', (req, res) => {
  res.send('Board Game App API Running');
});

// ✅ Route des jeux
app.get('/api/games', (req, res) => {
  res.json([
    { id: 1, name: 'Catan' },
    { id: 2, name: 'Carcassonne' },
    { id: 3, name: '7 Wonders' }
  ]);
});

// ✅ Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
