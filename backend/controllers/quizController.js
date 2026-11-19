const { findQuizzesByEnseignant, publishQuiz, updateQuiz } = require('../models/quizModel');
const { validateQuestion } = require('../validators/questionValidator');

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

// lire l'identifiant du quiz dans l'adresse (null si invalide)
function lireQuizId(req) {
    const quizId = Number(req.params.quizId);
    return Number.isInteger(quizId) && quizId > 0 ? quizId : null;
}

// modifier un quiz de l'enseignant connecté : titre, description et (si envoyées) toutes les questions (bouton Modifier)
async function modifierQuiz(req, res, next) {
    try {
        const quizId = lireQuizId(req);
        if (quizId === null) {
            return res.status(400).json({ message: 'Identifiant du quiz invalide.' });
        }

        const { titre, description, questions } = req.body || {};

        if (typeof titre !== 'string' || !titre.trim() || titre.trim().length > 150) {
            return res.status(400).json({ message: 'Le titre est obligatoire (150 caractères maximum).' });
        }
        if (description != null && typeof description !== 'string') {
            return res.status(400).json({ message: 'La description doit être du texte.' });
        }

        // Si les questions sont envoyées : il en faut au moins une et chacune doit être valide
        let questionsPropres;
        if (questions !== undefined) {
            if (!Array.isArray(questions) || questions.length === 0) {
                return res.status(400).json({ message: 'Le quiz doit contenir au moins une question.' });
            }
            for (const question of questions) {
                const resultat = validateQuestion(question);
                if (!resultat.valid) {
                    return res.status(400).json({ message: 'Une question est invalide.', errors: resultat.errors });
                }
            }
            questionsPropres = questions.map(q => ({
                enonce: q.enonce.trim(),
                type: q.type,
                reponses: q.reponses.map(r => ({ texte: r.texte.trim(), est_correcte: r.est_correcte }))
            }));
        }

        const modifie = await updateQuiz(quizId, req.session.userId, titre.trim(), description?.trim() || null, questionsPropres);
        if (!modifie) {
            return res.status(404).json({ message: 'Quiz introuvable.' });
        }
        return res.status(200).json({ message: 'Quiz modifié.' });
    } catch (error) {
        next(error);
    }
}

module.exports = { getMesQuiz, publierQuiz, modifierQuiz };