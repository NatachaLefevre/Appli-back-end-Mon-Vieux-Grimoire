const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const path = require('path');

// Routes vers les livres et les utilisateurs
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');

// Middleware pour autoriser CORS
app.use(cors({
    origin: 'http://localhost:3000' // Autorise uniquement les requêtes provenant de ce port
}));

// Middleware pour traiter les requêtes JSON
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bibliotheque')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// À placer juste au-dessus des routes
app.use('/images', express.static(path.join(__dirname, 'images')));

// Intégration des routes
app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Quelque chose s\'est mal passé !');
});

// Routes non trouvées
app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
});

module.exports = app; // Exporte l'application Express pour l'utiliser dans server.js