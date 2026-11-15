// Les comptes de test ne sont plus écrits ici
// Ils sont dans scripts/comptes-test.json, qui jamais envoyé sur GitHub
// Pour le créer faut copier comptes-test.exemple.json en comptes-test.json pis changer les mots de passe.
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');
const { hashPassword } = require('../services/passwordService');

const FICHIER_COMPTES = path.join(__dirname, 'comptes-test.json');
// Lire les comptes de test dans le fichier local
function lireComptes() {
  if (!fs.existsSync(FICHIER_COMPTES)) {
    throw new Error('Fichier scripts/comptes-test.json introuvable. Copiez comptes-test.exemple.json en comptes-test.json.');
  }
  const comptes = JSON.parse(fs.readFileSync(FICHIER_COMPTES, 'utf8').replace(/^\uFEFF/, ''));
  // Même règle que la connexion : une majuscule obligatoire
  for (const u of comptes) {
    if (typeof u.mot_de_passe !== 'string' || !/[A-Z]/.test(u.mot_de_passe)) {
      throw new Error(`Mot de passe invalide pour ${u.nom_utilisateur} (une majuscule obligatoire).`);
    }
  }
  return comptes;
}

async function seed() {
  try {
    for (const u of lireComptes()) {
      const hash = await hashPassword(u.mot_de_passe);

      // Crée les comptes manquants sans réinitialiser les mots de passe existants.
      // Préserve également les courriels déjà enregistrés.
      await pool.execute(
        `INSERT INTO users
          (nom_utilisateur, mot_de_passe, prenom, nom, email, role)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
          prenom = VALUES(prenom),
          nom = VALUES(nom),
          role = VALUES(role),
          email = COALESCE(email, VALUES(email))`,
        [
          u.nom_utilisateur,
          hash,
          u.prenom,
          u.nom,
          u.email,
          u.role
        ]
      );

      console.log(`Prêt : ${u.nom_utilisateur} (${u.role})`);
    }

    console.log('Initialisation terminée.');
  } catch (err) {
    console.error('Erreur lors du seed :', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();
