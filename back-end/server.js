const app = require('./app');
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});