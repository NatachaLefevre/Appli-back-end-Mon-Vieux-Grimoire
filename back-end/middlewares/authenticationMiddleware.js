// Pour obliger l'user à entrer une clé d'authentification

require("dotenv").config();

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Token manquant' });
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        req.auth = {
            userId: userId
        };
        next();
        
    } catch (error) {
        // Ajout d'un log pour débogage
        console.error("Erreur d'authentification:", error);
        res.status(401).json({ error });
    }
};