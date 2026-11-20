
const pool = require('../config/db');

// Enregistrer les réponses d'un étudiant à un quiz
async function enregistrerSoumission(etudiantId, quizId, reponses) {
    const connexion = await pool.getConnection();

    try {
        await connexion.beginTransaction();

        // Récupérer les questions et les choix du quiz
        const [choix] = await connexion.execute(
            `SELECT q.id AS question_id, r.id AS reponse_id
             FROM questions q
             LEFT JOIN reponses r ON r.question_id = q.id
             WHERE q.quiz_id = ?`,
            [quizId]
        );

        const questions = new Map();

        for (const choixPossible of choix) {
            if (!questions.has(choixPossible.question_id)) {
                questions.set(choixPossible.question_id, new Set());
            }

            if (choixPossible.reponse_id !== null) {
                questions.get(choixPossible.question_id)
                    .add(choixPossible.reponse_id);
            }
        }

        // Vérifier qu'il y a une réponse valide par question
        if (questions.size === 0 || reponses.length !== questions.size) {
            const erreur = new Error('Toutes les questions doivent avoir une réponse.');
            erreur.status = 400;
            throw erreur;
        }

        const questionsRepondues = new Set();

        for (const reponse of reponses) {
            if (!reponse ||
                !Number.isSafeInteger(reponse.questionId) ||
                !Number.isSafeInteger(reponse.reponseId) ||
                questionsRepondues.has(reponse.questionId) ||
                !questions.get(reponse.questionId)?.has(reponse.reponseId)) {
                const erreur = new Error('Réponse invalide.');
                erreur.status = 400;
                throw erreur;
            }

            questionsRepondues.add(reponse.questionId);
        }

        // Créer la soumission
        const [resultat] = await connexion.execute(
            `INSERT INTO soumissions (etudiant_id, quiz_id)
             VALUES (?, ?)`,
            [etudiantId, quizId]
        );

        const soumissionId = resultat.insertId;

        // Enregistrer chaque réponse choisie
        for (const reponse of reponses) {
            await connexion.execute(
                `INSERT INTO reponses_etudiants
                 (soumission_id, question_id, reponse_id)
                 VALUES (?, ?, ?)`,
                [soumissionId, reponse.questionId, reponse.reponseId]
            );
        }

        await connexion.commit();
        return soumissionId;

    } catch (error) {
        await connexion.rollback();
        throw error;
    } finally {
        connexion.release();
    }
}

module.exports = { enregistrerSoumission };
