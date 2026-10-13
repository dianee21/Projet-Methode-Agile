// Importation des fonctions nécessaires pour l'authentification
const { findByUsername, updateLastLogin } = require('../models/userModel');
const { verifyPassword } = require('../services/passwordService');
const { startUserSession } = require('../services/sessionService');

// Fonction pour connecter un enseignant
async function login(req, res, next) {
    try{
        const { nom_utilisateur, password } = req.body;     // Récupérer les informations envoyées par le formulaire
        const user = await findByUsername(nom_utilisateur); // Rechercher l'utilisateur dans la base de données

        // Vérifier si l'utilisateur existe
        if(!user) {
            return res.status(401).json({
                message: "Ce compte n'existe pas."
            });
        }

        // Vérifier si le mot de passe est correct
        if (!(await verifyPassword(password, user.mot_de_passe))) {
            return res.status(401).json({
                message: "Le mot de passe est incorrect."
            });
        }

        if(user.role !== 'enseignant') {
            return res.status(403).json({
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
        return res.status(200).json({
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