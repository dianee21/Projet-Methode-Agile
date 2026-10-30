// Vérifier si l'enseignant est connecté
async function verifierConnexion() {
    try {
        // Demander au serveur si la session est valide
        const response = await fetch('/api/dashboard');

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
        await afficherMesQuiz();    // garde vérifierConnexion à la fin du fichier
    } catch (error) {
        console.error(error);
    }
}

 // Récupérer et afficher les quiz de l'enseignant connecté
async function afficherMesQuiz(){
    const listeQuiz = document.getElementById('listeQuiz');

    if (!listeQuiz) {
        return;
    }

    try {
        // Demander les quiz au backend
        const response = await fetch('/api/quiz');

        // Rediriger si la session n'est plus valide
        if (response.status === 401 || response.status === 403) {
            window.location.href = '/html/login.html';
            return;
        }

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des quiz.');
        }

        // Récupérer les données JSON
        const data = await response.json();

        // Vider la liste avant de la remplir
        listeQuiz.replaceChildren();

        // Aucun quiz enregistré
        if (data.quiz.length === 0) {
            listeQuiz.textContent = 'Vous n’avez pas encore créé de quiz.';
            return;
        }

        // Afficher chaque quiz
        data.quiz.forEach(quiz => {
            const carte = document.createElement('div');
            carte.classList.add('carte-quiz');

            const titre = document.createElement('h3');
            titre.textContent = quiz.titre;

            const description = document.createElement('p');
            description.textContent = quiz.description || 'Aucune description.';

            carte.appendChild(titre);
            carte.appendChild(description);

            listeQuiz.appendChild(carte);
        });

    } catch (error) {
        console.error(error);
        listeQuiz.textContent = 'Impossible de charger les quiz.';
    }
}

// Vérifier la connexion au chargement de la page
verifierConnexion();