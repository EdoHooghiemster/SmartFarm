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
            return res.status(500).json({error: err.code})
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
        plants.push({
            plantId : doc.id,
            body: doc.data().body,
            userHandle: doc.data().userHandle, 
            createdAt: doc.data().createdAt
        })
    });
    return res.json(plants);
})
.catch(err => {
    console.error(err)
    res.status(500).json({error: err.code})
})
}

exports.createPlant = (req, res) => {
    const newPlant = {
        body: req.body.body,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString()
    } 
    db
    .collection('plants')
    .add(newPlant)
    .then((doc) => {
        res.json({ message: `document ${doc.id} created`});
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
        createdAt : new Date().toISOString(),
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
            return res.status(500).json({error: 'something went wrong'})
        })
}

