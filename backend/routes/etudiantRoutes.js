const express = require('express');
const { requireAuth } = require('../middleware/requireAuth');
const { requireRole } = require('../middleware/requireRole');
const { listerQuizPublies, voirQuizPublie, soumettreQuiz } = require('../controllers/etudiantQuizController');

const router = express.Router();
// Je protège les routes : connexion et rôle étudiant obligatoires.
router.use(requireAuth, requireRole('etudiant'));
router.get('/quiz', listerQuizPublies);         // les quiz publiés
router.get('/quiz/:quizId', voirQuizPublie);    // un quiz publié (sinon 404)

router.post('/quiz/:quizId/soumettre', soumettreQuiz);

module.exports = router;