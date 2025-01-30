const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const path = require('path');


// ROUTES VERS LES LIVRES ET LES UTILISATEURS
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');


// MIDDLEWARE POUR AUTORISER CORS
app.use(cors({
    // Autorise uniquement les requêtes provenant de ce port
    origin: 'http://localhost:3000' 
}));


// MIDDLEWARE POUR TRAITER LES REQUÊTES JSON
app.use(express.json());


// CONNEXION À MONGODB
mongoose.connect('mongodb://127.0.0.1:27017/bibliotheque')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));


// À PLACER JUSTE AU-DESSUS DES ROUTES
app.use('/images', express.static(path.join(__dirname, 'images')));


// INTÉGRATION DES ROUTES
app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);


// GESTION DES ERREURS
app.use((err, req, res, next) => {
    console.error(err.stack);
    console.error(err)
    res.status(500).send('Quelque chose s\'est mal passé !');
});


// ROUTES NON TROUVÉES
app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
});


// EXPORTE L'APPLICATION EXPRESS POUR L'UTILISER DANS SERVER.JS
module.exports = app; 