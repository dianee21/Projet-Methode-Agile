const { createQuiz } = require('../models/quizModel');

// Je cree un quiz pour l'enseignant connecte
async function creerQuiz(req, res, next) {
  try {
    const { titre, description } = req.body || {};

    // Je verifie le titre
    if (typeof titre !== 'string' || !titre.trim() || titre.trim().length > 150) {
      return res.status(400).json({ message: 'Le titre est obligatoire (150 caracteres maximum).' });
    }

    // Je verifie la description si elle est fournie
    if (description != null && typeof description !== 'string') {
      return res.status(400).json({ message: 'La description doit etre du texte.' });
    }

    // Je recupere l'enseignant depuis la session, puis je cree le quiz
    const enseignantId = req.session.userId;
    const id = await createQuiz(enseignantId, titre.trim(), description?.trim() || null);
    return res.status(201).json({
      message: 'Quiz cree avec succes.',
      quiz: { id, titre: titre.trim(), description: description?.trim() || null }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { creerQuiz };
