
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

const FBAuth = (req, res, next) => {
    let idToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1];
    }
    else {
        return res.status(403).json({error : 'Unathorized'});
    }

    admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
        req.user = decodedToken;
        return db.collection('users')
            .where('userId', '==', req.user.uid)
            .limit(1)
            .get();
    })
    .then(data => {
        req.user.handle = data.docs[0].data.handle;
        return next()
    })
    .catch(err => {
        console.error('error while verifying token', err);
        return res.status(403).json(err);
    })
}

//createPlant
app.post('/createPlant', FBAuth, (req, res) => {
    
        
    const newPlant = {
        name: req.body.name,
        timestamp: new Date().toISOString(),
        userHandle: req.user.handle
    };
    db
    .collection('Planten')
    .add(newPlant)
    .then(doc => {
        return res.json(doc);
    })
    .catch((err) => {
        res.status(500).json({error: 'Something went wrong'})
        console.error(err);
    });
});

const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false
}

//registration user
app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        handle: req.body.handle
    }
   
    let token, userId
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
        .then(data => {
            userId = data.user.uid
            return data.user.getIdToken();
        })
        .then(idToken => {
            token = idToken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Data().toISOString(),
                userId: userId
            };
            db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({token}) 
        })
        .catch(err => {
            if(err.code === 'auth/email-already-in-use'){
                return res.status(400).json({ email:`Email is taken`})
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

    if(isEmpty(user.email)) errors.email = "Must not be Empty";
    if(isEmpty(user.password)) errors.email = "Must not be Empty";

    if(Object.keys(errors).length > 0) return res.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
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

