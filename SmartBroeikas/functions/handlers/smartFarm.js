const {db} = require('../utilities/admin')

exports.linkSmartFarm = (req,res) => {
    let newSmartFarm = {
        Temprature : 0,
        Humidity: 0,
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

    db
    .collection('broeikassen')
    .add(newSmartFarm)
    .then((doc) => {
        res.json({message: 'smartfarm linked' ,docu: doc.get()})
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

exports.broeikasSettings = (req,res) => {
    let settings = {
        ledColor: req.body.ledColor,
        water: req.body.waterDose
    }

    db
    .collection('broeikassen')
    .doc(req.params.smartFarmId)
    .update(settings)
        .then(doc => {
            return res.json({message:"message updated", res: doc})
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