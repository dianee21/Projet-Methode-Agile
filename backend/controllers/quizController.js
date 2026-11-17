const { findQuizzesByEnseignant, publishQuiz } = require('../models/quizModel');

// récupérer la liste des quiz de l'enseignant connecté
async function getMesQuiz(req, res, next) {
    try {
        const enseignantId = req.session.userId;    // id du prof connecté
        const quiz = await findQuizzesByEnseignant(enseignantId);

        return res.status(200).json({quiz});
    } catch (error) {
        next(error);
    }
}

// publier un quiz de l'enseignant connecté (brouillon -> publié)
async function publierQuiz(req, res, next) {
    try {
        const quizId = Number(req.params.quizId);   // id du quiz dans l'adresse
        if (!Number.isInteger(quizId) || quizId < 1) {
            return res.status(400).json({ message: 'Identifiant du quiz invalide.' });
        }
        const publie = await publishQuiz(quizId, req.session.userId);
        if (!publie) {
            return res.status(400).json({
                message: 'Impossible de publier ce quiz (introuvable, déjà publié ou sans question).'
            });
        }
        return res.status(200).json({ message: 'Quiz publié.' });
    } catch (error) {
        next(error);
    }
}
module.exports = { getMesQuiz, publierQuiz };

