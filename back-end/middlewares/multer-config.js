// Multer est un package qui permet de gérer les fichiers entrants dans les requêtes HTTP
const multer = require('multer');

// Dictionnaire des types MIME pour mapper les extensions
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Configuration du stockage pour Multer
const storage = multer.diskStorage({
  // La fonction destination indique à multer d'enregistrer les fichiers dans le dossier images
  destination: (req, file, callback) => {
    callback(null, 'file'); // "file" est le nom du champ indiqué dans BookForm.jsx
  },
  // La fonction filename définit le nom du fichier enregistré
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); // Remplace les espaces par des underscores
    const extension = MIME_TYPES[file.mimetype]; // Récupère l'extension à partir du type MIME
    callback(null, name + Date.now() + '.' + extension); // Crée un nom unique
  }
});

// Exportation de la configuration multer
module.exports = multer({ storage: storage }).single('image'); // Assurez-vous que 'image' est le bon nom de champ