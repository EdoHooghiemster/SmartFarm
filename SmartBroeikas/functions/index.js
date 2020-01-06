const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./utilities/FBAuth')

const {getPlants, createPlant, getPlant, commentOnPlant, likePlant, unlikePlant} = require('./handlers/plants')
const {signUp, Login, signUp2, getUser} = require('./handlers/users')

const cors = require('cors')

app.use(cors())
//plant func
app.get('/getplants', getPlants)
app.post('/createplant', FBAuth, createPlant)
app.get('/plant/:plantId', getPlant)
app.post('/plant/:plantId/comment', FBAuth, commentOnPlant)
app.get('/plant/:plantId/like', FBAuth, likePlant)
app.get('/plant/:plantId/unlike', FBAuth, unlikePlant)

//user func
app.post('/signup', signUp)
app.post('/login', Login) 
app.post('/user', FBAuth, signUp2)
app.get('/details', FBAuth, getUser)
//https://us-central1-smartbroeikas.cloudfunctions.net/api 
exports.api = functions.region('europe-west1').https.onRequest(app)