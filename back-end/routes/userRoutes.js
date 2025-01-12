const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController'); // Importer le contrôleur

// Routes pour enregistrer un nouvel utilisateur, et pour se connecter
router.post('/signup', userCtrl.signUp);
router.post('/login', userCtrl.signIn);

module.exports = router;