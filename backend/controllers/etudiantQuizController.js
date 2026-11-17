const quizModel = require('../models/quizModel');

// Je lis l'identifiant du quiz dans l'adresse et je refuse une valeur invalide.
function readQuizId(req, res) {
  const value = req.params.quizId;
  if (!/^[1-9]\d*$/.test(value) || Number(value) > 4294967295) {
    res.status(400).json({ message: 'Identifiant du quiz invalide.' });
    return null;
  }
  return Number(value);
}

// J'envoie à l'étudiant seulement les quiz publiés.
async function listerQuizPublies(req, res, next) {
  try {
    const quiz = await quizModel.findPublishedQuizzes();
    return res.json({ quiz });
  } catch (error) {
    return next(error);
  }
}

// Je bloque l'accès si le quiz n'est pas publié (brouillon ou inexistant).
// J'envoie les questions sans les bonnes réponses.
async function voirQuizPublie(req, res, next) {
  const quizId = readQuizId(req, res);
  if (quizId === null) return;
  try {
    const quiz = await quizModel.findPublishedQuiz(quizId);
    if (!quiz) return res.status(404).json({ message: "Ce quiz n'est pas disponible." });
    const questions = await quizModel.findQuestionsForStudent(quizId);
    return res.json({ quiz, questions });
  } catch (error) {
    return next(error);
  }
}

module.exports = { listerQuizPublies, voirQuizPublie };