// Je vérifie les informations d'une question avant son enregistrement.
function validateQuestion(data) {
  const errors = {};
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, errors: { body: 'La question doit être un objet.' } };
  }
  if (typeof data.enonce !== 'string' || !data.enonce.trim()) {
    errors.enonce = 'L’énoncé est obligatoire.';
  } else if (data.enonce.trim().length > 5000) {
    errors.enonce = 'L’énoncé est trop long (5000 caractères maximum).';
  }
  if (data.type !== 'qcm' && data.type !== 'vrai_faux') {
    errors.type = 'Le type doit être qcm ou vrai_faux.';
  }
  if (!Array.isArray(data.reponses)) {
    errors.reponses = 'Les réponses doivent être un tableau.';
  } else {
    const n = data.reponses.length;
    if (n < 2 || n > 5) errors.reponses = 'Il faut entre 2 et 5 réponses.';
    if (data.type === 'vrai_faux' && n !== 2) errors.reponses = 'Vrai/Faux demande exactement 2 réponses.';
    let nbCorrectes = 0;
    data.reponses.forEach((r, i) => {
      if (!r || typeof r !== 'object' || Array.isArray(r)) {
        errors[`reponses.${i}`] = 'Réponse invalide.';
        return;
      }
      if (typeof r.texte !== 'string' || !r.texte.trim() || r.texte.trim().length > 255) {
        errors[`reponses.${i}.texte`] = 'Le texte doit contenir entre 1 et 255 caractères.';
      }
      if (typeof r.est_correcte !== 'boolean') {
        errors[`reponses.${i}.est_correcte`] = 'La valeur doit être true ou false.';
      } else if (r.est_correcte) nbCorrectes++;
    });
    if (nbCorrectes !== 1) errors.bonne_reponse = 'Il faut exactement une bonne réponse.';
    if (data.type === 'vrai_faux' && n === 2 && data.reponses.every(r => r && typeof r.texte === 'string')) {
      const labels = data.reponses.map(r => r.texte.trim().toLowerCase());
      if (!(labels.includes('vrai') && labels.includes('faux'))) {
        errors.reponses_vrai_faux = 'Les réponses doivent être Vrai et Faux.';
      }
    }
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

module.exports = { validateQuestion };
