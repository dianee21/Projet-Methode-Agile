
const pool = require('../config/db');
const { hashPassword } = require('../services/passwordService');

// Comptes de test : enseignants et étudiants
const UTILISATEURS_TEST = [
  { nom_utilisateur: 'Farid',     mot_de_passe: 'Farid',     prenom: 'Farid',     nom: 'Enseignant', email: 'farid@exemple.com',     role: 'enseignant' },
  { nom_utilisateur: 'christine', mot_de_passe: 'Christine', prenom: 'Christine', nom: 'Bautista',   email: 'christine@exemple.com', role: 'enseignant' },
  { nom_utilisateur: 'thomas',    mot_de_passe: 'Thomas',    prenom: 'Thomas',    nom: 'Rodrigues',  email: 'thomas@exemple.com',    role: 'enseignant' },
  { nom_utilisateur: 'diane',     mot_de_passe: 'Diane',     prenom: 'Diane',     nom: 'Devi',       email: 'diane@exemple.com',     role: 'enseignant' },
  { nom_utilisateur: 'marilou',   mot_de_passe: 'Marilou',   prenom: 'Marilou',   nom: 'Scott',      email: 'marilou@exemple.com',   role: 'enseignant' },
  { nom_utilisateur: 'amine',     mot_de_passe: 'Amine',     prenom: 'Amine',     nom: 'Lemgandez',  email: 'amine@exemple.com',     role: 'enseignant' },
  { nom_utilisateur: 'etudiant1', mot_de_passe: 'Etudiant1', prenom: 'Étudiant',  nom: 'Test 1',     email: null,                    role: 'etudiant' },
  { nom_utilisateur: 'etudiant2', mot_de_passe: 'Etudiant2', prenom: 'Étudiant',  nom: 'Test 2',     email: null,                    role: 'etudiant' },
];

async function seed() {
  try {
    for (const u of UTILISATEURS_TEST) {
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
