const User = require('../models/User'); // Importation du modèle User

// Enregistrer un nouvel utilisateur
exports.registerUser = async (req, res) => {
    const { email, password } = req.body;
    const user = new User({ email, password });
    try {
        await user.save(); // Sauvegarder l'utilisateur dans la base de données
        res.status(201).json(user); // Retourner l'utilisateur créé
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement utilisateur' }); // Gestion des erreurs
    }
};

// Vous pouvez ajouter d'autres méthodes pour la connexion, la mise à jour du profil, etc.