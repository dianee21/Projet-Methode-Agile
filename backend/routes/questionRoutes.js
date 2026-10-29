const express = require('express');
const { requireAuth } = require('../middleware/requireAuth');
const { requireTeacher } = require('../middleware/requireTeacher');
const { createQuestion, listQuestions } = require('../controllers/questionController');

const router = express.Router();
// Je protège les deux routes : connexion et rôle enseignant obligatoires.
router.use(requireAuth, requireTeacher);
router.post('/:quizId/questions', createQuestion);
router.get('/:quizId/questions', listQuestions);
module.exports = router;
