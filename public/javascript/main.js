var TextInitial = document.getElementById("TextInitial");


TextInitial.addEventListener("DOMContentLoaded", verification);



function verification(evenement) {
   var utilisateur = localStorage.getItem('userId');//récuperation de l'id en localStorage;
    if (utilisateur != null)//verifit si le joueur et connecter
    {

        evenement.target.innerHTML = "Bien que l'histoire commence...";
    }
    else {
        evenement.target.innerHTML = "Connecter vous d'abord";
    }

}