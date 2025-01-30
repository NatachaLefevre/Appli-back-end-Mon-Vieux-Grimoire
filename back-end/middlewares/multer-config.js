// Multer est un package qui permet de gérer les fichiers entrants dans les requêtes HTTP
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');


// DICTIONNAIRE DES TYPES MIME POUR MAPPER LES EXTENSIONS

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// CONFIGURATION DE MULTER POUR STOCKER LES FICHIERS

const storage = multer.memoryStorage();
// Utiliser la mémoire pour traiter l'image avant de l'enregistrer


// FILTRE DE VALIDATION DES TYPES DE FICHIERS

const fileFilter = (req, file, callback) => {

  if (MIME_TYPES[file.mimetype]) {
    // Accepte le fichier
    callback(null, true);

  } else {
    // Rejette le fichier
    callback(new Error('Type de fichier non supporté'), false);
  }
};


// MIDDLEWARE POUR TRAITER ET OPTIMISER L'IMAGE

const imageUploader = async (req, res, next) => {

  try {
    if (!req.file) {
      // Si pas de fichier, passer au middleware suivant
      return next();
    }

    const filename = `${Date.now()}-${req.file.originalname.split(' ').join('_')}`;

    // Utiliser sharp pour traiter l'image
    await sharp(req.file.buffer)

      // Redimensionne l'image à 206 pixels de large et 260 pixels de haut
      .resize(206, 260)

      // Convertit à JPEG avec compression
      .toFormat('jpeg', { mozjpeg: true })

      // Ajuste la qualité
      .jpeg({ quality: 80 })

      // Enregistre l'image finale
      .toFile(path.join(__dirname, '../images', filename));

    // Ajouter le nom du fichier à req pour l'utiliser plus tard
    req.file.filename = filename;

    // Passer au middleware suivant
    next();
  } catch (error) {

    return res.status(500).json({ error: 'Erreur lors de l\'optimisation de l\'image.' });
  }
};


// EXPORTATION DE LA CONFIGURATION MULTER AVEC LE MIDDLEWARE D'OPTIMISATION D'IMAGE

module.exports = {

  upload: multer({

    storage: storage,
    // Ajout du filtre
    fileFilter: fileFilter,

    // Limite la taille à 2 Mo (2 * 1024 * 1024 octets)
    limits: { fileSize: 2 * 1024 * 1024 }

  })
    // Correspond au paramètre image dans le formulaire (champ image)
    .single('image'),

  // Exportation du middleware d'optimisation d'image
  imageUploader
};