const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController'); // Importer le contrôleur
const auth = require('../middlewares/authenticationMiddleware');

// Routes pour enregistrer un nouvel utilisateur, et pour se connecter
router.post('/signup', userCtrl.signUp);
router.post('/login', userCtrl.logIn);

module.exports = router;