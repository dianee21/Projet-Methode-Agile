const express = require('express');
const { requireAuth } = require('../middleware/requireAuth');
const { requireRole } = require('../middleware/requireRole');
const { creerQuiz } = require('../controllers/quizCreationController');

const router = express.Router();

// Je reserve la creation des quiz aux enseignants connectes
router.post('/', requireAuth, requireRole('enseignant'), creerQuiz);

module.exports = router;
