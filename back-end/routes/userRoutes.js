const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController'); // Importer le contrôleur

// Route pour enregistrer un nouvel utilisateur
router.post('/register', userCtrl.registerUser); // Liaison avec la méthode dans le contrôleur

// Vous pouvez ajouter d'autres routes pour la connexion et la mise à jour du profil ici

module.exports = router;