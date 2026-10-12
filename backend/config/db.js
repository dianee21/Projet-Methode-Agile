// Je prépare mon pool pour que les autres fichiers puissent utiliser MySQL
require('dotenv').config(); // Je lis les informations du fichier .env
const mysql = require('mysql2/promise'); // J'importe mysql2 pour communiquer avec MySQL et créer mon pool

// Je crée la liste des noms des informations obligatoires
const required = ['DB_HOST', 'DB_USER', 'DB_NAME'];
// Je parcours ma liste pour vérifier qu'aucune information obligatoire ne manque
for (const key of required) {
  if (!process.env[key]) throw new Error(`Configuration manquante : ${key}`);
}
// Je récupère le port ou je mets 3306 par défaut si aucune valeur n'est donnée
const port = Number(process.env.DB_PORT || 3306);
// Je vérifie que mon port est un nombre entier entre 1 et 65535
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('DB_PORT doit être un port valide');
}
// Je crée mon pool pour gérer et réutiliser les connexions MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST, // Je récupère l'adresse de MySQL
  port, // Je récupère le port défini plus haut
  user: process.env.DB_USER, // Je récupère mon utilisateur MySQL
  password: process.env.DB_PASSWORD || '', // Je récupère le mot de passe MySQL ou une valeur vide
  database: process.env.DB_NAME, // Je récupère le nom de la base
  waitForConnections: true, // Si toutes les connexions sont prises, les demandes attendent
  connectionLimit: 10, // Je limite le pool à 10 connexions simultanées
  queueLimit: 0 // Je ne fixe pas de limite à la file d'attente
});
// Je rends mon pool accessible aux autres fichiers
module.exports = pool;
