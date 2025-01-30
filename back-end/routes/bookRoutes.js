const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/bookController'); // Importer le contrôleur
const auth = require('../middlewares/authenticationMiddleware'); // Importer le middleware
const multerConfig = require('../middlewares/multer-config'); // Importer la configuration

// L'ordre des middlewares est important ! Il faut placer multer après auth


// DÉFINIR LES ROUTES

// Récupération de tous les livres
router.get('/', bookCtrl.getAllBooks);

// Création d'un nouveau livre
router.post('/', auth, multerConfig.upload, multerConfig.imageUploader, bookCtrl.addBook);

// Pour obtenir les livres les mieux notés
router.get('/bestrating', bookCtrl.getBestRatedBooks);
// bestrating est reconnu si la route est placée avant id (peut-être parce que plusieurs routes sur la même page)

// Récupération d'un livre par ID
router.get('/:id', bookCtrl.getOneBook);

// Modification des infos d'un livre
router.put('/:id', auth, multerConfig.upload, multerConfig.imageUploader, bookCtrl.modifyBook);

// Suppression d'un livre
router.delete('/:id', auth, bookCtrl.deleteBook);

// Noter un livre
router.post('/:id/rating', auth, bookCtrl.rateBook);

module.exports = router;