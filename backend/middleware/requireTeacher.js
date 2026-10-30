const pool = require('../config/db');

// Je vérifie le rôle dans MySQL : je ne fais pas confiance à un rôle envoyé par le navigateur.
async function requireTeacher(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Vous devez être connecté.' });
  }
  try {
    const [rows] = await pool.execute('SELECT role FROM users WHERE id = ? LIMIT 1', [req.session.userId]);
    if (!rows.length || rows[0].role !== 'enseignant') {
      return res.status(403).json({ message: 'Accès réservé aux enseignants.' });
    }
    return next();
  } catch (error) {
    return next(error);
  }
}
module.exports = { requireTeacher };
