// J'importe les outils de test et les fonctions qui travaillent avec bcrypt
const test = require('node:test');
const assert = require('node:assert/strict');
const { hashPassword, verifyPassword } = require('../services/passwordService');

// Je vérifie que bcrypt crée une empreinte et accepte le bon mot de passe
test('bcrypt produit un hash et vérifie le bon mot de passe', async () => {
  const hashed = await hashPassword('MotDePasse!123');
  assert.notEqual(hashed,'MotDePasse!123'); // L'empreinte ne doit pas être le mot de passe original
  assert.equal(await verifyPassword('MotDePasse!123',hashed),true);
  assert.equal(await verifyPassword('Mauvais',hashed),false); // Un mauvais mot de passe doit être refusé
});
// Je vérifie que les mauvaises empreintes et les mots de passe trop longs sont refusés
test('refuse un hash invalide et un mot de passe trop long', async () => {
  assert.equal(await verifyPassword('abc','pas-un-hash'),false);
  await assert.rejects(hashPassword('a'.repeat(73)));
});
