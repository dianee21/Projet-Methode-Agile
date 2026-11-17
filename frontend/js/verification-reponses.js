// Trouver les questions qui n'ont pas encore de réponse cochée
// Chaque question est dans une div .carte-question avec ses boutons radio
// Retourne la liste des cartes de question sans réponse
function questionsSansReponse() {
    const cartes = document.querySelectorAll('.carte-question');

    return Array.from(cartes).filter(carte =>
        !carte.querySelector('input[type="radio"]:checked')
    );
}