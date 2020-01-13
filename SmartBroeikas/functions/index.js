const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./utilities/FBAuth')

const {getPlants, createPlant} = require('./handlers/plants')
const {signUp, Login} = require('./handlers/users')

app.get('/getplants', getPlants)
app.post('/createplant', FBAuth, createPlant)

app.post('/signup', signUp)
app.post('/login', Login) 


//https://us-central1-smartbroeikas.cloudfunctions.net/api
exports.api = functions.region('europe-west1').https.onRequest(app)