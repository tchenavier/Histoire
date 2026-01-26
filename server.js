const express = require('express'); // var expresse prend expresse pour le http
const app = express(); // instasie expresse
const mysql = require('mysql2');
/*require('dotenv').config();
const Utilisateur = process.acce.env.Utilisateur;
const Mot_Passe = process.acce.env.Mot_Passe;
const Table = process.acce.env.Table;
const Adresse = process.acce.env.Adresse;*/

const connection = mysql.createConnection({
    host: '172.29.18.130',//localhost si votre node est sur la même VM que votre Bdd
    user: '',//non utilisateur
    password: '',//son mode de passe
    database: 'Teste'//table viser
    /*host: Adresse,//localhost si votre node est sur la même VM que votre Bdd
    user: Utilisateur,//non utilisateur
    password: Mot_Passe,//son mode de passe
    database: Table//table viser*/
});

connection.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
        return;
    }
    console.log('Connecté à la base de données MySQL.');
});

app.use(express.static('public'));
app.use(express.json());