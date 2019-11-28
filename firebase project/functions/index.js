
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const app = express();
var firebase = require('firebase');
admin.initializeApp();

var config = {
    apiKey: "AIzaSyA5cWJ5_ESPot_Gu_nvo1uM7LLTN0ZFNP4",
    authDomain: "smartfarm-51bd8.firebaseapp.com",
    databaseURL: "https://smartfarm-51bd8.firebaseio.com",
    projectId: "smartfarm-51bd8",
    storageBucket: "smartfarm-51bd8.appspot.com",
    messagingSenderId: "244368953792",
    appId: "1:244368953792:web:5ef83f2b0da634b5a23825",
    measurementId: "G-BFKMECR86Q"
  };

firebase.initializeApp(config);

//view all plants
app.get('/Planten', (req, res)=> {
    admin
        .firestore()
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
        Name: 'Tomato',
        Timestamp: new Date().toISOString()
    };
    admin
    .firestore()
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
        password: req.body.password
    }

    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
        return res.status(201)
        .json({ message: `${data.user.email} signed up`})
    })
    .catch(err => {
        return res.status(500).json({ error: err})
    });
});

//https://us-central1-smartfarm-51bd8.cloudfunctions.net/api/
exports.api = functions.https.onRequest(app);

