const pool = require('../config/db'); // J'importe mon pool depuis db.js
// Je crée une fonction async qui se lance directement pour tester MySQL
(async () => {
  try { // J'essaie de faire une requête à MySQL
    const [rows] = await pool.query('SELECT 1 AS ok'); // Je demande à MySQL de me retourner 1 et j'attends sa réponse
    console.log('Connexion MySQL OK :', rows[0]); // J'affiche le résultat si tout fonctionne
  } catch (err) { // Si une erreur arrive je la récupère
    console.error('Connexion MySQL impossible :', err.message); // J'affiche le message d'erreur
    process.exitCode = 1; // Je mets 1 pour indiquer que le test a échoué
  } finally { // Je passe ici même si la requête a échoué
    await pool.end(); // Je ferme le pool après mon test
  }
})();
