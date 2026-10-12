// Importation des fonctions nécessaires pour l'authentification
const { findByUsername, updateLastLogin } = require('../models/userModel');
const { verifyPassword } = require('../services/passwordService');
const { startUserSession } = require('../services/sessionService');

// Fonction pour connecter un enseignant
async function login(req, res, next) {
    try{
        const { nom_utilisateur, mot_de_passe } = req.body; // Récupérer les informations envoyées par le formulaire
        const user = await findByUsername(nom_utilisateur); // Rechercher l'utilisateur dans la base de données

        // Vérifier si l'utilisateur existe et si son mot de passe est correct
        if(!user || !(await verifyPassword(mot_de_passe, user.mot_de_passe))) {
            return res.json({
                message: "Nom d’utilisateur ou mot de passe incorrect."
            });
        }

        if(user.role !== 'enseignant') {
            return res.json({
                message: "Accès réservé aux enseignants."
            });
        }

        // Créer une session pour l'utilisateur
        await startUserSession(req, user.id);

        // Enregistrer la date de la dernière connexion 
        try {
            await updateLastLogin(user.id);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la dernière connexion: ', error);
        }

        // Confirmer la connexion sans retourner le mot de passe
        return res.json({
            message: "Connexion réussie.",
            user: {
                id: user.id,
                nom_utilisateur: user.nom_utilisateur,
                prenom: user.prenom,
                nom: user.nom,
                role: user.role
            }
        });
    } catch (error) {
        // Transmettre les erreurs au gestionnaire d'erreurs Express
        next(error);
    }
}

// Exporter la fonction pour l'utiliser dans authRoutes.js
module.exports = { login };