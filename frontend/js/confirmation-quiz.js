'use strict';
// Information temporaire enregistrée dans cet onglet, pas dans MySQL.
const texte = sessionStorage.getItem('confirmationQuiz');
sessionStorage.removeItem('confirmationQuiz');
const titre = document.getElementById('titreConfirmation');
const details = document.getElementById('detailsConfirmation');

if (!texte) {
    titre.textContent = 'Aucune confirmation disponible';
    details.textContent = 'Terminez un quiz depuis la page étudiante pour voir la confirmation.';
} else {
    try {
        const data = JSON.parse(texte);
        if (typeof data.titre !== 'string' || !Number.isInteger(data.nombreQuestions) || data.nombreQuestions < 1) {
            throw new Error('Confirmation invalide');
        }
        titre.textContent = 'Quiz terminé';
        details.textContent = 'Vous avez répondu aux ' + data.nombreQuestions + ' question(s) du quiz « ' + data.titre + ' ».';
    } catch (error) {
        titre.textContent = 'Confirmation indisponible';
        details.textContent = 'Les informations de confirmation sont invalides.';
    }
}
