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