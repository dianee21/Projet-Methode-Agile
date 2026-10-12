// Vérifier si l'utilisateur connecté
function requireAuth(req, res, next) {
    //Vérifier si une session existe avec un identifiant utilisateur
    if(!req.session || !req.session.userId) {
        return res.json({
            message: "Vous devez être connecté pour accéder à cette page."
        });
    }

    // Autoriser l'accès si l'utilisateur est connecté
    next();
}

// Exporter le middleware pour protéger les routes privées
module.exports = { requireAuth };