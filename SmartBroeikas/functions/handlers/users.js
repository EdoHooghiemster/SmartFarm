const {db} = require('../utilities/admin')

const config = require('../config.json')

const firebase = require('firebase')
firebase.initializeApp(config.config)

const {validateSignupData, validateLoginData} = require('../utilities/validations')

exports.signUp = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };

    const { valid, errors} = validateSignupData(newUser)

    if(!valid) return res.status(400).json(errors)

    let token, userId;
    db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
        if(doc.exists){
        return res.status(400).json({handle: 'this handle is taken'})
        }
        else{
            return firebase
                    .auth()
                    .createUserWithEmailAndPassword(newUser.email, newUser.password)
        } 
    })
    .then(data => {
        userId = data.user.uid
        return data.user.getIdToken()
    })
    .then(idToken => {
        token = idToken
        const userCredentials = {
            handle: newUser.handle,
            email: newUser.email,
            created: new Date().toISOString(),
            userId
        };
        return db.doc(`/users/${newUser.handle}`).set(userCredentials)
    })
    .then(() => {
        return res.status(201).json({token})
    })
    .catch(err => {
        if(err.code === 'auth/email-already-in-use'){
            return res.status(400).json({ email: 'already in use'})
        }
        else{
        return res.status(500).json({error: err.code, message: err.message})
        }
    })
}

exports.Login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    const { valid, errors} = validateLoginData(user)
    if(!valid) return res.status(400).json(errors)

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json(token)
        })
        .catch(err => {
            if(err.code ==='auth/wrong-password'){
                return res.status(403).json({general: 'wrong credentials'})
            }
            else{
            return res.status(500).json({errror: err.code})
             }
        })
}




