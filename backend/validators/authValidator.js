// Je crée un modèle pour vérifier que le nom d'utilisateur contient seulement lettres, chiffres, point, tiret et souligné
const NOM_PATTERN = /^[A-Za-z0-9._-]+$/;
// Je crée une fonction pour vérifier les données envoyées lors de la connexion
function validateLogin(data) {
  const errors = {}; // Je garde ici les erreurs trouvées
  // Je vérifie qu'on m'a envoyé un objet de données et pas un tableau
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, errors: { body: 'Corps de requête invalide.' } };
  }
  // Je vérifie que le nom d'utilisateur est du texte et qu'il n'est pas vide
  if (typeof data.nom_utilisateur !== 'string' || !data.nom_utilisateur.trim()) {
    errors.nom_utilisateur = "Le nom d'utilisateur est obligatoire.";
  } else if (data.nom_utilisateur.trim().length > 50 || !NOM_PATTERN.test(data.nom_utilisateur.trim())) {
    // Je refuse un nom trop long ou qui contient des caractères interdits
    errors.nom_utilisateur = "Le nom d'utilisateur est invalide.";
  }
  // Je vérifie que le mot de passe est du texte et qu'il n'est pas vide
  if (typeof data.password !== 'string' || !data.password) {
    errors.password = 'Le mot de passe est obligatoire.';
  } else if (data.password.length > 1024) {
    // Je refuse un mot de passe trop long
    errors.password = 'Le mot de passe est trop long.';
  } else if (!/[A-Z]/.test(data.password)) {
    // Je refuse un mot de passe sans majuscule
    errors.password = 'Le mot de passe doit contenir une majuscule.';
  }

  // Je vérifie que le rôle est enseignant ou etudiant
  if (data.role !== 'enseignant' && data.role !== 'etudiant') {
    errors.role = 'Le rôle est invalide.';
  }

  // Je retourne si les données sont valides et la liste des erreurs
  return { valid: Object.keys(errors).length === 0, errors };
}
// Je crée un middleware que Christine pourra utiliser dans sa route de connexion
function validateLoginRequest(req, res, next) {
  const result = validateLogin(req.body); // Je vérifie les informations reçues
  // Si elles ne sont pas valides je retourne une erreur 400 avec les détails
  if (!result.valid) return res.status(400).json({ error: 'VALIDATION_ERROR', errors: result.errors });
  // Je retire les espaces autour du nom d'utilisateur
  // Je ne modifie pas le mot de passe car il doit rester exactement comme saisi
  req.body.nom_utilisateur = req.body.nom_utilisateur.trim();
  return next(); // Si tout va bien je passe à la suite de la route
}
// Je rends mes fonctions accessibles aux autres fichiers
module.exports = { validateLogin, validateLoginRequest };