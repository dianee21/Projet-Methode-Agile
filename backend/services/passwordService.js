// Je dois avoir bcrypt installé pour utiliser ce fichier
const bcrypt = require('bcrypt'); // J'importe bcrypt pour protéger les mots de passe
const SALT_ROUNDS = 12; // Je choisis le facteur de coût de bcrypt
// Je crée une fonction pour transformer un mot de passe en empreinte
async function hashPassword(plainPassword) {
  // Je vérifie que le mot de passe est du texte, non vide et pas trop long
  if (typeof plainPassword !== 'string' || plainPassword.length === 0 || plainPassword.length > 72) {
    throw new TypeError('Mot de passe invalide (bcrypt accepte au maximum 72 octets utiles).');
  }
  // Je vérifie aussi la longueur en octets parce que bcrypt utilise 72 octets maximum
  if (Buffer.byteLength(plainPassword, 'utf8') > 72) {
    throw new TypeError('Mot de passe trop long pour bcrypt (72 octets maximum).');
  }
  return bcrypt.hash(plainPassword, SALT_ROUNDS); // Je retourne l'empreinte créée par bcrypt
}
// Je crée une fonction pour vérifier le mot de passe saisi
async function verifyPassword(plainPassword, storedHash) {
  // Je refuse les valeurs qui ne sont pas du texte et les empreintes mal formatées
  if (typeof plainPassword !== 'string' || typeof storedHash !== 'string' || !/^\$2[aby]\$\d{2}\$/.test(storedHash)) return false;
  return bcrypt.compare(plainPassword, storedHash); // Je compare le mot de passe avec son empreinte
}
// Je rends mes deux fonctions accessibles aux autres fichiers
module.exports = { hashPassword, verifyPassword };
