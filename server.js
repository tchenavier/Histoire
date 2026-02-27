const express = require('express'); // var expresse prend expresse pour le http
const app = express(); // instasie expresse
const mysql = require('mysql2');
const path = require('path');//fournit des utilitaires pour travailler avec les chemins de fichiers et de répertoires
const { BroadcastChannel } = require('worker_threads');

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
app.post('/register', (req, res) => { //enregistrement des utilisateur
    console.log('Données reçues pour l\'inscription');
    console.log(req.body);
    connection.query( //sert a envoyer les donner au serveur
        'INSERT INTO utilisateur (`login`, `pasword`) VALUES (?,?)',
        [req.body.loginValue, req.body.passwordValue],
        (err, results) => {
            if (err) {
                console.error('Erreur lors de l\'insertion dans la base de données :', err);
                res.status(500).json({ message: 'Erreur serveur' });
                return;
            }
            else {
                console.log('Insertion réussie, ID utilisateur :', results.insertId);
                res.status(200).json({ message: 'Inscription réussie !', userId: results.insertId });
                return;
            }

        }
    );
});

app.post('/connexion', (req, res) => {
    console.log(req.body);
    //on récupère le login et le password
    const { login, pasword } = req.body;
    connection.query('SELECT id,login FROM utilisateur WHERE login = ? AND pasword = ?', [login, pasword], (err, results) => {//Pour ne renvoyer que l'id le login et l'id du role
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
        res.status(202).json({ user: results[0] });
        const filePath = path.join(__dirname, 'public', 'visualNovel.html');//envois la page du jeu
        // __dirname: répertoire du fichier JS actuel
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Erreur d envoi du fichier:', err);
            }
        });
    });
});

app.post('/VerificationSenario', (req, res) => { //Pour le passage
    console.log(req.body);
    //on récupère le login et le password
    const { login, id, VerSenario, idSenario } = req.body;
    connection.query('SELECT idSenarioEnCours FROM utilisateur WHERE login = ? AND id = ?', [login, id], (err, results) => {// * pour tout selectionner
        if (err) {//si erreur
            console.error('Erreur lors de la récupération des utilisateurs :', err);
            res.status(500).json({ message: 'Erreur serveur' });
            return;//permet de pas exécuter se qui suit
        }
        res.status(200).json(results);//pas d erreur
        return;
    });
});

app.post('/PassageRole', (req, res) => { //Pour l'obtention du rol, qu'une fois au chapitre 1 premier senario (au début du chapitre 1)
    console.log(req.body);
    //on récupère le login et l'id de l'utilisateur
    const { login, id, RoleViser } = req.body;//la requet fourni login;id et RoleViser
    connection.query('SELECT idSenarioEnCours,idRole FROM utilisateur WHERE login = ? AND id = ?', [login, id], (err, results) => {// * pour tout selectionner
        if (err) {//si erreur
            console.error('Erreur lors de la récupération des utilisateurs :', err);
            res.status(500).json({ message: 'Erreur serveur' });
            return;//permet de ne pas exécuter se qui suit
        }
        if (results.length === 0) {
            res.status(401).json({ message: '' });
            return;
        }
        else {
            const idSenario = results[1];
            const RoleActuelle = results[2];

            if (idSenario == 1 || RoleActuelle == null) {//Change de rol
                connection.query(
                    'UPDATE utilisateur SET idRole = ? WHERE login = ? AND id = ?',
                    [RoleViser, login, id],
                    (err, results) => {
                        if (err) {
                            console.error('Erreur lors de l\'insertion dans la base de données :', err);
                            res.status(500).json({ message: 'Erreur serveur' });
                            return;
                        }
                        else {
                            console.log('Insertion réussie :', results.insertId);
                            res.status(204).json({ message: '' });
                            return;
                        }
                    }
                );
            }
        }
    });
});

app.post('/PassageSenario', (req, res) => {//pour passer au prochaine senario
    console.log(req.body);
    //on récupère le login et le password
    const { login, id, VerSenario } = req.body;
    connection.query('SELECT idSenarioEnCours FROM utilisateur WHERE login = ? AND id = ?', [login, id], (err, results) => {//verification de l'état d'avancement
        if (err) {
            console.error('Erreur lors de la lecture :', err);
            res.status(500).json({ message: 'Erreur serveur' });
            return;
        }
        else if (results.length === 0) {
            res.status(401).json({ message: '' });
            return;
        }
        else {
            console.log('Lecuture de l id davancement ok :', results.insertId);
        }

        const idSenario = results[0].idSenarioEnCours;
        connection.query('SELECT SuitSenario FROM `utilisateur`,`Choix` WHERE utilisateur.`idSenarioEnCours`= Choix.`idSenario` AND utilisateur.`idSenarioEnCours` = ?',//car insacron, donc imbriquer pour que se soit bien a la suite
            [idSenario],
            (err, results) => { //verification des posibilité pour l'id actuelle de progresion
                if (err) {
                    console.error('Erreur lors de la lecture des posibilite :', err);
                    res.status(500).json({ message: 'Erreur serveur' });
                    return;
                }
                else if (results.length === 0) {
                    res.status(401).json({ message: '' });
                    return;
                }
                const longueur = results.length;
                let passage = 0;
                for (let i = 0; i < longueur; i++) {
                    let possibiliter = results[i].SuitSenario;
                    if (VerSenario == possibiliter) {
                        passage = 1;
                        break;
                    } else if (i == longueur - 1 && passage == 0) {
                        console.log('Valeur non conforme.');
                    }
                }
                if (passage == 1) {
                    connection.query( //sert a envoyer l'identifiant du nouveau chapitre
                        'UPDATE utilisateur SET idSenarioEnCours = ? WHERE login = ? AND id = ?',
                        [VerSenario, login, id],
                        (err, results) => {
                            if (err) {
                                console.error('Erreur lors de l\'insertion dans la base de données :', err);
                                res.status(500).json({ message: 'Erreur serveur' });
                                return;
                            }
                            else {
                                console.log('Insertion réussie :', results.insertId);
                                res.status(204).json({ message: '' });
                                return;
                            }
                        }
                    );
                }
                else {
                    console.log('Valeur non conforme.');
                    res.status(513).json({ message: 'Erreur serveur' });
                    return;
                }
            }
        );
    });
});

app.post('/Texte', (req, res) => {//pour obtenir les information de quoi afficher (image, texte d'ambiance et le texte pour les choix et les choix) (texte d'ambiance a afficher en premier, puis le texte pour les choix)
    let idSenario;
    console.log(req.body);
    //on récupère le login et le password
    const { login, id } = req.body;
    connection.query('SELECT idSenarioEnCours FROM utilisateur WHERE login = ? AND id = ?', [login, id], (err, results) => {// * pour tout selectionner
        if (err) {//si erreur
            console.error('Erreur lors de la récupération des utilisateurs :', err);
            res.status(500).json({ message: 'Erreur serveur' });
            return;//permet de pas exécuter se qui suit
        }
        else if (results.length === 0) {
            res.status(401).json({ message: '' });
            return;
        }
        //res.json(idSenario);//pas d erreur
        idSenario = results[0].idSenarioEnCours;

        if (idSenario == 500) {//car insacron, donc imbriquer pour que se soit bien a la suite
            console.log("500");
            res.status(500).json({ message: 'Erreur serveur' });
            return;
        }
        else {
            connection.query('SELECT Texte,ambiance,Audio FROM Senario WHERE id = ?', [idSenario], (err, Element) => {//envoie les information du senario
                if (err) {
                    console.error('Erreur lors de la vérification des identifiants :', err);
                    res.status(500).json({ message: 'Erreur serveur' });
                    return;
                }
                else if (Element.length === 0) {
                    res.status(401).json({ message: '' });
                    return;
                }
                connection.query('SELECT SuitSenario,choix FROM `utilisateur`,`Choix` WHERE utilisateur.`idSenarioEnCours`= Choix.`idSenario` AND utilisateur.`idSenarioEnCours` = ?',//car insacron, donc imbriquer pour que se soit bien a la suite
                    [idSenario], (err, Choi) => {//envoie les choix
                        if (err) {
                            console.error('Erreur lors de la vérification des identifiants :', err);
                            res.status(500).json({ message: 'Erreur serveur' });
                            return;
                        }
                        else if (Choi.length === 0) {
                            res.status(401).json({ message: '' });
                            return;
                        }
                        //renvoi les informations du texte et des choix disponible
                        res.status(200).json({ text: Element, Choix: Choi });
                    });
            });
        }
    });
});


app.listen(9000, () => { //express écoute sur le port 3000 et affiche un message dans la console
    console.log('server runing')
});  //Le poind virgule c'est juste pour dire la fin de la fonction
