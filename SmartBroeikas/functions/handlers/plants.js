const {db} = require('../utilities/admin')

exports.getPlant = (req, res) => {
    let Data = {};
    db.doc(`/plants/${req.params.plantId}`).get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({error: 'Plant not found'})
            }
            Data = doc.data();
            Data.plantId = doc.id
            return db.collection('comments').orderBy('createdAt', 'desc')
            .where('plantId', '==', req.params.plantId).get();
        })
        .then(data => {
            Data.comments = []
            data.forEach(doc => {
                Data.comments.push(doc.data())
            })
            return res.json(Data)
        })
        .catch(err => {
            return res.status(500).json({error: err})
        })
}

exports.getPlants = (req, res) => {
db
.collection('plants')
.orderBy('createdAt', 'desc')
.get()
.then(data => {
    let plants = [];
    data.forEach(doc => {
        
        const handle = doc.data().userHandle
        db.collection('users').where('handle', '==', handle)
        .get()
        .then(users => {
            users.forEach(userImg =>{
                data.forEach(doc1 => {
                    const dataPlant = doc1.data()
                    dataPlant.id = doc1.id
                    dataPlant.imgUser = userImg.data().imageUrl
                    plants.push({plant : dataPlant})
                    
                })
               
            })
            return res.json(plants);
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({error: err.code})
        })
    });

})
.catch(err => {
    console.error(err)
    res.status(500).json({error: err.code})
})
}


exports.getPlants2 = (req, res) => {
    let Data = {};

    db
    .collection('plants')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
        Data.plants = [];
        data.forEach(plant => {
            const dataPlant = plant.data()
            dataPlant.id = plant.id
            Data.plants.push(dataPlant)
        })
    })


    return res.json(Data)

}

exports.createPlant = (req, res) => {
    const newPlant = {
        body: req.body.body,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        currentSoilMoisture: 0,
        desiredSoilMoisture: 0,
        growthPercentage: 0
    }
    db
    .collection('plants')
    .add(newPlant)
    .then((doc) => {
        const resPlant = newPlant;
        resPlant.plantId = doc.id
        res.json(resPlant);
    })
    .catch((err) => {
        res.status(500).json({ error: 'something went wrong'})
        console.log(err)
    }) 
}

exports.commentOnPlant = (req, res) => {
    if (req.body.body.trim() === '') return res.status(400).json({error: 'must not be empty'})
    const newComment = {
        body: req.body.body,
        createdAt : new Date().toString(),
        plantId: req.params.plantId,
        userHandle: req.user.handle,
    }
    db.doc(`/plants/${req.params.plantId}`).get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({error: 'not found'})
            }
            return db.collection('comments').add(newComment)
        })
        .then(() => {
            res.json(newComment);
        })
        .catch(err => {
            return res.status(500).json({error: 'something went wrong' + err})
        })
}

exports.likePlant = (req, res) => {
    const likeDoc = db.collection('likes').where('userHandle', '==', req.user.handle)
        .where('plantId', '==', req.params.plantId).limit(1);

    const plantDocument = db.doc(`/plants/${req.params.plantId}`);

    let plantData

    plantDocument.get()
        .then(doc => {
            if(doc.exists){
                plantData = doc.data()
                plantData.plantId = doc.id;
                return likeDoc.get();
            }
            else{
                return res.status(404).json({error: 'must not be empty'})
            }
        })
        .then(data => {
            if(data.empty){
                return db.collection('likes').add({
                    plantId: req.params.plantId,
                    userHandle: req.user.handle
                })
                .then(() => {
                    plantData.likeCount++
                    return plantDocument.update({likeCount: plantData.likeCount })
                })
                .then(() => {
                    return res.json(plantData)
                })
            }
            else {
                return res.status(400).json({error: 'already liked'})
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({error: err.code})
        })

}

exports.unlikePlant = (req,res) => {
    const likeDoc = db.collection('likes').where('userHandle', '==', req.user.handle)
    .where('plantId', '==', req.params.plantId).limit(1);

    const plantDocument = db.doc(`/plants/${req.params.plantId}`);

    let plantData

    plantDocument.get()
        .then(doc => {
            if(doc.exists){
                plantData = doc.data()
                plantData.plantId = doc.id;
                return likeDoc.get();
            }
            else{
                return res.status(404).json({error: 'must not be empty'})
            }
        })
        .then(data => {
            if(data.empty){
                return res.status(400).json({error: 'not liked'})
            }
            else {
                return db.doc(`/likes/${data.docs[0].id}`)
                .delete()
                    .then(() => {
                        plantData.likeCount--;
                        return plantDocument.update({likeCount: plantData.likeCount})
                    })
                    .then(()=> {
                        res.json(plantData)
                    })
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({error: err.code})
        })
}

exports.plantStamp = (req,res) => {
    const plantStamp = {
        TimeStamp : null,
        body : "",
        plantId: ""
    }
    
    db.doc(`/plants/${req.params.plantId}`).get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({error: "plant not found"})
            }
            else{
            plantStamp.TimeStamp = new Date().toString()
            plantStamp.body = doc.data().body
            plantStamp.plantId = doc.id
            db.collection('TimeStamp').add(plantStamp)
                .then(doc => {
                    return res.json(plantStamp)
                }).catch((err) => {
                    return res.status(500).json({error: err, plantStamp})
                })
            }
        }).catch((err) => {
            return res.status(500).json({error: err, plantStamp})
        })
}

exports.plantSettings = (req,res) => {
    let settings = {
        currentSoilMoisture: req.body.currentSoilMoisture, 
        growthPercentage: req.body.growthPercentage
    }

    db
    .collection('plants')
    .doc(req.params.plantId)
    .update(settings)
        .then(doc => {
            return res.json({message:"sensor data updated", res: doc})
        })
        .catch(err => {
            return res.status(500).json({message: 'something went wrong', res: err})
        })
}