// Ajoute les utilisateurs de test (US01). Exécution : node scripts/seed.js
const pool = require('../config/db');
const { hashPassword } = require('../services/passwordService');
// Comptes de test : le prof + l'équipe (enseignants) + 2 étudiants de test
const UTILISATEURS_TEST = [
  { nom_utilisateur: 'Farid',     mot_de_passe: 'Farid',     prenom: 'Farid',     nom: 'Enseignant', role: 'enseignant' },
  { nom_utilisateur: 'christine', mot_de_passe: 'Christine', prenom: 'Christine', nom: 'Bautista',   role: 'enseignant' },
  { nom_utilisateur: 'thomas',    mot_de_passe: 'Thomas',    prenom: 'Thomas',    nom: 'Rodrigues',  role: 'enseignant' },
  { nom_utilisateur: 'diane',     mot_de_passe: 'Diane',     prenom: 'Diane',     nom: 'Devi',       role: 'enseignant' },
  { nom_utilisateur: 'marilou',   mot_de_passe: 'Marilou',   prenom: 'Marilou',   nom: 'Scott',      role: 'enseignant' },
  { nom_utilisateur: 'amine',     mot_de_passe: 'Amine',     prenom: 'Amine',     nom: 'Lemgandez',  role: 'enseignant' },
  { nom_utilisateur: 'etudiant1', mot_de_passe: 'Etudiant1', prenom: 'Étudiant', nom: 'Test 1',     role: 'etudiant' },
  { nom_utilisateur: 'etudiant2', mot_de_passe: 'Etudiant2', prenom: 'Étudiant', nom: 'Test 2',     role: 'etudiant' },
];
async function seed() {
  try {
    for (const u of UTILISATEURS_TEST) {
      const hash = await hashPassword(u.mot_de_passe); // même hash que le login d'Amine
      // ON DUPLICATE KEY : on peut relancer le script sans créer de doublon
      await pool.execute(
        `INSERT INTO users (nom_utilisateur, mot_de_passe, prenom, nom, role)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE mot_de_passe = VALUES(mot_de_passe), prenom = VALUES(prenom),
                                 nom = VALUES(nom), role = VALUES(role)`,
        [u.nom_utilisateur, hash, u.prenom, u.nom, u.role]
      );
      console.log(`Prêt : ${u.nom_utilisateur} / ${u.mot_de_passe} (${u.role})`);
    }
  } catch (err) {
    console.error('Erreur lors du seed :', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}
seed();