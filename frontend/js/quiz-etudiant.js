const titreQuiz = document.getElementById('titreQuiz');
const descriptionQuiz = document.getElementById('descriptionQuiz');
const etatQuiz = document.getElementById('etatQuiz');
const formulaireQuiz = document.getElementById('formulaireQuiz');
const questionsQuiz = document.getElementById('questionsQuiz');

function creerCarteQuestion(question){
    const carte = document.createElement('div');
    carte.className = 'carte-question';

    const groupe = document.createElement('fieldset');
    const enonce = document.createElement('legend');
    enonce.textContent = question.enonce;
    groupe.appendChild(enonce);

    for (const reponse of question.reponses) {
        const choix = document.createElement('label');
        const bouton = document.createElement('input');

        bouton.type = 'radio';
        bouton.name = `question-${question.id}`;
        bouton.value = reponse.id;

        choix.append(bouton, document.createTextNode(reponse.texte));
        groupe.appendChild(choix);
    }

    carte.appendChild(groupe);
    return carte;
}

async function chargerQuiz() {
    const parametres = new URLSearchParams(window.location.search);
    const id = parametres.get('id');

    if (!id || !/^[1-9]\d*$/.test(id)) {
        etatQuiz.textContent = 'Identifiant du quiz invalide.';
        return;
    }

    try {
        const reponse = await fetch(`/api/etudiant/quiz/${id}`);

        if (reponse.status === 401 || reponse.status === 403){
            window.location.replace('/html/login.html');
            return;
        }

        if (reponse.status === 404) {
            etatQuiz.textContent = "Ce quiz est introuvable ou n'est pas encore publié.";
            return;
        }

        if (!reponse.ok) {
            throw new Error('Erreur lors du chargement du quiz.');
        }

        const {quiz, questions} = await reponse.json();

        titreQuiz.textContent = quiz.titre;
        descriptionQuiz.textContent = quiz.description || '';
        descriptionQuiz.hidden = !quiz.description;

        if (questions.length === 0) {
            etatQuiz.textContent = 'Ce quiz ne contient aucune question.';
            return;
        }

        for (const question of questions) {
            questionsQuiz.appendChild(creerCarteQuestion(question));
        }

        etatQuiz.textContent = '';
        formulaireQuiz.hidden = false;
    } catch (erreur) {
        console.error(erreur);
        etatQuiz.textContent = 'Impossible de charger le quiz pour le moment.';
    }

}

chargerQuiz();