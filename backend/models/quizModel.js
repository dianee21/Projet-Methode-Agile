// Requêtes SQL sur les quiz, les questions et les réponses

// crée un quiz pour un enseignant, renvoie l'id du nouveau quiz
async function createQuiz(enseignantId, titre, description) {
  const [result] = await pool.execute(
    'INSERT INTO quiz (enseignant_id, titre, description) VALUES (?, ?, ?)',
    [enseignantId, titre, description || null]
  );
  return result.insertId;
}

// Trouve un quiz seulement s'il appartient au prof (sinon null)
async function findQuizById(quizId, enseignantId) {
  const [rows] = await pool.execute(
    'SELECT id, titre, description, date_creation FROM quiz WHERE id = ? AND enseignant_id = ? LIMIT 1',
    [quizId, enseignantId]
  );
  return rows[0] || null;
}

module.exports = { createQuiz, findQuizById };