const express = require('express');
const { requireAuth } = require('../middleware/requireAuth');
const { requireRole } = require('../middleware/requireRole');
const { getMesQuiz, publierQuiz } = require('../controllers/quizController');

const router = express.Router();
router.get('/', requireAuth, getMesQuiz);   // afficher les quiz de l'enseignant connecté
router.patch('/:quizId/publier', requireAuth, requireRole('enseignant'), publierQuiz);   // publier un quiz (bouton Publier)


module.exports = router;