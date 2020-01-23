const {db, admin} = require('../utilities/admin')

const config = require('../config.json')

const firebase = require('firebase')
firebase.initializeApp(config.config)

const {validateSignupData, validateLoginData, validateSignup2} = require('../utilities/validations')

exports.signUp = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
        hasSmartFarm: false
    };

    const { valid, errors} = validateSignupData(newUser)

    if(!valid) return res.status(400).json(errors)

    const noImg = 'no-image.jpeg'

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
            created: new Date().toString(),
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.config.storageBucket}/o/${noImg}?alt=media`,
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
            if(err.code ==='auth/user-not-found'){
                return res.status(403).json({general: 'wrong credentials'})
            }
            else{
            return res.status(500).json({errror: err.code})
             }
        })
}

exports.signUp2 = (req, res) => {
    let userDetails = validateSignup2(req.body)

    db
    .doc(`/users/${req.user.handle}`).update(userDetails)
        .then(() => {
            return res.json({ message: 'Details added :)'})
        })
        .catch(err => {
            return res.status(500).json(err.code)
        })
}

exports.getUser = (req, res) => {
    let Data = {};

    db.doc(`/users/${req.user.handle}`).get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({error: 'error not found'})
            }
            Data.credentials = doc.data();
            return db.collection('broeikassen').where('userHandle', '==', req.user.handle).get();
            })
            .then(doc => {
                Data.Broeikas = [];
                doc.forEach(data => {
                    const dataBroeikas = data.data()
                    dataBroeikas.Id = data.id
                    Data.Broeikas.push(dataBroeikas)
                })
                return db.collection('plants').where('userHandle', '==', req.user.handle).get();
            })
            .then(doc =>{
                
                Data.Planten = [];
                doc.forEach(doc => {
                    const dataPlant = doc.data()
                    dataPlant.Id = doc.id
                    Data.Planten.push(dataPlant)
                })
                return res.json(Data);
            })
            .catch(err => {
                return res.status(401).json({error: err})
            })
      
}

exports.uploadImage = (req,res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');
    const busboy = new BusBoy({headers: req.headers});

    let imageFileName;
    let imageToBeUploaded = {};

        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {

            if(mimetype !== 'image/jpeg' && mimetype !== 'image/png'){
                return res.status(400).json({ error : 'Wrong format'})
            }

            const imageExtendsion = filename.split('.')[filename.split('.').length - 1];
            imageFileName = `${Math.round(Math.random()*100000000000)}.${imageExtendsion}`
            const filepath = path.join(os.tmpdir(), imageFileName); 
            imageToBeUploaded = {filepath, mimetype};
            file.pipe(fs.createWriteStream(filepath));
        })
        busboy.on('finish', () => {
            admin.storage().bucket().upload(imageToBeUploaded.filepath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageToBeUploaded.mimetype
                    }
                }
            }).then(() => {
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.config.storageBucket}/o/${imageFileName}?alt=media`
                return db.doc(`/users/${req.user.handle}`).update({imageUrl: imageUrl});
            })
            .then(() => {
                return res.json({ message : "Image uploaded!"})
            })
            .catch(err => {
                return res.status(500).json({error : err})
            })
        })
        busboy.end(req.rawBody);
}
