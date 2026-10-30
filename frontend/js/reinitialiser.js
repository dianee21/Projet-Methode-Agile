const formulaire = document.getElementById('formReset');
const erreurEmail = document.getElementById('erreurEmail');
const erreurNouveau = document.getElementById('erreurNouveau');
const erreurConfirmation = document.getElementById('erreurConfirmation');
const erreurGenerale = document.getElementById('erreurGenerale');

formulaire.addEventListener('submit', async (evenement) => {
    evenement.preventDefault();

    // Effacer les anciens messages
    erreurEmail.textContent = '';
    erreurNouveau.textContent = '';
    erreurConfirmation.textContent = '';
    erreurGenerale.textContent = '';

    const email = document.getElementById('email').value.trim();
    const nouveau = document.getElementById('nouveau_mdp').value;
    const confirmation = document.getElementById('confirmation').value;

    // 1. Cases vides : le message s'affiche sous la case
    if (!email) {
        erreurEmail.textContent = 'Le courriel est obligatoire.';
    }
    if (!nouveau) {
        erreurNouveau.textContent = 'Le nouveau mot de passe est obligatoire.';
    }
    if (!confirmation) {
        erreurConfirmation.textContent = 'La confirmation est obligatoire.';
    }

    if (erreurEmail.textContent || erreurNouveau.textContent || erreurConfirmation.textContent) {
        return;
    }

    // 2. Majuscule : le message s'affiche au-dessus du bouton
    if (!/[A-Z]/.test(nouveau)) {
        erreurGenerale.textContent = 'Le mot de passe doit contenir une majuscule.';
    }

    // 3. Mots de passe différents : le message s'affiche sous la case de confirmation
    if (confirmation !== nouveau) {
        erreurConfirmation.textContent = 'Les deux mots de passe sont différents.';
    }

    if (erreurGenerale.textContent || erreurConfirmation.textContent) {
        return;
    }

    // Envoyer la requête au serveur
    try {
        const reponse = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                nouveau_mot_de_passe: nouveau
            })
        });

        const donnees = await reponse.json();

        if (!reponse.ok || !donnees.success) {
            if (reponse.status === 404) {
                erreurEmail.textContent = donnees.message;
            } else {
                erreurGenerale.textContent = donnees.message || 'Changement impossible.';
            }
            return;
        }

        // Succès : retour direct à la page de connexion
        window.location.href = '/html/login.html';
    } catch (erreur) {
        console.error(erreur);
        erreurGenerale.textContent = 'Impossible de se connecter au serveur.';
    }
});

// Maintenir l'oeil pour voir le mot de passe, le relâcher pour le cacher
document.querySelectorAll('.champ-mdp').forEach((champ) => {
    const input = champ.querySelector('input');
    const bouton = champ.querySelector('.bouton-oeil');

    function afficher() {
        input.type = 'text';
    }

    function cacher() {
        input.type = 'password';
    }

    bouton.addEventListener('pointerdown', (evenement) => {
        evenement.preventDefault();
        afficher();
    });

    bouton.addEventListener('pointerup', cacher);
    bouton.addEventListener('pointerleave', cacher);
    bouton.addEventListener('pointercancel', cacher);
    bouton.addEventListener('contextmenu', (evenement) => evenement.preventDefault());
});