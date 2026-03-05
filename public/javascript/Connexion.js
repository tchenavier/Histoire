document.addEventListener('DOMContentLoaded', () => {
    const btnConnexion = document.getElementById('button1');
    const btnInscription = document.getElementById('button2');
    const emailInput = document.getElementById('email'); // Utilisé comme login
    const passwordInput = document.getElementById('password');

    // --- FONCTION CONNEXION ---
    btnConnexion.addEventListener('click', async () => {
        const payload = {
            login: emailInput.value,
            pasword: passwordInput.value // Respecte l'orthographe du serveur 'pasword'
        };

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
});