document.addEventListener('DOMContentLoaded', () => {
    const btnConnexion = document.getElementById('loginButton1');
    const btnInscription = document.getElementById('loginButton1');
    const emailInput = document.getElementById('email'); // login
    const passwordInput = document.getElementById('password'); //mots de passe

        // dans les constantes, on recupere dans les informationss dans les ID si dessus.
    btnConnexion.addEventListener('click', async () => {
        const payload = {
            login: emailInput.value,
            pasword: passwordInput.value 
        };
        // quand le boutton connexion est cliqué il va vérifie si l'identifiant et le mots de passe sont bon.
         try {
            const response = await fetch('/connexion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.status === 202) {
                const data = await response.json();
                // On stocke les infos utilisateur pour les utiliser sur la page du jeu
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = 'visualNovel.html';
            } else {
                alert("Identifiants incorrects, mortel.");
            }
        } catch (error) {
            console.error("Erreur:", error);
        }
    });
});

     // --- FONCTION INSCRIPTION ---

    btnInscription.addEventListener('click', async () => {
        const payload = {
            loginValue: emailInput.value,
            passwordValue: passwordInput.value
        };

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error("Erreur:", error);
        }
    });

    