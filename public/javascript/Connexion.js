const loginButton = document.getElementById('loginButton');

loginButton.addEventListener('click', () => {
    const loginInput = document.getElementById('loginInput').value;
    const passwordInput = document.getElementById('passwordInput').value;

    fetch('/connexion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login: loginInput, pasword: passwordInput })
    }).then(response => response.json())
        .then(data => {
            alert(data.message);
            alert('ID utilisateur : ' + data.user.id);
            alert('login de utilisateur : ' + data.user.login);
            alert('idRole utilisateur : ' + data.user.idRole);
            localStorage.setItem('userId', data.user.id);//depose l'id en localStorage
            localStorage.setItem('userLogin', data.user.login);//depose du login en localStorage
            localStorage.setItem('userIdRole', data.user.idRole);//depose l'idRole en localStorage
        });
});