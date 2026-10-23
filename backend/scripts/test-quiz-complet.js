// fait quiz de test pour Farid, vérifie tout, puis delete
const pool = require('../config/db');
const quizModel = require('../models/quizModel');

let reussis = 0;
let echoues = 0;
function verifier(nom, ok) {
  if (ok) { reussis++; console.log('✔', nom); } else { echoues++; console.log('✖', nom); }
}
async function doitEtreRefuse(nom, action) {
  try { await action(); verifier(nom, false); } catch { verifier(nom, true); }
}

(async () => {
  let quizId = null;
  try {
    const [[farid]] = await pool.query("SELECT id FROM users WHERE nom_utilisateur = 'Farid'");
    const [[autre]] = await pool.query("SELECT id FROM users WHERE nom_utilisateur <> 'Farid' LIMIT 1");

    // 1. Créer le quiz
    quizId = await quizModel.createQuiz(farid.id, 'Introduction aux méthodes agiles', 'Quiz de test (carte 15)');
    verifier('le quiz est créé', Number.isInteger(quizId));
    verifier("le quiz appartient à Farid", (await quizModel.findQuizById(quizId, farid.id)) !== null);
    if (autre) verifier("un autre enseignant ne voit pas le quiz de Farid", (await quizModel.findQuizById(quizId, autre.id)) === null);

    // 2. Ajouter une question QCM et une question Vrai/Faux
    await quizModel.addQuestion(quizId, 'Que signifie un Sprint dans la méthodologie Scrum?', 'qcm', [
      { texte: 'une course de vitesse entre les développeurs', est_correcte: false },
      { texte: 'une période fixe allant de 1 à 4 semaines', est_correcte: true },
      { texte: 'une réunion quotidienne de 15 minutes', est_correcte: false },
      { texte: 'une réunion de planification de 30 minutes', est_correcte: false },
    ]);
    await quizModel.addQuestion(quizId, 'La Terre est plate?', 'vrai_faux', [
      { texte: 'Vrai', est_correcte: false },
      { texte: 'Faux', est_correcte: true },
    ]);

    // 3. Relire le quiz
    const questions = await quizModel.findQuestionsByQuiz(quizId);
    verifier('le quiz a 2 questions', questions.length === 2);
    verifier('le QCM a 4 réponses', questions[0] && questions[0].reponses.length === 4);
    verifier('le Vrai/Faux a 2 réponses', questions[1] && questions[1].reponses.length === 2);
    verifier('chaque question a une seule bonne réponse', questions.every((q) => q.reponses.filter((r) => r.est_correcte).length === 1));
    verifier('la bonne réponse du QCM est la bonne', questions[0] && questions[0].reponses.find((r) => r.est_correcte).texte.includes('1 à 4 semaines'));

    // 4. Les règles sont respectées
    const six = Array.from({ length: 6 }, (_, i) => ({ texte: `Réponse ${i + 1}`, est_correcte: i === 0 }));
    await doitEtreRefuse('refuse plus de 5 réponses', () => quizModel.addQuestion(quizId, 'Trop de réponses', 'qcm', six));
    await doitEtreRefuse('refuse 2 bonnes réponses', () => quizModel.addQuestion(quizId, 'Deux bonnes', 'qcm', [
      { texte: 'A', est_correcte: true }, { texte: 'B', est_correcte: true },
    ]));
    await doitEtreRefuse('refuse aucune bonne réponse', () => quizModel.addQuestion(quizId, 'Aucune bonne', 'qcm', [
      { texte: 'A', est_correcte: false }, { texte: 'B', est_correcte: false },
    ]));
    await doitEtreRefuse('refuse un Vrai/Faux avec 3 choix', () => quizModel.addQuestion(quizId, 'Vrai/Faux bizarre', 'vrai_faux', [
      { texte: 'Vrai', est_correcte: true }, { texte: 'Faux', est_correcte: false }, { texte: 'Peut-être', est_correcte: false },
    ]));
    verifier('les questions refusées ne sont pas enregistrées', (await quizModel.findQuestionsByQuiz(quizId)).length === 2);

    // 5. Supprimer le quiz supprime aussi ses questions et réponses
    await pool.query('DELETE FROM quiz WHERE id = ?', [quizId]);
    const [[{ restantes }]] = await pool.query('SELECT COUNT(*) AS restantes FROM questions WHERE quiz_id = ?', [quizId]);
    verifier('supprimer le quiz supprime ses questions', restantes === 0);
    quizId = null;
  } catch (err) {
    echoues++;
    console.log('✖ erreur :', err.message);
  } finally {
    if (quizId) await pool.query('DELETE FROM quiz WHERE id = ?', [quizId]);
    console.log(`\n${reussis} réussi(s), ${echoues} échoué(s)`);
    process.exitCode = echoues > 0 ? 1 : 0;
    await pool.end();
  }
})();