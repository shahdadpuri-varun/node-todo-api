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

    // for (var i = 0; i < 20; i++) {
    //     db.collection('Todos').insertOne({ text: 'Eat dinner', completed: false });
    // }

    db.collection('Todos').deleteMany({ text: 'Eat dinner' }).then((result) => {
        // console.log(result);
        console.log(JSON.stringify(result, undefined, 2));
    }).catch((err) => {
        console.log('Unable to fetch to-dos', err);
    });

    // db.close();
    client.close();

});