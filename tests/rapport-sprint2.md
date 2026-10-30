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

