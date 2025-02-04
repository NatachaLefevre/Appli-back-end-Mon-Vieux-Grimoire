// Version très simple de la gestion du serveur.
// Idéalement ajouter ici des logs pour chaque requête faite sur le serveur.
// Et pour fermer proprement le serveur.

const app = require('./app');
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});