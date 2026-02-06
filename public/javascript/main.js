var utilisateur = localStorage.getItem('userId');//récuperation de l'id en localStorage;
var TextInitial = document.getElementById("TextInitial");


TextInitial.addEventListener("DOMContentLoaded", verification);



function verification(evenement) {
    utilisateur = localStorage.getItem('userId');
    if (utilisateur != null)//verifit si le joueur et connecter
    {

        evenement.target.innerHTML = "Bien que l'histoire commence...";
    }
    else {
        evenement.target.innerHTML = "Connecter vous d'abord";
    }

}