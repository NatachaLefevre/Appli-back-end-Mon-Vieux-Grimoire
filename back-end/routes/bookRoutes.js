const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/bookController'); // Importer le contrôleur
const auth = require('../middlewares/authenticationMiddleware'); // Importer le middleware
const multer = require('../middlewares/multer-config'); 
//L'ordre des middlewares est important ! Il faut placer multer après auth

// Définir les routes
router.get('/', bookCtrl.getAllBooks); // Récupération de tous les livres
router.post('/', auth, multer, bookCtrl.addBook); // Création d'un nouveau livre
router.get('/:id', bookCtrl.getOneBook); // Récupération d'un livre par ID
router.put('/:id', auth, multer, stuffCtrl.modifyBook); // Modification des infos d'un livre
router.delete('/:id', auth, stuffCtrl.deleteBook); // Suppression d'un livre

module.exports = router;