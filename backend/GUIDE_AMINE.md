# Partie backend — Amine (pour validation avec l'équipe)

## Responsabilités livrées
- `.env.example` et `.gitignore` ; `config/db.js` : accès MySQL par pool.
- `validators/authValidator.js` : contrôle du corps de connexion.
- `services/passwordService.js` : hash et vérification bcrypt.
- `config/session.js` : configuration express-session.
- `services/sessionService.js` : création de session après connexion, destruction et handler de déconnexion.
- `tests/` : tests unitaires.

## Installer dans le VRAI dépôt
1. Copier le contenu de ce dossier `backend/` dans le dossier `backend/` EXISTANT en examinant chaque éventuel conflit. Ne remplacez ni `package.json`, ni les routes/contrôleurs de Christine.
2. Dans `backend`, à partir du `package.json` géré par PositiveBook377, installer `npm install express mysql2 dotenv bcrypt express-session` (à coordonner avec elle).
3. Copier `.env.example` vers `.env`, indiquer le VRAI `DB_NAME`, l'utilisateur et le mot de passe ; générer un secret avec `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
4. Importer la vraie base SQL du dossier `database` dans MySQL.
5. Lancer `node --test tests/*.test.js` depuis `backend/`.
6. Vérifier réellement MySQL avec `node scripts/check-db.js` depuis `backend/`.

## Interface à donner à Christine
```js
const pool = require('../config/db');
const { validateLoginRequest } = require('../validators/authValidator');
const { verifyPassword } = require('../services/passwordService');
const { startUserSession, logout } = require('../services/sessionService');
// Sur POST /login: validateLoginRequest, puis chercher l'utilisateur avec
// pool.execute('SELECT ... FROM users WHERE email = ?', [req.body.email]);
// Adapter SELECT et les noms de colonnes au schéma réel.
// Si verifyPassword(req.body.password, user.password_hash) === true :
// await startUserSession(req, user.id) ; puis réponse JSON.
// POST /logout: router.post('/logout', logout) ; à protéger contre le CSRF.
```
Dans app.js (chez Christine ou responsable de l'intégration), AVANT ses routes :
```js
const express = require('express');
const { createSessionMiddleware } = require('./config/session');
const app = express();
app.use(express.json());
app.use(createSessionMiddleware());
// app.use('/api/auth', authRoutes);
```
### Décisions à prendre ensemble
- Vérifier table `users`, noms de colonnes et stockage existant des mots de passe (hash bcrypt attendu). Si hashes différents, migration requise ; ne pas comparer du texte brut.
- Décider origine/frontend, CORS, cookie, `trust proxy`, CSRF (surtout déconnexion) et méthode de création de compte.
- `express-session` utilise MemoryStore PAR DÉFAUT : acceptable en développement local uniquement. En production, connecter un store persistant (ex. MySQL) et imposer HTTPS ; adapter SameSite et CORS selon les origines.
- Les routes et le contrôleur d'authentification, et la protection des routes privées appartiennent à Christine : absents volontairement.
- Ne jamais pousser `.env` ni des identifiants ; réaliser une Pull Request après revue collective.

## Limites de validation
Tests unitaires locaux ≠ connexion MySQL réelle et ≠ intégration du frontend. Le schéma GitHub n'a pas pu être lu, donc `DB_NAME` et colonnes restent à confirmer.
