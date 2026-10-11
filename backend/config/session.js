// Dans app.js je dois installer ce middleware avant les routes de connexion
require('dotenv').config(); // Je lis les informations du fichier .env
const session = require('express-session'); // J'importe express-session pour gérer les sessions
// Je crée une fonction qui prépare la gestion des sessions
function createSessionMiddleware() {
  // Je vérifie que SESSION_SECRET existe et contient au moins 32 caractères
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    throw new Error('SESSION_SECRET doit contenir au moins 32 caractères aléatoires.');
  }
  const production = process.env.NODE_ENV === 'production'; // Je vérifie si je suis en production
  // Si je suis en production je vérifie que le cookie est configuré en mode sécurisé
  if (production && process.env.SESSION_COOKIE_SECURE !== 'true') {
    throw new Error('En production, SESSION_COOKIE_SECURE=true exige HTTPS.');
  }
  // Je retourne la configuration du système de sessions
  return session({
    name: 'quiz.sid', // Je donne un nom au cookie de session
    secret: process.env.SESSION_SECRET, // Je récupère la clé secrète depuis .env
    resave: false, // Je ne sauvegarde pas une session inchangée systématiquement
    saveUninitialized: false, // Je ne sauvegarde pas une nouvelle session vide
    // Je garde le stockage en mémoire pour le développement, en production il faudra le remplacer
    cookie: { // Je définis les règles de mon cookie
      httpOnly: true, // J'empêche le JavaScript de la page de lire le cookie
      secure: production || process.env.SESSION_COOKIE_SECURE === 'true', // Je demande un cookie sécurisé selon la configuration
      sameSite: 'lax', // Je limite certains envois du cookie depuis d'autres sites
      maxAge: 1000 * 60 * 60 * 2 // Je mets une durée de deux heures
    }
  });
}
// Je rends ma fonction accessible aux autres fichiers
module.exports = { createSessionMiddleware };
