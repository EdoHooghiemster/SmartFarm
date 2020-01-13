const {db} = require('../utilities/admin')

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