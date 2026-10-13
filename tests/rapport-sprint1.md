A)
Vérifications initiales:
1. Installation des dépendances avec npm install - Réussi
2. Démarrage initial avec node server.js - Échoué
3. Démarrage après la copie de .env.example vers .env - Réussi
4. Affichage de la page connexion - Absent/Bloqué
5. Connexion à la base avec npm run check-db - Échoué
6. Tests automatiques avec npm test - 12 tests Réussi

Ajustements
1. Remplacements de dirname par __dirname dans backend/app.js
2. Création du fichier de configuration local .env à partir de .env.example
3. Le fichier .env ne doit pas être ajouté au dépôt Git

Problèmes ou blocages
1. Page de connexion absente
2. Connexion à la base impossible

Tests restant à effectuer
- Connexion avec le compte enseignant de test
- Refus des champs obligatoires vides
- Refus d'un mauvais mot de passe
- Refus d'un identifiant inexistant
- Affichage d'un tableau de bord après connexion
- Refus d'accès au tableau de bord sans authentification
- Maintien de la session après actualisation
- Déconnexion et refus d'accès après déconnexion
- Blocage après trois échecs et déblocages après cinq minutes
- Vérification des intructions d'installation

B)
Nouvelles vérifications après mise à jour
- Installations des dépendances - Réussi
- Test automatiques - 12 Réussi
- La page de connexion est maintenant présente dans le dépôt
- La connexion à la base fonctionne 

C)
1. Affichage de la page de connexion - Réussi
2. Connexion avec le compte enseignant - Réussi
3. Refus de deux champs vides avec messages de validation - Réussi
4. Refus d'un mauvais mot de passe avec message d'erreur - Réussi
5. Affichage du tableau de bord après connexion - Réussi
6. Refus d'accès au tableau de bord sans authentification - Réussi
7. Maintien de la session après actualisation - Réussi
8. Déconnexion - Réussi


