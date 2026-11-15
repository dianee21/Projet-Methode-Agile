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
        await afficherQuizDisponibles();    // garde vérifierConnexion à la fin du fichier

    } catch (error) {
        console.error(error);
    }
}
// Récupérer et afficher les quiz publiés
async function afficherQuizDisponibles() {
    const listeQuiz = document.getElementById('listeQuiz');
    if (!listeQuiz) {
        return;
    }
    try {
        // Demander les quiz publiés au backend
        const response = await fetch('/api/etudiant/quiz');
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
        // Aucun quiz publié
        if (data.quiz.length === 0) {
            listeQuiz.textContent = 'Aucun quiz disponible pour le moment.';
            return;
        }
        // Afficher chaque quiz : un clic ouvre la page publique du quiz
        data.quiz.forEach(quiz => {
            const carte = document.createElement('a');
            carte.classList.add('carte-quiz', 'lien-quiz');
            carte.href = `/html/quiz-etudiant.html?id=${quiz.id}`;
            const titre = document.createElement('h3');
            titre.textContent = quiz.titre;
            const description = document.createElement('p');
            description.textContent = quiz.description || 'Aucune description.';
            const enseignant = document.createElement('p');
            enseignant.textContent = `Enseignant : ${quiz.enseignant}`;
            carte.appendChild(titre);
            carte.appendChild(description);
            carte.appendChild(enseignant);
            listeQuiz.appendChild(carte);
        });
    } catch (error) {
        console.error(error);
        listeQuiz.textContent = 'Impossible de charger les quiz.';
    }
}


// Vérifier la connexion au chargement de la page
verifierConnexion();