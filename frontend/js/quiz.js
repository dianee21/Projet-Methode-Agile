const MAX_REPONSES = 5;

// Mode modification : la page est ouverte avec ?id=12 (bouton Modifier du dashboard)
const quizId = new URLSearchParams(window.location.search).get('id');
const modeModification = quizId !== null;
let descriptionQuiz = null;        // la description du quiz est gardée telle quelle
let indexEnModification = null;    // question en cours de modification 
let titreGarde = '';               // titre du quiz gardé en mémoire (mode modification)

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

        // Bouton pour modifier cette question
        const actions = document.createElement('div');
        actions.className = 'actions-apercu';

        const boutonModifierQuestion = document.createElement('button');
        boutonModifierQuestion.type = 'button';
        boutonModifierQuestion.textContent = 'Modifier';
        boutonModifierQuestion.addEventListener('click', () => modifierQuestion(index));

        actions.append(boutonModifierQuestion);

        carte.append(titre, type, resultat, actions);
        apercuQuestions.appendChild(carte);
    });
}

// Vider le formulaire de question (retour à une nouvelle question)
function reinitialiserFormulaireQuestion() {
    document.getElementById('enonceQuestion').value = '';
    typeQuestion.value = 'qcm';
    indexEnModification = null;
    enregistrerQuestion.textContent = 'Enregistrer la question';
    initialiserReponses();
}

// Remettre une question de l'aperçu dans le formulaire pour la modifier
function modifierQuestion(index) {
    const question = questions[index];
    indexEnModification = index;

    document.getElementById('enonceQuestion').value = question.enonce;
    typeQuestion.value = question.type;
    initialiserReponses();

    // QCM : on recrée autant de lignes que de réponses
    if (question.type === 'qcm') {
        listeReponses.replaceChildren();
        question.reponses.forEach(reponse => creerChampReponse(reponse.texte));
        mettreAJourBouton();
    }

    // On coche la bonne réponse
    const ronds = listeReponses.querySelectorAll('input[type="radio"]');
    question.reponses.forEach((reponse, i) => {
        ronds[i].checked = reponse.est_correcte;
    });

    enregistrerQuestion.textContent = 'Mettre à jour la question';
    messageQuestion.textContent = `Modification de la question ${index + 1}.`;
    document.getElementById('enonceQuestion').focus();
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
        messageQuestion.textContent = 'Veuillez remplir tous les champs de réponse.';
        return;
    }

    if (reponses.filter(r => r.est_correcte).length !== 1) {
        messageQuestion.textContent = 'Sélectionnez exactement une bonne réponse.';
        return;
    }

    const question = {
        enonce,
        type: typeQuestion.value,
        reponses
    };

    let confirmation;

    if (indexEnModification === null) {
        questions.push(question);
        confirmation = 'Question ajoutée à l’aperçu.';
    } else {
        questions[indexEnModification] = question;
        confirmation = 'Question modifiée.';
    }

    reinitialiserFormulaireQuestion();
    afficherApercu();

    messageQuestion.textContent = confirmation;
});


// S2 - Valider et enregistrer le formulaire complet
const boutonPublier = document.getElementById('publierQuiz');
const messageCreation = document.getElementById('messageCreation');

// Mode modification : on change les textes de la page et on charge le quiz
if (modeModification) {
    document.title = 'Modifier le quiz - Collège Ahuntsic';
    document.querySelector('.carte-creation h1').textContent = 'Modifier le quiz';
    document.querySelector('.carte-creation > p').textContent =
        'Changez le titre, les questions ou les réponses, puis enregistrez.';
    boutonPublier.textContent = 'Enregistrer les modifications';
    chargerQuizAModifier();
}

// Aller chercher le quiz (titre, questions, réponses) et le mettre dans la page
async function chargerQuizAModifier() {
    try {
        const response = await fetch(`/api/quizzes/${quizId}/questions`);

        if (response.status === 401 || response.status === 403) {
            window.location.href = '/html/login.html';
            return;
        }

        if (!response.ok) {
            messageCreation.textContent = 'Quiz introuvable.';
            boutonPublier.disabled = true;
            return;
        }

        const data = await response.json();

        document.getElementById('titreQuiz').value = data.quiz.titre;
        descriptionQuiz = data.quiz.description;

        data.questions.forEach(question => {
            questions.push({
                enonce: question.enonce,
                type: question.type,
                reponses: question.reponses.map(r => ({
                    texte: r.texte,
                    est_correcte: r.est_correcte
                }))
            });
        });

        afficherApercu();

        // On remplit tout de suite le formulaire avec la première question
        if (questions.length > 0) {
            modifierQuestion(0);
        }
    } catch (error) {
        console.error(error);
        messageCreation.textContent = 'Impossible de charger le quiz.';
        boutonPublier.disabled = true;
    }
}

// Envoyer le quiz modifié au serveur (titre + toutes les questions)
async function enregistrerModifications(titre) {
    boutonPublier.disabled = true;
    messageCreation.textContent = 'Enregistrement en cours...';

    try {
        const response = await fetch(`/api/quiz/${quizId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titre,
                description: descriptionQuiz,
                questions
            })
        });

        if (response.status === 401 || response.status === 403) {
            window.location.href = '/html/login.html';
            return;
        }

        if (!response.ok) {
            const data = await response.json();
            messageCreation.textContent = data.message || 'Impossible d’enregistrer les modifications.';
            boutonPublier.disabled = false;
            return;
        }

        // Retour au Dashboard
        window.location.href = '/html/dashboard.html';
    } catch (error) {
        console.error(error);
        messageCreation.textContent = 'Impossible d’enregistrer les modifications.';
        boutonPublier.disabled = false;
    }
}

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

    // Modification d'un quiz existant : on envoie tout au serveur et on s'arrête ici
    if (modeModification) {
        if (indexEnModification !== null) {
            messageCreation.textContent =
                'Terminez d’abord la modification de la question.';
            return;
        }

        await enregistrerModifications(titre);
        return;
    }

    boutonPublier.disabled = true;
    messageCreation.textContent = 'Enregistrement en cours...';

    let nouveauQuizId = null;

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
        nouveauQuizId = dataQuiz.quiz.id;

        // Enregistrer chaque question et ses réponses
        for (const question of questions) {
            const responseQuestion = await fetch(
                `/api/quizzes/${nouveauQuizId}/questions`,
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

        messageCreation.textContent = nouveauQuizId === null
            ? 'Impossible de créer le quiz. Vérifiez votre connexion.'
            : 'Le quiz a été créé, mais certaines questions n’ont pas pu être enregistrées. Vérifiez-le avant de réessayer.';

    } finally {
        boutonPublier.disabled = false;
    }
});