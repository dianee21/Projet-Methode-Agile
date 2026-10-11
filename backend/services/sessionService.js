// Christine pourra utiliser ces fonctions après avoir vérifié les identifiants
// Je crée une fonction qui régénère la session
function regenerate(req) {
  // J'attends que la session soit régénérée, si une erreur arrive je fais reject sinon resolve
  return new Promise((resolve, reject) => req.session.regenerate(err => err ? reject(err) : resolve()));
}
// Je crée une fonction qui sauvegarde la session
function save(req) {
  // J'attends la sauvegarde, si une erreur arrive je fais reject sinon resolve
  return new Promise((resolve, reject) => req.session.save(err => err ? reject(err) : resolve()));
}
// Je crée une fonction pour démarrer la session après la connexion
async function startUserSession(req, userId) {
  // Je vérifie que l'identifiant de l'utilisateur est présent
  if (userId === undefined || userId === null || userId === '') throw new TypeError('ID utilisateur requis');
  // Je vérifie que le système de sessions est installé
  if (!req.session) throw new Error('Middleware de session non installé');
  await regenerate(req); // Je régénère la session pour éviter la fixation de session
  req.session.userId = userId; // Je garde l'ID utilisateur dans la session, pas son mot de passe
  await save(req); // Je sauvegarde la nouvelle session
}
// Je crée une fonction pour détruire une session
function destroySession(req) {
  return new Promise((resolve, reject) => {
    if (!req.session) return resolve(); // Si aucune session n'existe je termine directement
    req.session.destroy(err => err ? reject(err) : resolve()); // Je détruis la session ou je signale une erreur
  });
}
// Christine pourra utiliser logout directement dans ses routes
// Je crée une fonction pour déconnecter l'utilisateur
async function logout(req, res, next) {
  try {
    await destroySession(req); // Je détruis la session de l'utilisateur
    // Je demande au navigateur de supprimer le cookie de session
    res.clearCookie('quiz.sid', { path: '/', httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' || process.env.SESSION_COOKIE_SECURE === 'true' });
    return res.status(200).json({ message: 'Déconnexion réussie.' }); // Je retourne un message de réussite
  } catch (error) { return next(error); } // Si une erreur arrive je la passe à Express
}
// Je rends mes fonctions accessibles aux autres fichiers
module.exports = { startUserSession, destroySession, logout };
