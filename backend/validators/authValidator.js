// Je crée un modèle pour vérifier qu'un courriel ressemble à une adresse valide
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Je crée une fonction pour vérifier les données envoyées lors de la connexion
function validateLogin(data) {
  const errors = {}; // Je garde ici les erreurs trouvées
  // Je vérifie qu'on m'a envoyé un objet de données et pas un tableau
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, errors: { body: 'Corps de requête invalide.' } };
  }
  // Je vérifie que le courriel est du texte et qu'il n'est pas vide
  if (typeof data.email !== 'string' || !data.email.trim()) {
    errors.email = 'Le courriel est obligatoire.';
  } else if (data.email.trim().length > 254 || !EMAIL_PATTERN.test(data.email.trim())) {
    // Je refuse un courriel trop long ou qui ne respecte pas le format
    errors.email = 'Le format du courriel est invalide.';
  }
  // Je vérifie que le mot de passe est du texte et qu'il n'est pas vide
  if (typeof data.password !== 'string' || !data.password) {
    errors.password = 'Le mot de passe est obligatoire.';
  } else if (data.password.length > 1024) {
    // Je refuse un mot de passe trop long
    errors.password = 'Le mot de passe est trop long.';
  }
  // Je retourne si les données sont valides et la liste des erreurs
  return { valid: Object.keys(errors).length === 0, errors };
}

// Je crée un middleware que Christine pourra utiliser dans sa route de connexion
function validateLoginRequest(req, res, next) {
  const result = validateLogin(req.body); // Je vérifie les informations reçues
  // Si elles ne sont pas valides je retourne une erreur 400 avec les détails
  if (!result.valid) return res.status(400).json({ error: 'VALIDATION_ERROR', errors: result.errors });
  // Je retire les espaces autour du courriel et je le mets en minuscules
  // Je ne modifie pas le mot de passe car il doit rester exactement comme saisi
  req.body.email = req.body.email.trim().toLowerCase();
  return next(); // Si tout va bien je passe à la suite de la route
}

// Je rends mes fonctions accessibles aux autres fichiers
module.exports = { validateLogin, validateLoginRequest };
