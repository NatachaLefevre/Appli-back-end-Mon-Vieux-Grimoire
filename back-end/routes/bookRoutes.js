const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/bookController'); // Importer le contrôleur
const auth = require('../middlewares/authenticationMiddleware'); // Importer le middleware
const multerConfig = require('../middlewares/multer-config'); // Importer la configuration

// L'ordre des middlewares est important ! Il faut placer multer après auth

// Définir les routes
router.get('/', bookCtrl.getAllBooks); // Récupération de tous les livres
router.post('/', auth, multerConfig.upload, multerConfig.imageUploader, bookCtrl.addBook); // Création d'un nouveau livre
router.get('/bestrating', bookCtrl.getBestRatedBooks); // Pour obtenir les livres les mieux notés
router.get('/:id', bookCtrl.getOneBook); // Récupération d'un livre par ID
router.put('/:id', auth, multerConfig.upload, multerConfig.imageUploader, bookCtrl.modifyBook); // Modification des infos d'un livre
router.delete('/:id', auth, bookCtrl.deleteBook); // Suppression d'un livre
router.post('/:id/rating', auth, bookCtrl.rateBook); // Noter un livre

module.exports = router;