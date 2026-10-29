const { findById } = require('../models/userModel');

// Laisser passer seulement les utilisateurs ayant le bon rôle
function requireRole(role) {
    return async (req, res, next) => {
        try {
            const user = await findById(req.session.userId);

            if (!user || user.role !== role) {
                return res.status(403).json({
                    message: "Accès refusé."
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}

module.exports = { requireRole };