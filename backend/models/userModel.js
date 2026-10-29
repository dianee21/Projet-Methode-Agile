// Requêtes SQL sur la table users (US01)
const pool = require('../config/db');

// Login : trouve l'utilisateur par son nom
async function findByUsername(nomUtilisateur) {
  const [rows] = await pool.execute(
    'SELECT id, nom_utilisateur, mot_de_passe, prenom, nom, role FROM users WHERE nom_utilisateur = ? LIMIT 1',
    [nomUtilisateur]
  );
  return rows[0] || null;
}

// Login réussi : note l'heure de connexion
async function updateLastLogin(id) {
  await pool.execute('UPDATE users SET derniere_connexion = NOW() WHERE id = ?', [id]);
}

// Réinitialisation : change le mot de passe
async function updatePassword(id, hash) {
  await pool.execute('UPDATE users SET mot_de_passe = ? WHERE id = ?', [hash, id]);
}

// Session : trouve l'utilisateur connecté avec req.session.userId (pas mot de passe)
async function findById(id) {
  const [rows] = await pool.execute(
    'SELECT id, nom_utilisateur, prenom, nom, role, derniere_connexion FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

module.exports = { findByUsername, updateLastLogin, updatePassword, findById };