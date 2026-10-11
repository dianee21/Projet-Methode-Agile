// J'importe les outils de test et mes fonctions de gestion des sessions
const test = require('node:test');
const assert = require('node:assert/strict');
const { startUserSession, destroySession, logout } = require('../services/sessionService');

// Je crée une fausse requête pour tester les sessions sans démarrer Express
function fakeReq() {
  const req={};
  req.session = {
    regenerate(cb) {req.session={...req.session,save:cb2=>cb2(null),destroy:cb2=>cb2(null)}; cb(null);},
    save(cb){cb(null)}, destroy(cb){cb(null)}
  };
  return req;
}
// Je vérifie que la session est régénérée et qu'elle garde l'identifiant de l'utilisateur
test('session régénérée et ID utilisateur conservé', async () => {
 const req=fakeReq();
 await startUserSession(req,42);
 assert.equal(req.session.userId,42);
});
// Je vérifie qu'on refuse un identifiant d'utilisateur manquant
test('refuse ID utilisateur manquant', async () => {
 await assert.rejects(startUserSession(fakeReq(),null));
});
// Je vérifie qu'on peut détruire la session sans erreur
test('destruction de session', async () => {
 await destroySession(fakeReq());
});
// Je vérifie que la déconnexion supprime le cookie et retourne une réponse 200
test('déconnexion efface cookie et confirme', async () => {
 const req=fakeReq(); let cleared=false, code=0, body;
 const res={ clearCookie(name){assert.equal(name,'quiz.sid');cleared=true;},status(s){code=s;return this;},json(b){body=b;return this;}};
 await logout(req,res,(err)=>{throw err});
 assert.equal(cleared,true);assert.equal(code,200);assert.match(body.message,/Déconnexion/);
});
