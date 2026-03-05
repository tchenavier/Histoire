document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const selectionScreen = document.getElementById('selection-screen');
    const gameInterface = document.getElementById('game-interface');
    const dialogueText = document.getElementById('dialogue-text');
    const speakerName = document.querySelector('.dialogue-container h4');
    const choiceContainer = document.querySelector('.choice-container');
    const btnResume = document.querySelector('.btn-resume');

    // Vérification de connexion et mise à jour de l'icône
    updateStatusIcon();

    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // Bouton pour reprendre là où on s'était arrêté
    btnResume.addEventListener('click', () => {
        loadStoryStep();
    });

    // Fonction pour charger une étape de l'histoire
    async function loadStoryStep() {
        try {
            const response = await fetch('/Texte', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login: user.login, id: user.id })
            });

            if (response.ok) {
                const data = await response.json();
                renderGame(data);
            }
        } catch (error) {
            console.error("Erreur lors du chargement de l'histoire:", error);
        }
    }

    // Affiche les données à l'écran
    function renderGame(data) {
        selectionScreen.style.display = 'none';
        gameInterface.style.display = 'block';

        const info = data.text[0]; // Texte, Ambiance, Audio
        const choix = data.Choix;   // Liste des choix

        // Mise à jour du décor et du texte
        if(info.ambiance) gameInterface.style.backgroundImage = `url('images/${info.ambiance}')`;
        speakerName.innerText = "Narrateur"; // Ou info.nom si tu ajoutes une colonne nom
        dialogueText.innerText = info.Texte;
        // On vide et on génère les boutons de choix

        choiceContainer.innerHTML = '';
        choix.forEach(c => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerText = c.choix;
            btn.onclick = () => selectChoice(c.SuitSenario);
            choiceContainer.appendChild(btn);
        });
    }
    // Envoie le choix au serveur pour passer au scénario suivant

    async function selectChoice(nextId) {
        try {
            const response = await fetch('/PassageSenario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    login: user.login, 
                    id: user.id, 
                    VerSenario: nextId 
                })
            });

            if (response.ok) {
                loadStoryStep(); // Recharge le nouveau texte après la mise à jour
            }
        } catch (error) {
            console.error("Erreur passage scénario:", error);
        }
    }

    function updateStatusIcon() {
        // Ajoute dynamiquement l'icône si elle n'existe pas
        let icon = document.getElementById('status-icon');
        if (!icon) {
            icon = document.createElement('div');
            icon.id = 'status-icon';
            document.body.appendChild(icon);
        }
        icon.className = user ? 'status-icon online' : 'status-icon offline';
    }
});

// Utilisé par les miniatures des chapitres
async function startGame(chapterId) {
    const user = JSON.parse(localStorage.getItem('user'));
    // On force le passage au scénario du chapitre choisi
    const response = await fetch('/PassageSenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: user.login, id: user.id, VerSenario: chapterId })
    });
    
    if(response.ok) {
        location.reload(); // Ou appeler loadStoryStep() directement
    }
}

document.addEventListener('DOMContentLoaded', () => {
        const logoutbtn = document.getElementById('logout-btn');

        logoutbtn.addEventListener('click', () => {
         localStorage.removeItem('user');
         window.location.href = 'index.html';
        });
});
//fonction anonyme qui permet de ce deconnecter et de supprimer le LocalStorage et de rediriger vers la page de connexion (index.html).