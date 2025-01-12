const User = require('../models/User'); // Importer le modèle utilisateur

// Fonction pour s'inscrire
const signUp = async (req, res) => {
    const userData = req.body; // Récupérer les données de l'utilisateur à partir de la requête
    const newUser = new User(userData); // Créer une nouvelle instance de l'utilisateur

    try {
        await newUser.save(); // Enregistrer l'utilisateur dans la base de données
        res.status(201).json({ message: 'Utilisateur créé avec succès.' }); // Répondre avec un statut 201
    } catch (error) {
        res.status(400).json({ error: 'Erreur lors de la création de l\'utilisateur.' }); // Répondre avec une erreur
    }
};

// Fonction pour se connecter
const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }); // Trouver l'utilisateur par email
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé.' });
        }

        const isMatch = await bcrypt.compare(password, user.password); // Comparer les mots de passe
        if (!isMatch) {
            return res.status(401).json({ error: 'Mot de passe incorrect.' });
        }

        res.status(200).json({ message: 'Connexion réussie.' }); // Authentification réussie
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la connexion.' });
    }
};

module.exports = { signUp, signIn };