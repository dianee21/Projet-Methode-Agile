// J'importe l'outil de test de Node.js et les fonctions pour vérifier les résultats
const test = require('node:test');
const assert = require('node:assert/strict');
const { validateLogin, validateLoginRequest } = require('../validators/authValidator');
// Je vérifie qu'un nom d'utilisateur et un mot de passe valides sont acceptés
test("accepte un nom d'utilisateur et mot de passe valides", () => {
  assert.equal(validateLogin({nom_utilisateur:'Farim',password:'Farim', role: 'enseignant'}).valid, true);
});
// Je vérifie que les champs vides sont refusés
test('rejette les champs vides', () => {
  const result = validateLogin({nom_utilisateur:'',password:''});
  assert.equal(result.valid, false);
  assert.ok(result.errors.nom_utilisateur);
  assert.ok(result.errors.password);
});
// Je vérifie qu'un nom avec des caractères interdits est refusé
test('rejette un nom invalide', () => {
  assert.equal(validateLogin({nom_utilisateur:"Farim' OR '1'='1",password:'123'}).valid, false);
});
// Je vérifie qu'un mot de passe sans majuscule est refusé
test('rejette un mot de passe sans majuscule', () => {
  const result = validateLogin({nom_utilisateur:'Farid',password:'farid'});
  assert.equal(result.valid, false);
  assert.ok(result.errors.password);
});
// Je vérifie que les valeurs qui ne sont pas du bon type sont refusées
test('rejette un type invalide', () => {
  assert.equal(validateLogin({nom_utilisateur: 10,password: []}).valid, false);
});
// Je vérifie que le middleware retire les espaces du nom sans changer le mot de passe
test("middleware nettoie le nom d'utilisateur", () => {
  const req = {body:{nom_utilisateur:'  Farim ',password:' Abc ', role: 'enseignant'}};
  let called=false;
  validateLoginRequest(req, {}, () => {called=true});
  assert.equal(called,true);
  assert.equal(req.body.nom_utilisateur,'Farim');
  assert.equal(req.body.password,' Abc ');
});