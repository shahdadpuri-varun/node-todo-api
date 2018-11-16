const { MongoClient, ObjectId } = require('mongodb');

var id = new ObjectId();
console.log(id);


// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'TodoApp';

// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the Server
client.connect(function (err) {
    if (err) {
        console.log("Unable to connect to MongoDB server");
        return;
    }
    console.log("Connected successfully to MongoDB server");

    const db = client.db(dbName);

    let collection = db.collection('Users');
    // collection.insertOne({
    //     name: 'Varun Shahdadpuri',
    //     age: 31,
    //     location: 'San Jose, CA'
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert todo', err);
    //     }
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    // });

    client.close();
});

