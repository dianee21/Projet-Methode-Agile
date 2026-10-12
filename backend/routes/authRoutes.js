const express = require('express');

// Importer la fonction de connexion du contrôleur
const { login } = require('../controllers/authController');

// Importer les fonctions de validation et de déconnexion
const { validateLoginRequest } = require('../validators/authValidator');
const { logout } = require('../services/sessionService');

// Créer un routeur Express
const router = express.Router();

// Vérifier les informations avant de connecter l'enseignant
router.post('/login', validateLoginRequest, login);

// Déconnecter l'utilisateur
router.post('/logout', logout);

// Exporter les routes pour les utiliser dans l'application
module.exports = router;