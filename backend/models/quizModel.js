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

// vérifie qu'il y a exactement une seule bonne réponse
function verifierBonneReponse(reponses) {
  const nbCorrectes = reponses.filter((r) => r.est_correcte).length;
  if (nbCorrectes !== 1) throw new Error('Il faut choisir exactement une bonne réponse.');
}
const MAX_REPONSES = 5;
// Vérifie les réponses avant d'enregistrer : 2 à 5 réponses, Vrai/Faux = 2, une seule bonne
function verifierReponses(type, reponses) {
  if (!Array.isArray(reponses)) throw new Error('Les réponses sont obligatoires.');
  if (type === 'vrai_faux' && reponses.length !== 2) throw new Error('Une question Vrai/Faux a exactement 2 réponses.');
  if (reponses.length < 2 || reponses.length > MAX_REPONSES) throw new Error(`Il faut entre 2 et ${MAX_REPONSES} réponses.`);
  verifierBonneReponse(reponses);
}
// ajoute une question et ses réponses d'un seul coup
//  si une réponse plante, rien n'est enregistrer 
async function addQuestion(quizId, enonce, type, reponses) {
  verifierReponses(type, reponses);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.execute(
      'INSERT INTO questions (quiz_id, enonce, type) VALUES (?, ?, ?)',
      [quizId, enonce, type]
    );
    for (const r of reponses) {
      await conn.execute(
        'INSERT INTO reponses (question_id, texte, est_correcte) VALUES (?, ?, ?)',
        [result.insertId, r.texte, r.est_correcte ? 1 : 0]
      );
    }
    await conn.commit();
    return result.insertId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
module.exports = { createQuiz, findQuizById, verifierBonneReponse, addQuestion, MAX_REPONSES };