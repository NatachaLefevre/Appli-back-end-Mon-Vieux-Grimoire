const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors()); // Middleware pour autoriser CORS
app.use(express.json()); // Middleware pour traiter les requêtes JSON

// Connexion à MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bibliotheque')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Importez les routes
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');

// Intégration des routes
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);

module.exports = app;