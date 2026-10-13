const formulaire = document.getElementById('formLogin');
const erreurNom = document.getElementById('erreurNom');
const erreurPassword = document.getElementById('erreurPassword');
const erreurGenerale = document.getElementById('erreurGenerale');

formulaire.addEventListener('submit', async (evenement) => {
  evenement.preventDefault();

  erreurNom.textContent = '';
  erreurPassword.textContent = '';
  erreurGenerale.textContent = '';

  const nomUtilisateur = document.getElementById('nom_utilisateur').value.trim();
  const motDePasse = document.getElementById('password').value;

  if (!nomUtilisateur) {
    erreurNom.textContent = "Le nom d'utilisateur est obligatoire.";
  }

  if (!motDePasse) {
    erreurPassword.textContent = 'Le mot de passe est obligatoire.';
  }

  if (erreurNom.textContent || erreurPassword.textContent) {
    return;
  }

  try {
    const reponse = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom_utilisateur: nomUtilisateur,
        password: motDePasse
      })
    });

    const donnees = await reponse.json();

    if (donnees.errors) {
      erreurNom.textContent = donnees.errors.nom_utilisateur || '';
      erreurPassword.textContent = donnees.errors.password || '';
      erreurGenerale.textContent = donnees.errors.body || '';
      return;
    }

    if (!reponse.ok) {
      erreurGenerale.textContent = donnees.message || 'Connexion impossible.';
      return;
    }

    if (donnees.user) {
      window.location.href = '/html/dashboard.html';
      return;
    }

    erreurGenerale.textContent = donnees.message || 'Connexion impossible.';
  } catch (erreur) {
    console.error('Erreur pendant la connexion :', erreur);
    erreurGenerale.textContent = 'Impossible de se connecter au serveur.';
  }
});


const champPassword = document.getElementById('password');
const boutonOeil = document.getElementById('boutonOeil');

function afficherMotDePasse() {
  champPassword.type = 'text';
}

function cacherMotDePasse() {
  champPassword.type = 'password';
}

boutonOeil.addEventListener('pointerdown', (evenement) => {
  evenement.preventDefault();   // garde le curseur dans le champ
  afficherMotDePasse();
});

boutonOeil.addEventListener('pointerup', cacherMotDePasse);
boutonOeil.addEventListener('pointerleave', cacherMotDePasse);
boutonOeil.addEventListener('pointercancel', cacherMotDePasse);
boutonOeil.addEventListener('contextmenu', (evenement) => evenement.preventDefault());