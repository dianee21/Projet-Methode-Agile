// Importation des fonctions nécessaires pour l'authentification
const { findByUsername, updateLastLogin, updatePassword } = require('../models/userModel');
const { verifyPassword, hashPassword } = require('../services/passwordService');
const { startUserSession } = require('../services/sessionService');

// Fonction pour connecter un enseignant
async function login(req, res, next) {
    try {
        const { nom_utilisateur, password, role } = req.body;     // Récupérer les informations envoyées par le formulaire
        const user = await findByUsername(nom_utilisateur); // Rechercher l'utilisateur dans la base de données

        // Vérifier si l'utilisateur existe
        if (!user) {
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

        if (user.role !== role) {
            return res.status(403).json({
                message: role === 'etudiant'
                    ? "Ce compte n'est pas un compte étudiant."
                    : "Ce compte n'est pas un compte enseignant."
            });s
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

async function resetPassword(req, res, next) {
    try {
        const { nom_utilisateur, nouveau_mot_de_passe } = req.body;

        if (typeof nom_utilisateur !== 'string' || !nom_utilisateur.trim()) {
            return res.status(400).json({ message: "Le nom d'utilisateur est obligatoire." });
        }

        if (typeof nouveau_mot_de_passe !== 'string' || !nouveau_mot_de_passe
            || nouveau_mot_de_passe.length > 50
            || !/[A-Z]/.test(nouveau_mot_de_passe)) {
            return res.status(400).json({
                message: "Le mot de passe doit contenir une majuscule (50 caractères maximum)."
            });
        }

        const user = await findByUsername(nom_utilisateur.trim());

        if (!user) {
            return res.status(404).json({ message: "Ce compte n'existe pas." });
        }

        const hash = await hashPassword(nouveau_mot_de_passe);
        await updatePassword(user.id, hash);

        return res.status(200).json({ message: "Mot de passe changé.", success: true });
    } catch (error) {
        next(error);
    }
}

// Exporter la fonction pour l'utiliser dans authRoutes.js
module.exports = { login, resetPassword };