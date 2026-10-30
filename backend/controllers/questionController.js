const quizModel = require('../models/quizModel');
const { validateQuestion } = require('../validators/questionValidator');

function readQuizId(req, res) {
  const value = req.params.quizId;
  if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) > 4294967295) {
    res.status(400).json({ message: 'Identifiant du quiz invalide.' });
    return null;
  }
  return Number(value);
}

// J'ajoute une question uniquement au quiz qui appartient à l'enseignant connecté.
async function createQuestion(req, res, next) {
  const quizId = readQuizId(req, res);
  if (quizId === null) return;
  const result = validateQuestion(req.body);
  if (!result.valid) return res.status(400).json({ error: 'VALIDATION_ERROR', errors: result.errors });
  try {
    const quiz = await quizModel.findQuizById(quizId, req.session.userId);
    if (!quiz) return res.status(404).json({ message: 'Quiz introuvable.' });
    const { enonce, type, reponses } = req.body;
    const cleanReponses = reponses.map(r => ({ texte: r.texte.trim(), est_correcte: r.est_correcte }));
    const id = await quizModel.addQuestion(quizId, enonce.trim(), type, cleanReponses);
    return res.status(201).json({ message: 'Question ajoutée.', question: { id, quiz_id: quizId } });
  } catch (error) {
    return next(error);
  }
}

// J'affiche les questions avec les bonnes réponses seulement au propriétaire du quiz.
async function listQuestions(req, res, next) {
  const quizId = readQuizId(req, res);
  if (quizId === null) return;
  try {
    const quiz = await quizModel.findQuizById(quizId, req.session.userId);
    if (!quiz) return res.status(404).json({ message: 'Quiz introuvable.' });
    const questions = await quizModel.findQuestionsByQuiz(quizId);
    return res.json({ quiz, questions });
  } catch (error) {
    return next(error);
  }
}

module.exports = { createQuestion, listQuestions };
