const {db, admin} = require('../utilities/admin')
const config = require('../config.json')


exports.linkSmartFarm = (req,res) => {
    const newSmartFarm = {
        humidity : 0,
        temperature: 0,
        lightIntensity: 0,
        LedColor: null,
        Water: null,
        userHandle : req.user.handle,
        dock1 : 0,
        dock2 : 0,
        dock3 : 0,
        dock4 : 0,
        dock5 : 0,
        dock6 : 0
    }
    const userupdate = {
        hasSmartFarm : true
    }

    db
    .collection('broeikassen')
    .add(newSmartFarm)
    .then((doc) => {
        db.doc(`/users/${req.user.handle}`).update(userupdate)
        return res.json({message: 'smartfarm linked' ,docu: doc.get()})
    })
    .catch((err) => {
        res.status(500).json({ error: 'something went wrong'})
        console.log(err)
    })

}


exports.linkDock = (req,res) => 
{
    const plantId = req.params.plantId;
    const dockNumber = req.params.dockNumber;
    
    var Data = {};
    for(var i=1; i < 3; i++) {
    Data[dockNumber] = plantId;        
    }

    db.collection('broeikassen').doc(req.params.smartFarmId).get()
    .then(doc => {
        const handle = doc.data().userHandle
        if(req.user.handle == handle){
            db.collection('broeikassen').doc(req.params.smartFarmId).update(Data)
            .then(doc => {
                return res.json({message:"plant docked", doc: doc })
            })
            .catch(err => {
                return res.status(403).json({general: 'wrong credentials/not logged in' ,error : err})
            })
        }
        else{
            return res.json({message: "not logged in/no permission"})
        }
    })
    .catch(err => {
        return res.status(403).json({general: 'wrong credentials/not logged in'})
    })   
}

exports.getplantsdocked = (req, res) => {
    let docks = []
    let plants = {}
    db.collection('broeikassen').doc(req.params.smartFarmId).get()
    .then(doc => {
        const obj = doc.data()
        docks.push({dock1: obj.dock1},{ dock2: obj.dock2}, {dock3: obj.dock3},{dock4:  obj.dock4}, {dock5: obj.dock5}, {dock6: obj.dock6})       
        return docks 
    })
    .then(dock => {
        db.collection('plants').doc(dock[0]["dock1"]).get()
        .then(doc => {
            plants.dock1 = doc.data()
            return db.collection('plants').doc(dock[1]["dock2"]).get()
        })
        .then(doc => {
            plants.dock2 = doc.data()
            return db.collection('plants').doc(dock[2]["dock3"]).get()
        })
        .then(doc => {
            plants.dock3 = doc.data()
            return db.collection('plants').doc(dock[3]["dock4"]).get()
        })
        .then(doc => {
            plants.dock4 = doc.data()
            return db.collection('plants').doc(dock[4]["dock5"]).get()
        })
        .then(doc => {
            plants.dock5 = doc.data()
            return db.collection('plants').doc(dock[5]["dock6"]).get()
        })
        .then(doc => {
            plants.dock6 = doc.data()
            return res.json(plants)
        })
        .catch(err => {
            res.status(500).json({error: err.code})
        })
    })

    

}

exports.broeikasSettings = (req,res) => {
    let settings = {
        temperature: req.body.temperature,
        lightIntensity: req.body.lightIntensity,
        humidity: req.body.humidity
    }
    db
    .collection('broeikassen')
    .doc(req.params.smartFarmId)
    .update(settings)
        .then(doc => {
            return res.json({message:"sensor data updated", res: doc})
        })
        .catch(err => {
            return res.status(500).json({message: 'something went wrong', res: err})
        })
}

exports.broeikasAlarm = (req,res) => {
    let settings = {
        alarmTime: req.body.alarmTime,
    }
    db
    .collection('broeikassen')
    .doc(req.params.smartFarmId)
    .update(settings)
        .then(doc => {
            return res.json({message:"Alarm has been set", res: doc})
        })
        .catch(err => {
            return res.status(500).json({message: 'something went wrong', res: err})
        })
}

exports.broeikasLightsOff = (req,res) => {
    let settings = {
        lightsOff: req.body.lightsOff,
    }
    db
    .collection('broeikassen')
    .doc(req.params.smartFarmId)
    .update(settings)
        .then(doc => {
            return res.json({message:"Time has been set", res: doc})
        })
        .catch(err => {
            return res.status(500).json({message: 'something went wrong', res: err})
        })
}

exports.broeikasLightsOn = (req,res) => {
    let settings = {
        lightsOn: req.body.lightsOn,
    }
    db
    .collection('broeikassen')
    .doc(req.params.smartFarmId)
    .update(settings)
        .then(doc => {
            return res.json({message:"Time has been set", res: doc})
        })
        .catch(err => {
            return res.status(500).json({message: 'something went wrong', res: err})
        })
}
exports.turnLightOff = (req,res)=> {
    let settings = {
        lightOn: false
    }
    db
    .collection('broeikassen')
    .doc(req.params.smartFarmId)
    .update(settings)
        .then(doc => {
            return res.json({message:"Lights have been turned off", res: doc})
        })
        .catch(err => {
            return res.status(500).json({message: 'something went wrong', res: err})
        })
}

exports.getVar = (req,res) => {
    db.collection('broeikassen').doc('JYRUfG7fNGNIANd4AE6u').get()
    .then(doc => {
        return res.json(doc.data().userHandle)
    })

    // db.collection('broeikassen').doc(`JYRUfG7fNGNIANd4AE6u`).update({
    //     testt
    // })

    // db.collection('broeikassen').doc(`JYRUfG7fNGNIANd4AE6u`).get()
    // .then(doc => {
    //     const Dat = doc.data()
    //     Dat.dock1.update("123")
    //     return res.json(Dat.dock1)
    // })


}

exports.uploadImageBroeikas = (req,res) => {
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
                return db.collection('broeikassen').doc(req.params.smartFarmId).update({imageUrl: imageUrl});
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