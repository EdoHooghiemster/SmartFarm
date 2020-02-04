const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./utilities/FBAuth')

const {getPlants, desiredSoilMoisture, getImageFeed, createPlant, getPlant, commentOnPlant, likePlant, unlikePlant, plantStamp, plantSettings} = require('./handlers/plants')
const {signUp, Login, signUp2, getUser, uploadImage, getLikes} = require('./handlers/users')
const {lightSettings, broeikasLightsOn,broeikasLightsOff,linkSmartFarm, linkDock, getVar, broeikasSettings,turnLightOff, getplantsdocked, uploadImageBroeikas, broeikasAlarm}  = require('./handlers/smartFarm')

const cors = require('cors')
app.use(cors())

//plant func
app.get('/getplants', getPlants)

app.post('/createplant', FBAuth, createPlant)
app.get('/plant/:plantId', getPlant)
app.post('/plant/:plantId/comment', FBAuth, commentOnPlant)
app.get('/plant/:plantId/like', FBAuth, likePlant)
app.get('/plant/:plantId/unlike', FBAuth, unlikePlant)
app.post('/plantstamp/:plantId', plantStamp)
app.post('/sensordataplant/:plantId', plantSettings)
app.get('/getimage/:handle', getImageFeed)
app.post('/desiredSoilMoisture/:plantId', desiredSoilMoisture)

//user func
app.post('/signup', signUp)
app.post('/login', Login)  
app.post('/user', FBAuth, signUp2)
app.get('/details', FBAuth, getUser)
app.get('/getlikes', FBAuth, getLikes)
app.post('/user/image', FBAuth, uploadImage)

//farm func
app.post('/linkfarm', FBAuth, linkSmartFarm)
app.post('/dock/:plantId/:dockNumber/:smartFarmId',FBAuth, linkDock)
app.post('/sensordatabroeikas/:smartFarmId', broeikasSettings)
app.get('/getdocks/:smartFarmId',getplantsdocked )
app.post('/broeikas/image/:smartFarmId', uploadImageBroeikas)
app.post('/broeikas/alarm/:smartFarmId', broeikasAlarm)
app.post('/broeikas/turnlightoff/:smartFarmId', turnLightOff)
app.post('/broeikas/timelightson/:smartFarmId', broeikasLightsOn)
app.post('/broeikas/timelightsoff/:smartFarmId', broeikasLightsOff)
app.post('/broeikas/lightsettings/:smartFarmId', lightSettings)


//test func
app.get('/getvar', getVar)

//https://us-central1-smartbroeikas.cloudfunctions.net/api 
exports.api = functions.region('europe-west1').https.onRequest(app)