// Sprint 3 : teste le parcours complet enseignant -> quiz -> étudiant, puis delete
// Exécution : node scripts/test-parcours-complet.js
const pool = require('../config/db');
const quizModel = require('../models/quizModel');

let reussis = 0;
let echoues = 0;
function verifier(nom, ok) {
  if (ok) { reussis++; console.log('✔', nom); } else { echoues++; console.log('✖', nom); }
}

(async () => {
  let quizId = null;
  let quizVideId = null;
  try {
    const [[farid]] = await pool.query("SELECT id FROM users WHERE nom_utilisateur = 'Farid'");
    const [[autre]] = await pool.query("SELECT id FROM users WHERE nom_utilisateur <> 'Farid' AND role = 'enseignant' LIMIT 1");

    // 1. L'enseignant crée un quiz avec 2 questions
    quizId = await quizModel.createQuiz(farid.id, 'Introduction aux méthodes agiles', 'Quiz de test (Sprint 3)');
    await quizModel.addQuestion(quizId, 'Que signifie un Sprint dans la méthodologie Scrum?', 'qcm', [
      { texte: 'une course de vitesse entre les développeurs', est_correcte: false },
      { texte: 'une période fixe allant de 1 à 4 semaines', est_correcte: true },
      { texte: 'une réunion quotidienne de 15 minutes', est_correcte: false },
      { texte: 'une réunion de planification de 30 minutes', est_correcte: false },
    ]);
    await quizModel.addQuestion(quizId, 'Le Scrum Master écrit tout le code.', 'vrai_faux', [
      { texte: 'Vrai', est_correcte: false },
      { texte: 'Faux', est_correcte: true },
    ]);
    verifier('le nouveau quiz est en brouillon', (await quizModel.findQuizById(quizId, farid.id)).statut === 'brouillon');

    // 2. Brouillon : l'étudiant ne voit rien
    verifier("le brouillon n'est pas dans la liste de l'étudiant", !(await quizModel.findPublishedQuizzes()).some((q) => q.id === quizId));
    verifier("l'étudiant ne peut pas ouvrir le brouillon", (await quizModel.findPublishedQuiz(quizId)) === null);
    verifier("l'étudiant ne reçoit aucune question du brouillon", (await quizModel.findQuestionsForStudent(quizId)).length === 0);

    // 3. Les règles de publication
    quizVideId = await quizModel.createQuiz(farid.id, 'Quiz vide', null);
    verifier('un quiz sans question ne peut pas être publié', !(await quizModel.publishQuiz(quizVideId, farid.id)));
    if (autre) verifier("un autre enseignant ne peut pas publier le quiz de Farid", !(await quizModel.publishQuiz(quizId, autre.id)));

    // 4. L'enseignant publie son quiz
    verifier('Farid publie son quiz', await quizModel.publishQuiz(quizId, farid.id));
    verifier('le statut est maintenant publié', (await quizModel.findQuizById(quizId, farid.id)).statut === 'publie');
    verifier('publier 2 fois est refusé', !(await quizModel.publishQuiz(quizId, farid.id)));

    // 5. L'étudiant voit le quiz publié et ses questions
    const liste = await quizModel.findPublishedQuizzes();
    verifier("le quiz est dans la liste de l'étudiant", liste.some((q) => q.id === quizId && q.enseignant === 'Farid'));
    verifier('le quiz vide reste caché', !liste.some((q) => q.id === quizVideId));
    verifier("l'étudiant peut ouvrir le quiz", (await quizModel.findPublishedQuiz(quizId)) !== null);
    const questions = await quizModel.findQuestionsForStudent(quizId);
    verifier("l'étudiant voit les 2 questions", questions.length === 2);
    verifier('le QCM a 4 réponses et le Vrai/Faux 2', questions[0].reponses.length === 4 && questions[1].reponses.length === 2);
    verifier("l'étudiant ne reçoit jamais la bonne réponse", questions.every((q) => q.reponses.every((r) => !('est_correcte' in r))));
  } catch (err) {
    echoues++;
    console.log('✖ erreur :', err.message);
  } finally {
    if (quizId) await pool.query('DELETE FROM quiz WHERE id = ?', [quizId]);
    if (quizVideId) await pool.query('DELETE FROM quiz WHERE id = ?', [quizVideId]);
    console.log(`\n${reussis} réussi(s), ${echoues} échoué(s)`);
    process.exitCode = echoues > 0 ? 1 : 0;
    await pool.end();
  }
})();