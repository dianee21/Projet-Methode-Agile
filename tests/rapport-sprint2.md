A)
Vérifications du modèle des quiz et de la base de données:
1. Création d'un quiz associé à Farid
2. Refus de récupération de ce quiz avec un autre utilisateur
3. Ajout et lecture de deux questions (QCM et vrai/faux)
4. Vérification du nombre de réponses et de la bonne réponse
5. Refus de plus de cinq réponses
6. Refus de plusieurs bonnes réponses ou d'aucune bonne réponse
7. Refus d'un Vrai ou Faux avec trois choix
8. Vérification que les questions refusées ne sont pas enregistrées
9. Suppression des questions lors de la suppression du quiz

Limites:
Ces tests valident le modèle et ses échanges avec la base
La création de quiz depuis l'interface reste à tester.

Validation des relations entre les tables:
1. Question liée à un quiz inexistant: insertion refusée avec l'erreur 1452 - Réussi
2. Réponse liée à une question inexistante : insertion refusée avec l'erreur 1452 - Réussi
3. Suppression en cascade - Réussi
4. Quiz lié à un utilisateur inexistant: insertion refusée avec l'erreur 1452 - Réussi


B)
✔ accepte un nom d'utilisateur et mot de passe valides (1.098589ms)
✔ rejette les champs vides (0.238284ms)
✔ rejette un nom invalide (0.239687ms)
✔ rejette un mot de passe sans majuscule (0.161671ms)
✔ rejette un type invalide (0.211604ms)
✔ middleware nettoie le nom d'utilisateur (0.241661ms)
✔ bcrypt produit un hash et vérifie le bon mot de passe (792.704043ms)
✔ refuse un hash invalide et un mot de passe trop long (0.830125ms)
✔ QCM valide (1.705932ms)
✔ refuse un objet absent (0.248113ms)
✔ refuse un énoncé vide (0.278289ms)
✔ refuse plus de cinq réponses (0.261277ms)
✔ refuse deux bonnes réponses (0.430042ms)
✔ refuse zéro bonne réponse (0.216504ms)
✔ refuse un indicateur non booléen (0.27851ms)
✔ accepte Vrai/Faux (0.308806ms)
✔ refuse Vrai/Faux avec mauvais intitulés (0.314357ms)
✔ session régénérée et ID utilisateur conservé (1.959524ms)
✔ refuse ID utilisateur manquant (0.913243ms)
✔ destruction de session (0.299429ms)
✔ déconnexion efface cookie et confirme (0.540217ms)
ℹ tests 21
ℹ suites 0
ℹ pass 21
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1095.13039
