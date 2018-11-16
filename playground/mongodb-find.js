const { MongoClient } = require('mongodb');
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'TodoApp';

const client = new MongoClient(url, { useNewUrlParser: true });
// Use connect method to connect to the server
client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    const db = client.db(dbName);

    db.collection('Todos').find({ completed: false }).toArray().then((docs) => {
        console.log("TO-DOs");
        console.log(JSON.stringify(docs, undefined, 2));
    }).catch((err) => {
        console.log('Unable to fetch to-dos', err);
    });

    // db.close();
    client.close();

});