
const crypto = require('crypto');
const pool = require('../config/db');
const { hashPassword } = require('../services/passwordService');

// On garde seulement le hash du jeton dans la base
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

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
  await pool.execute(
    'UPDATE users SET derniere_connexion = NOW() WHERE id = ?',
    [id]
  );
}

// Session : trouve l'utilisateur connecté
async function findById(id) {
  const [rows] = await pool.execute(
    'SELECT id, nom_utilisateur, prenom, nom, email, role, derniere_connexion FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

// Changer le mot de passe
async function updatePassword(id, nouveauMotDePasse) {
  const hash = await hashPassword(nouveauMotDePasse);
  await pool.execute(
    'UPDATE users SET mot_de_passe = ? WHERE id = ?',
    [hash, id]
  );
}

// Trouve un compte par courriel
async function findByEmail(email) {
  const [rows] = await pool.execute(
    'SELECT id, nom_utilisateur, prenom, email FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0] || null;
}

// Enregistre le courriel d'un utilisateur
async function updateEmail(id, email) {
  await pool.execute(
    'UPDATE users SET email = ? WHERE id = ?',
    [email || null, id]
  );
}

// Crée un jeton de réinitialisation valide 30 minutes
async function createResetToken(userId) {
  const token = crypto.randomBytes(32).toString('hex');

  // Invalide les anciens jetons inutilisés
  await pool.execute(
    'UPDATE password_resets SET utilise = 1 WHERE user_id = ? AND utilise = 0',
    [userId]
  );

  await pool.execute(
    `INSERT INTO password_resets (user_id, token_hash, expire_le)
     VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 MINUTE))`,
    [userId, hashToken(token)]
  );

  return token;
}

// Réinitialise le mot de passe avec un jeton à usage unique
async function resetPasswordWithToken(token, nouveauMotDePasse) {
  const hash = await hashPassword(nouveauMotDePasse);
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [rows] = await conn.execute(
      `SELECT id, user_id
       FROM password_resets
       WHERE token_hash = ?
         AND utilise = 0
         AND expire_le > NOW()
       LIMIT 1
       FOR UPDATE`,
      [hashToken(token)]
    );

    if (!rows[0]) {
      await conn.rollback();
      return false;
    }

    await conn.execute(
      'UPDATE users SET mot_de_passe = ? WHERE id = ?',
      [hash, rows[0].user_id]
    );

    await conn.execute(
      'UPDATE password_resets SET utilise = 1 WHERE id = ?',
      [rows[0].id]
    );

    await conn.commit();
    return true;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = {
  findByUsername,
  updateLastLogin,
  findById,
  updatePassword,
  findByEmail,
  updateEmail,
  createResetToken,
  resetPasswordWithToken
};
