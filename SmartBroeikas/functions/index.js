const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./utilities/FBAuth')

const {getPlants, createPlant, getPlant, commentOnPlant, likePlant, unlikePlant, plantStamp, plantSettings} = require('./handlers/plants')
const {signUp, Login, signUp2, getUser, uploadImage} = require('./handlers/users')
const {linkSmartFarm, linkDock, getVar, broeikasSettings, getplantsdocked}  = require('./handlers/smartFarm')

const cors = require('cors')

app.use(cors())
//plant func
app.get('/getplants',FBAuth, getPlants)
app.post('/createplant', FBAuth, createPlant)
app.get('/plant/:plantId', getPlant)
app.post('/plant/:plantId/comment', FBAuth, commentOnPlant)
app.get('/plant/:plantId/like', FBAuth, likePlant)
app.get('/plant/:plantId/unlike', FBAuth, unlikePlant)
app.post('/plantstamp/:plantId', plantStamp)
app.post('/sensordataplant/:plantId', plantSettings)


//user func
app.post('/signup', signUp)
app.post('/login', Login)  
app.post('/user', FBAuth, signUp2)
app.get('/details', FBAuth, getUser)
app.post('/user/image', FBAuth, uploadImage)

//farm func
app.post('/linkfarm', FBAuth, linkSmartFarm)
app.post('/dock/:plantId/:dockNumber/:smartFarmId',FBAuth, linkDock)
app.post('/sensordatabroeikas/:smartFarmId', broeikasSettings)
app.get('/getdocks/:smartFarmId',getplantsdocked )
//test func
app.get('/getvar', getVar)

//https://us-central1-smartbroeikas.cloudfunctions.net/api 
exports.api = functions.region('europe-west1').https.onRequest(app)