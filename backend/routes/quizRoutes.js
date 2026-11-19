const express = require('express');
const { requireAuth } = require('../middleware/requireAuth');
const { requireRole } = require('../middleware/requireRole');
const { getMesQuiz, publierQuiz, modifierQuiz, supprimerQuiz } = require('../controllers/quizController');

const router = express.Router();
router.get('/', requireAuth, getMesQuiz);   // afficher les quiz de l'enseignant connecté
router.patch('/:quizId/publier', requireAuth, requireRole('enseignant'), publierQuiz);   // publier un quiz (bouton Publier)

router.put('/:quizId', requireAuth, requireRole('enseignant'), modifierQuiz);         // modifier un quiz (bouton Modifier)

router.delete('/:quizId', requireAuth, requireRole('enseignant'), supprimerQuiz);      // supprimer un quiz (bouton Supprimer)

module.exports = router;