const User = require('../models/User'); // Importer le modèle utilisateur
const bcrypt = require('bcrypt'); // Pour crypter le mot de passe par hachage
const jwt = require('jsonwebtoken'); // Pour pouvoir créer et vérifier les tokens d'authentification
require("dotenv").config();

// Fonction pour s'inscrire
const signUp = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// Fonction pour se connecter
const logIn = (req, res) => {
    console.log("Tentative de connexion pour l'email:", req.body.email); // Log de l'email
    User.findOne({ email: req.body.email })
        .then(user => {
            console.log("Utilisateur trouvé :", user); // Log de l'utilisateur trouvé
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.JWT_SECRET,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => {
                    console.error("Erreur de comparaison des mots de passe :", error); // Log d'erreur
                    res.status(500).json({ error });
                });
        })
        .catch(error => {
            console.error("Erreur lors de la recherche de l'utilisateur :", error); // Log d'erreur
            res.status(500).json({ error });
        });
};

module.exports = { signUp, logIn }; // Exportation des fonctions