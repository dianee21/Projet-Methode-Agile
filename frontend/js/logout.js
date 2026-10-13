// Récupérer le bouton de déconnexion
const logoutBtn = document.getElementById('logoutBtn');

// Vérifier que le bouton existe
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            //Envoyer une demande de déconnexion au serveur
            const response = await fetch('/api/auth/logout', {
                method: 'POST'
            });

            // Vérifier que la déconnexion a réussi
            if (!response.ok) {
                throw new Error('Erreur lors de la déconnexion.');
            }

            // Rediriger l'utilisateur vers la page de connexion
            window.location.href = '/html/login.html'
        } catch (error) {
            // Afficher une erreur si la déconnexion échoue
            console.error(error);
            alert('Impossible de se déconnecter.');
        }
    });
}