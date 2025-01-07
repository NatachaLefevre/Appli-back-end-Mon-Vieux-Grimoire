const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bibliotheque')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Chemin vers data.json
const filePath = path.join(__dirname, '..', 'public', 'data', 'data.json');

// Exemple de route pour récupérer les livres depuis data.json
app.get('/api/books', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur de lecture du fichier:', err);
            return res.status(500).json({ message: 'Erreur de lecture du fichier' });
        }
        
        try {
            const books = JSON.parse(data);
            res.json(books);
        } catch (parseError) {
            console.error('Erreur de parsing JSON:', parseError);
            return res.status(500).json({ message: 'Erreur lors du parsing des données' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});