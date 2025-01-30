// Importer le modèle utilisateur
const User = require('../models/User');

// Pour crypter le mot de passe par hachage
const bcrypt = require('bcrypt');

// Pour pouvoir créer et vérifier les tokens d'authentification
const jwt = require('jsonwebtoken');

// Pour écrire le token dans un autre fichier, pour le protéger
require("dotenv").config();


// FONCTION POUR S'INSCRIRE

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


// FONCTION POUR SE CONNECTER

const logIn = (req, res) => {

    // Log de l'email
    console.log("Tentative de connexion pour l'email:", req.body.email);

    User.findOne({ email: req.body.email })

        .then(user => {
            // Log de l'utilisateur trouvé
            console.log("Utilisateur trouvé :", user);
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

// Exportation des fonctions
module.exports = { signUp, logIn }; 