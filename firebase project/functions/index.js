
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const app = express();

const config = require('./config.json')

var firebase = require('firebase');

admin.initializeApp();
const db = admin.firestore();
firebase.initializeApp(config.config);

//view all plants
app.get('/allPlants', (req, res)=> {
        db
        .collection('Planten').orderBy('Timestamp', 'desc')
        .get()
        .then((data) => {
           let plants = [];
           data.forEach((doc) => {
               plants.push({
                   plantId: doc.id,
                   Name: doc.data().Name,
                   Timestamp : doc.data().Timestamp,
               });
           });
           return res.json(plants);
        }).catch((err) => console.error(err));
})

//createPlant
app.post('/createPlant', (req, res) => {
    const newPlant = {
        name: req.body.name,
        timestamp: new Date().toISOString()
    };
    db
    .collection('Planten')
    .add(newPlant)
    .then(doc => {
        return res.json({message: 'Tomato is added'});
    })
    .catch((err) => {
        res.status(500).json({error: 'Something went wrong'})
        console.error(err);
    });
});

//registration user
app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        handle: req.body.handle
    }

    db.doc(`/users/${newUser.handle}`).get()
        .then(doc =>{
            if(doc.exists){
                return res.status(400).json({handle: 'already taken'})
            }
            else{
               return firebase
                .auth()
                .createUserWithEmailAndPassword(newUser.email, newUser.password)
            }
        })
        .then((data) =>{
            return res.status(201).json({data});
        })
        .catch(err => {
            if(err.code === 'auth/email-already-in-use'){
                return res.status(400).json({ email:`Email is already taken`})
            }
            else {
            return res.status(500).json({ error: err})
            }
        });
});

app.post('/login', (req, res) => {
    const user = {
        email : req.body.email,
        password: req.body.password
    };
    
    firebase.auth().signInAndRetrieveDataWithCredential(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
       .then(token => {
           return res.json(token)
       })
       .catch(err => {
           console.error(err)
           return res.status(500).json({error: err.code})
       })
})

//https://us-central1-smartfarm-51bd8.cloudfunctions.net/api/    API ENDPOINT
exports.api = functions.https.onRequest(app);

