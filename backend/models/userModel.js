// Requêtes SQL sur la table users (US01)
const pool = require('../config/db');
// Login : trouve l'utilisateur par son nom (renvoie le hash pour verifyPassword)
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
module.exports = { findByUsername, updateLastLogin };