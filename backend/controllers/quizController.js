const { findQuizzesByEnseignant } = require('../models/quizModel');

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

module.exports = { getMesQuiz };