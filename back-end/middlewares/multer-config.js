// Multer est un package qui permet de gérer les fichiers entrants dans les requêtes HTTP
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

// Dictionnaire des types MIME pour mapper les extensions
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Configuration de multer pour stocker les fichiers
const storage = multer.memoryStorage(); // Utiliser la mémoire pour traiter l'image avant de l'enregistrer

// Filtre de validation des types de fichiers
const fileFilter = (req, file, callback) => {
  if (MIME_TYPES[file.mimetype]) {
    callback(null, true); // Accepte le fichier
  } else {
    callback(new Error('Type de fichier non supporté'), false); // Rejette le fichier
  }
};

// Middleware pour traiter et optimiser l'image
const imageUploader = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(); // Si pas de fichier, passer au middleware suivant
    }

    const filename = `${Date.now()}-${req.file.originalname.split(' ').join('_')}`;

    // Utilise sharp pour traiter l'image
    await sharp(req.file.buffer)
      .resize(206, 260) // Redimensionne l'image à 206 pixels de large et 260 pixels de haut
      .toFormat('jpeg', { mozjpeg: true }) // Convertit à JPEG avec compression
      .jpeg({ quality: 80 }) // Ajuste la qualité
      .toFile(path.join(__dirname, '../images', filename)); // Enregistrez l'image finale

    // Ajoutez le nom du fichier à req pour l'utiliser plus tard
    req.file.filename = filename;

    next(); // Passez au middleware suivant
  } catch (error) {
    return res.status(500).json({ error: 'Erreur lors de l\'optimisation de l\'image.' });
  }
};

// Exportation de la configuration multer avec le middleware d'optimisation d'image
module.exports = {
  upload: multer({
    storage: storage,
    fileFilter: fileFilter // Ajout du filtre
  }).single('file'), // Pour indiquer que le fichier provient du champ du formulaire nommé 'file'
  imageUploader // Exporte également le middleware d'optimisation d'image
};