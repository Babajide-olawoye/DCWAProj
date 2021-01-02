const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

var dbName = 'headsOfStateDB'
var collectionName = 'headsOfState'

var president;
var coll;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
        president = client.db(dbName);
        coll = president.collection(collectionName);
    })
    .catch((error) => {
        console.log(error);
    })


var getPresident = function () {
    return new Promise((resolve, reject) => {
        var cursor = coll.find()
        cursor.toArray()
            .then((documents) => {
                console.log("getPres work");
                resolve(documents)

            }).catch((error) => {
                reject(error)
            })
    })

}

var addPresident = function (id, presidentName) {
    return new Promise((resolve, reject) => {
        coll.insertOne({ _id: id, headOfState: presidentName })
            .then((documents) => {

                //console.log(documents);
                resolve(documents)

            }).catch((error) => {
                reject(error)
            })
    })

}

var deletePresident = function (id) {
    return new Promise((resolve, reject) => {
        coll.deleteOne({ _id: id })
            .then((documents) => {
                console.log("deleted");
                resolve(documents)


            }).catch((error) => {
                console.log("error in delPresident")
                reject(error)
            })
    })

}


module.exports = { getPresident, addPresident, deletePresident }