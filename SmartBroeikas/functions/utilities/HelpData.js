const Smart = {
    Tempratuur : Number,
    Luchtvochtiheid: Number,
    //ledcolor set in 
    LedColor: Number,
    userId : Number,
    dock1 : Number("plantid"), //hierin word de naam van de plant meegegeven
    dock2 : Number("plantid"),
    dock3 : Number("plantid"),
    dock4 : Number("plantid"),
    dock5 : Number("plantid"),
    dock6 : Number("plantid")
}
//https://medium.com/bsadd/tunneling-your-local-servers-ceb7f6bae085
const instellingensmartfarm = {
    LedColor:Number
}

const sensorwaardessmartfarm = {
    Tempratuur: float,
    Luchtvochtiheid: Number,
    broekasId: Number
}

const sensorwaardesplant = {
    Grondvochtiheid: Number,
    plantId: Number
}


// jpeg vanuit een url