// Vérifier si l'enseignant est connecté
async function verifierConnexion() {
    try {
        // Demander au serveur si la session est valide
        const response = await fetch('/api/dashboard-etudiant');

        // Rediriger si l'utilisateur n'est pas connecté
          if (response.status === 401 || response.status === 403) { 
            window.location.href = '/html/login.html';
            return;
        }

        // Vérifier si une autre erreur est survenue
        if (!response.ok) {
            throw new Error('Erreur lors de la vérification de la connexion.');
        }

        // Récupérer la réponse du serveur
        const data = await response.json();

        console.log(data.message);
    } catch (error) {
        console.error(error);
    }
}

// Vérifier la connexion au chargement de la page
verifierConnexion();