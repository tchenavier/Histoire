const express = require('express'); // var expresse prend expresse pour le http
const app = express(); // instasie expresse
const mysql = require('mysql2');
const path = require('path');//fournit des utilitaires pour travailler avec les chemins de fichiers et de répertoires

require('dotenv').config();

const Utilisateur = process.env.Utilisateur;
const Mot_Passe = process.env.Mot_Passe;
const Table = process.env.Table;
const Adresse = process.env.Adresse;

const connection = mysql.createConnection({
    host: Adresse,//localhost si votre node est sur la même VM que votre Bdd
    user: Utilisateur,//non utilisateur
    password: Mot_Passe,//son mode de passe
    database: Table//table viser
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
//pour les route
app.get('/connexion.html', (req, res) => {//envois la page de connection
    const filePath = path.join(__dirname,'public','Connexion.html');
    // __dirname: répertoire du fichier JS actuel
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Erreur envoi fichier:', err);
        }
    });
});
app.post('/register', (req, res) => {
    console.log('Données reçues pour l\'inscription');
    console.log(req.body);
    connection.query( //sert a envoyer les donner au serveur
        'INSERT INTO utilisateur (`login`, `pasword`,`idRole`) VALUES (?,?,?)',
        [req.body.loginValue, req.body.passwordValue, req.body.idRoleValue],
        (err, results) => {
            if (err) {
                console.error('Erreur lors de l\'insertion dans la base de données :', err);
                res.status(500).json({ message: 'Erreur serveur' });
                return;
            }
            else {
                console.log('Insertion réussie, ID utilisateur :', results.insertId);
                res.json({ message: 'Inscription réussie !', userId: results.insertId });
            }

        }
    );
});

app.post('/connexion', (req, res) => {
    console.log(req.body);
    //on récupère le login et le password
    const { login, pasword } = req.body;
    connection.query('SELECT id,login,idRole FROM utilisateur WHERE login = ? AND pasword = ?', [login, pasword], (err, results) => {//Pour ne renvoyer que l'id le login et l'id du role
        if (err) {
            console.error('Erreur lors de la vérification des identifiants :', err);
            res.status(500).json({ message: 'Erreur serveur' });
            return;
        }
        if (results.length === 0) {
            res.status(401).json({ message: 'Identifiants invalides' });
            return;
        }
        // Identifiants valides 
        //renvoi les informations du user
        res.json({ message: 'Connexion réussie !', user: results[0] });
    });
});

app.get('/VerificationSenario', (req, res) => {
  connection.query('SELECT * FROM user', (err, results) => {// * pour tout selectionner
    if (err) {//si erreur
      console.error('Erreur lors de la récupération des utilisateurs :', err);
      res.status(500).json({ message: 'Erreur serveur' });
      return;//permet de pas exécuter se qui suit
    }
    res.json(results);//pas erreur
  });
});
app.post('/PassageSenario', (req, res) => {
    console.log(req.body);
    connection.query( //sert a envoyer les donner au serveur
        'INSERT INTO utilisateur (`login`, `pasword`,`idRole`) VALUES (?,?,?)',
        [req.body.loginValue, req.body.passwordValue, req.body.idRoleValue],
        (err, results) => {
            if (err) {
                console.error('Erreur lors de l\'insertion dans la base de données :', err);
                res.status(500).json({ message: 'Erreur serveur' });
                return;
            }
            else {
                console.log('Insertion réussie, ID utilisateur :', results.insertId);
                res.json({ message: 'Inscription réussie !', userId: results.insertId });
            }

        }
    );
});


app.listen(9000, () => { //express écoute sur le port 3000 et affiche un message dans la console
    console.log('server runing')
});  //Le poind virgule c'est juste pour dire la fin de la fonction
