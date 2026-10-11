// Ajoute l'utilisateur enseignant de test (US01). Exécution : node scripts/seed.js
const pool = require('../config/db');
const { hashPassword } = require('../services/passwordService');
const ENSEIGNANT_TEST = {
  nom_utilisateur: 'Farim',
  mot_de_passe: 'Farim',
  prenom: 'Farim',
  nom: 'Enseignant',
  role: 'enseignant',
};
async function seed() {
  try {
    const hash = await hashPassword(ENSEIGNANT_TEST.mot_de_passe); // même hash que le login d'Amine
    await pool.execute(
      `INSERT INTO users (nom_utilisateur, mot_de_passe, prenom, nom, role)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE mot_de_passe = VALUES(mot_de_passe), role = VALUES(role)`,
      [ENSEIGNANT_TEST.nom_utilisateur, hash, ENSEIGNANT_TEST.prenom, ENSEIGNANT_TEST.nom, ENSEIGNANT_TEST.role]
    );
    console.log(`Utilisateur de test prêt : ${ENSEIGNANT_TEST.nom_utilisateur} / ${ENSEIGNANT_TEST.mot_de_passe}`);
  } catch (err) {
    console.error('Erreur lors du seed :', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}
seed();