const formulaire = document.getElementById('formLogin');
const erreurNom = document.getElementById('erreurNom');
const erreurPassword = document.getElementById('erreurPassword');
const erreurGenerale = document.getElementById('erreurGenerale');

let roleChoisi = 'enseignant';
const onglets = document.querySelectorAll('.onglet');

onglets.forEach((onglet) => {
  onglet.addEventListener('click', () => {
    roleChoisi = onglet.dataset.role;

    onglets.forEach((autre) => {
      const actif = autre === onglet;
      autre.classList.toggle('actif', actif);
      autre.setAttribute('aria-selected', actif);
    });

    // Effacer les anciennes erreurs quand on change d'onglet
    erreurNom.textContent = '';
    erreurPassword.textContent = '';
    erreurGenerale.textContent = '';
  });
});

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
        password: motDePasse,
        role: roleChoisi
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
      if (donnees.user.role === 'etudiant') {
        window.location.href = '/html/dashboard-etudiant.html';
      } else {
        window.location.href = '/html/dashboard.html';
      }
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