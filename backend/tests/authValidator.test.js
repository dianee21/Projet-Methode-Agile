// J'importe l'outil de test de Node.js et les fonctions pour vérifier les résultats
const test = require('node:test');
const assert = require('node:assert/strict');
const { validateLogin, validateLoginRequest } = require('../validators/authValidator');

// Je vérifie qu'un courriel et un mot de passe valides sont acceptés
test('accepte un courriel et mot de passe valides', () => {
  assert.equal(validateLogin({email:'a@example.com',password:'abc123'}).valid, true);
});
// Je vérifie que les champs vides sont refusés
test('rejette les champs vides', () => {
  const result = validateLogin({email:'',password:''});
  assert.equal(result.valid, false);
  assert.ok(result.errors.email);
  assert.ok(result.errors.password);
});
// Je vérifie qu'un courriel mal écrit est refusé
test('rejette un courriel invalide', () => {
  assert.equal(validateLogin({email:'test',password:'123'}).valid, false);
});
// Je vérifie que les valeurs qui ne sont pas du bon type sont refusées
test('rejette un type invalide', () => {
  assert.equal(validateLogin({email: 10,password: []}).valid, false);
});
// Je vérifie que le middleware corrige le courriel sans changer le mot de passe
test('middleware normalise le courriel', () => {
  const req = {body:{email:'  Test@Example.com ',password:' abc '}};
  let called=false;
  validateLoginRequest(req, {}, () => {called=true});
  assert.equal(called,true);
  assert.equal(req.body.email,'test@example.com');
  assert.equal(req.body.password,' abc ');
});
