const express = require('express');
const path = require('path');

const { createSessionMiddleware } = require('./config/session');    // Importer la configuration des sessions
const authRoutes = require('./routes/authRoutes');                  // Importer les routes d'authentification
const quizRoutes = require('./routes/quizRoutes');
const { requireAuth } = require('./middleware/requireAuth');        // Importer le middleware pour protéger les routes privées

const app = express();              // Créer l'application Express
app.use(express.json());            // Permettre à Express de recevoir des données JSON
app.use(createSessionMiddleware()); // Activer la gestion des sessions

// Servir les fichiers du frontend (CSS, JS, images, HTML)
app.use(express.static(path.join(__dirname, '../frontend')));

// Afficher la page de login à la racine
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/login.html'));
});

app.use('/api/auth', authRoutes);   // Ajouter les routes d'authentification
app.use('/api/quiz', quizRoutes);

// Créer une route privée pour le Dashboard
app.get('/api/dashboard', requireAuth, (req, res) => {
    res.json({
        message: "Bienvenue sur votre tableau de bord."
    });
});

// Gérer les erreurs du serveur
app.use((error, req, res, next) => {
    console.error(error);
    res.json({
        message: "Une erreur est survenue sur le serveur."
    });
});

// Exporter l'application Express
module.exports = app;