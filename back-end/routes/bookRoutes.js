const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/bookController'); // Importer le contrôleur

// Définir les routes
router.get('/', bookCtrl.getAllBooks); // Récupération de tous les livres
router.post('/', bookCtrl.addBook); // Création d'un nouveau livre
router.get('/:id', bookCtrl.getOneBook); // Récupération d'un livre par ID
// Ajouter les routes pour modifier et supprimer un livre ici

module.exports = router;