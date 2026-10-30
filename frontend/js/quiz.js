const MAX_REPONSES = 5;

const typeQuestion = document.getElementById('typeQuestion');
const listeReponses = document.getElementById('listeReponses');
const ajouterReponse = document.getElementById('ajouterReponse');
const messageQuestion = document.getElementById('messageQuestion');

// Créer une ligne de réponse (bouton radio + texte)
function creerChampReponse(texte = '') {
    const ligne = document.createElement('div');
    ligne.classList.add('champ-reponse');

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'bonneReponse';

    const champ = document.createElement('input');
    champ.type = 'text';
    champ.placeholder = 'Réponse possible';
    champ.maxLength = 255;
    champ.value = texte;

    ligne.appendChild(radio);
    ligne.appendChild(champ);
    listeReponses.appendChild(ligne);
}

// Désactiver le bouton quand on a 5 réponses
function mettreAJourBouton() {
    const nombre = listeReponses.querySelectorAll('.champ-reponse').length;
    ajouterReponse.disabled = nombre >= MAX_REPONSES;
}

function initialiserReponses() {
    listeReponses.replaceChildren();
    messageQuestion.textContent = '';

    if (typeQuestion.value === 'vrai_faux') {
        creerChampReponse('Vrai');
        creerChampReponse('Faux');

        ajouterReponse.hidden = true;

        listeReponses.querySelectorAll('input[type="text"]')
            .forEach(input => input.readOnly = true);
    } else {
        creerChampReponse();
        creerChampReponse();

        ajouterReponse.hidden = false;
        mettreAJourBouton();
    }
}

// Clic sur « + Ajouter une réponse »
ajouterReponse.addEventListener('click', () => {
    const nombre = listeReponses.querySelectorAll('.champ-reponse').length;

    if (nombre >= MAX_REPONSES) {
        messageQuestion.textContent = 'Maximum 5 réponses par question.';
        return;
    }

    messageQuestion.textContent = '';
    creerChampReponse();
    mettreAJourBouton();
});

// Changer de type (QCM / Vrai-Faux) : on recommence les champs
typeQuestion.addEventListener('change', initialiserReponses);

initialiserReponses();


// S2 - Préparer les questions du quiz avant l'enregistrement
const questions = [];

const enregistrerQuestion = document.getElementById('enregistrerQuestion');
const apercuQuestions = document.getElementById('apercuQuestions');

// Afficher les questions dans le panneau d'aperçu
function afficherApercu() {
    apercuQuestions.replaceChildren();

    if (questions.length === 0) {
        apercuQuestions.textContent = 'Aucune question ajoutée.';
        return;
    }

    questions.forEach((question, index) => {
        const carte = document.createElement('div');
        carte.className = 'apercu-question';

        const titre = document.createElement('h3');
        titre.textContent = `Question ${index + 1} : ${question.enonce}`;

        const type = document.createElement('p');
        type.textContent = question.type === 'qcm' ? 'QCM' : 'Vrai/Faux';

        const bonneReponse = question.reponses.find(r => r.est_correcte);

        const resultat = document.createElement('p');
        resultat.textContent = `Bonne réponse : ${bonneReponse.texte}`;

        carte.append(titre, type, resultat);
        apercuQuestions.appendChild(carte);
    });
}

// Valider une question et ses réponses avant de l'ajouter
enregistrerQuestion.addEventListener('click', () => {
    const enonce = document.getElementById('enonceQuestion').value.trim();

    const lignes = [...listeReponses.querySelectorAll('.champ-reponse')];

    const reponses = lignes.map(ligne => ({
        texte: ligne.querySelector('input[type="text"]').value.trim(),
        est_correcte: ligne.querySelector('input[type="radio"]').checked
    }));

    messageQuestion.textContent = '';

    if (!enonce) {
        messageQuestion.textContent = 'Veuillez saisir un énoncé.';
        return;
    }

    if (enonce.length > 5000) {
        messageQuestion.textContent = 'L’énoncé est trop long.';
        return;
    }

    if (reponses.length < 2 || reponses.length > 5) {
        messageQuestion.textContent = 'Il faut entre 2 et 5 réponses.';
        return;
    }

    if (reponses.some(r => !r.texte || r.texte.length > 255)) {
        messageQuestion.textContent = 'Chaque réponse doit contenir une réponse.';
        return;
    }

    if (reponses.filter(r => r.est_correcte).length !== 1) {
        messageQuestion.textContent = 'Sélectionnez exactement une bonne réponse.';
        return;
    }

    questions.push({
        enonce,
        type: typeQuestion.value,
        reponses
    });

    document.getElementById('enonceQuestion').value = '';
    initialiserReponses();
    afficherApercu();

    messageQuestion.textContent = 'Question ajoutée à l’aperçu.';
});


// S2 - Valider et enregistrer le formulaire complet
const boutonPublier = document.getElementById('publierQuiz');
const messageCreation = document.getElementById('messageCreation');

boutonPublier.addEventListener('click', async () => {
    const titre = document.getElementById('titreQuiz').value.trim();

    messageCreation.textContent = '';

    // Vérifier le titre du quiz
    if (!titre || titre.length > 150) {
        messageCreation.textContent =
            'Veuillez saisir un titre valide (150 caractères maximum).';
        return;
    }

    // Vérifier qu'au moins une question a été ajoutée
    if (questions.length === 0) {
        messageCreation.textContent =
            'Veuillez ajouter au moins une question au quiz.';
        return;
    }

    boutonPublier.disabled = true;
    messageCreation.textContent = 'Enregistrement en cours...';

    let quizId = null;

    try {
        // Créer le quiz avec l'API d'Amine
        const responseQuiz = await fetch('/api/quizzes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titre,
                description: null
            })
        });

        if (!responseQuiz.ok) {
            throw new Error('La création du quiz a échoué.');
        }

        const dataQuiz = await responseQuiz.json();
        quizId = dataQuiz.quiz.id;

        // Enregistrer chaque question et ses réponses
        for (const question of questions) {
            const responseQuestion = await fetch(
                `/api/quizzes/${quizId}/questions`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(question)
                }
            );

            if (!responseQuestion.ok) {
                throw new Error('L’enregistrement d’une question a échoué.');
            }
        }

        // Confirmation
        messageCreation.textContent = 'Quiz enregistré avec succès !';

        // Retour au Dashboard
        window.location.href = '/html/dashboard.html';

    } catch (error) {
        console.error(error);

        messageCreation.textContent = quizId === null
            ? 'Impossible de créer le quiz. Vérifiez votre connexion.'
            : 'Le quiz a été créé, mais certaines questions n’ont pas pu être enregistrées. Vérifiez-le avant de réessayer.';

    } finally {
        boutonPublier.disabled = false;
    }
});
