// Importer l'application Express
const app = require('./app');

// Définir le port du serveur
const POST = process.env.PORT || 3000;

// Démarrer le serveur
app.listen(PORT, () => {
    console.log('Serveur démarré sur http://localhost:${PORT}');
});