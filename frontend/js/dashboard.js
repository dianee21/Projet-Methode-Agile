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
async function afficherMesQuiz() {
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
        for (const quiz of data.quiz) {
            const carte = document.createElement('div');
            carte.classList.add('carte-quiz');

            const titre = document.createElement('h3');
            titre.textContent = quiz.titre;
            carte.appendChild(titre);

            // Afficher la description si elle existe
            if (quiz.description) {
                const description = document.createElement('p');
                description.classList.add('description-quiz');
                description.textContent = quiz.description;
                carte.appendChild(description);
            }

            // Afficher le statut du quiz
            const statut = document.createElement('span');
            statut.classList.add('statut-quiz');
            if (quiz.statut === 'brouillon') {
                statut.classList.add('statut-brouillon');
                statut.textContent = 'Brouillon';
            } else if(quiz.statut === 'publie') {
                statut.classList.add('statut-publie');
                statut.textContent = 'Publié';
            }
            carte.appendChild(statut);

            const questions = await recupererQuestions(quiz.id);
            const listeQuestions = document.createElement('div');

            if (questions.length === 0) {
                listeQuestions.textContent = 'Aucune question ajoutée.';
            } else {
                questions.forEach((question, index) => {
                    const ligne = document.createElement('p');
                    const type = question.type === 'qcm'
                        ? 'QCM'
                        : 'Vrai/Faux';

                    ligne.textContent = `${index + 1}. ${question.enonce} (${type})`;
                    listeQuestions.appendChild(ligne);
                });
            }

            carte.appendChild(listeQuestions);
            carte.appendChild(creerBoutonsQuiz(quiz, carte));   // boutons Modifier et Supprimer
            listeQuiz.appendChild(carte);
        }

    } catch (error) {
        console.error(error);
        listeQuiz.textContent = 'Impossible de charger les quiz.';
    }
}

// Créer les boutons Modifier et Supprimer d'une carte de quiz
function creerBoutonsQuiz(quiz, carte) {
    const actions = document.createElement('div');
    actions.classList.add('actions-quiz');

    const boutonModifier = document.createElement('button');
    boutonModifier.type = 'button';
    boutonModifier.classList.add('bouton-modifier');
    boutonModifier.textContent = 'Modifier';
    // Ouvrir la page du quiz avec tout son contenu (titre, questions, réponses)
    boutonModifier.addEventListener('click', () => {
        window.location.href = `/html/quiz.html?id=${quiz.id}`;
    });

    const boutonSupprimer = document.createElement('button');
    boutonSupprimer.type = 'button';
    boutonSupprimer.classList.add('bouton-supprimer');
    boutonSupprimer.textContent = 'Supprimer';
    boutonSupprimer.addEventListener('click', () => afficherConfirmation(quiz, carte));

    actions.append(boutonModifier, boutonSupprimer);

    // afficher le bouton Publier seulement pour les brouillons
    if (quiz.statut === 'brouillon') {
        const boutonPublier = document.createElement('button');
        boutonPublier.type = 'button';
        boutonPublier.classList.add('bouton-publier');
        boutonPublier.textContent = 'Publier';
    
        boutonPublier.addEventListener('click', () => {
            publierQuiz(quiz.id, boutonPublier);
        });
    
        actions.appendChild(boutonPublier);
    }

    return actions;
}


// Publier un quiz
async function publierQuiz(quizId, bouton) {
    bouton.disabled = true;

    try {
        const response = await fetch(`/api/quiz/${quizId}/publier`, {
            method: 'PATCH'
        });

        if (response.status === 401 || response.status === 403) {
            window.location.href = '/html/login.html';
            return;
        }

        if (!response.ok) {
            throw new Error('Impossible de publier le quiz.');
        }

        // Actualiser la liste pour afficher le statut Publié
        await afficherMesQuiz();

    } catch (error) {
        console.error(error);
        alert('Impossible de publier le quiz.');
        bouton.disabled = false;
    }
}

// Fenêtre de confirmation avant de supprimer
function afficherConfirmation(quiz, carte) {
    const fenetre = document.createElement('dialog');
    fenetre.classList.add('fenetre-confirmation');

    const question = document.createElement('h2');
    question.textContent = 'Voulez-vous supprimer ce quiz ?';

    const nomQuiz = document.createElement('p');
    nomQuiz.classList.add('nom-quiz-fenetre');
    nomQuiz.textContent = `« ${quiz.titre} »`;

    const avertissement = document.createElement('p');
    avertissement.textContent = 'Cette action est irréversible.';

    const actions = document.createElement('div');
    actions.classList.add('actions-fenetre');

    const boutonOui = document.createElement('button');
    boutonOui.type = 'button';
    boutonOui.classList.add('bouton-supprimer');
    boutonOui.textContent = 'Oui, supprimer';
    boutonOui.addEventListener('click', async () => {
        await supprimerQuiz(quiz, carte, boutonOui);
        fenetre.close();
    });

    const boutonNon = document.createElement('button');
    boutonNon.type = 'button';
    boutonNon.classList.add('bouton-annuler');
    boutonNon.textContent = 'Non';
    boutonNon.addEventListener('click', () => fenetre.close());

    actions.append(boutonOui, boutonNon);
    fenetre.append(question, nomQuiz, avertissement, actions);

    // Quand la fenêtre se ferme, on l'enlève de la page
    fenetre.addEventListener('close', () => fenetre.remove());

    document.body.appendChild(fenetre);
    fenetre.showModal();
}

// Supprimer un quiz (bouton Supprimer)
async function supprimerQuiz(quiz, carte, bouton) {
    bouton.disabled = true;

    try {
        const response = await fetch(`/api/quiz/${quiz.id}`, { method: 'DELETE' });

        if (response.status === 401 || response.status === 403) {
            window.location.href = '/html/login.html';
            return;
        }

        if (!response.ok) {
            throw new Error('Suppression impossible.');
        }

        // On enlève la carte de la page
        carte.remove();

        const listeQuiz = document.getElementById('listeQuiz');
        if (listeQuiz.children.length === 0) {
            listeQuiz.textContent = 'Vous n’avez pas encore créé de quiz.';
        }
    } catch (error) {
        console.error(error);
        bouton.disabled = false;
        alert('Impossible de supprimer le quiz.');
    }
}

async function recupererQuestions(quizId) {
    const response = await fetch(`/api/quizzes/${quizId}/questions`);

    if (!response.ok) {
        throw new Error('Impossible de récupérer les questions.');
    }

    const data = await response.json();
    return data.questions;
}

// Vérifier la connexion au chargement de la page
verifierConnexion();