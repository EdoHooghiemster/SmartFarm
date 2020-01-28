const {db} = require('../utilities/admin')

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
    db.collection('broeikassen').doc(req.params.smartFarmId).get()
    .then(doc => {
        const docks = []
        const filledDocks = []
        const obj = doc.data()
        
        docks.push({dock1: obj.dock1},{ dock2: obj.dock2}, {dock3: obj.dock3},{dock4:  obj.dock4}, {dock5: obj.dock5}, {dock6: obj.dock6})
        
        docks.forEach(plantId => {
                filledDocks.push(plantId)
            }
        );
    
        return res.json(filledDocks)
        

        // docks.forEach(dock => {
        //     db.collection('plants').doc(dock).get()
        //     .then(data => {
        //         test = data.data()
        //     })    
        // });
        
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
