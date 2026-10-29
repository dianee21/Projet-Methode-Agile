const express = require('express');
const { requireAuth } = require('../middleware/requireAuth');
const { getMesQuiz } = require('../controllers/quizController');

const router = express.Router();
router.get('/', requireAuth, getMesQuiz);   // afficher les quiz de l'enseignant connecté

module.exports = router;