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
        ajouterReponse.disabled = false;
    }
}

initialiserReponses();