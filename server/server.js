const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');


var app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// POST todos
app.post('/todos', (req, res) => {

    var myTodo = new Todo({
        text: req.body.text
    });

    myTodo.save().then((result) => {
        res.send(result).status(200);
    }, (e) => {
        res.status(400).send(e);
    });

});

// GET all todos
app.get('/todos', (req, res) => {
    Todo.find().then((docs) => {
        res.send({ todos: docs });
    }).catch((e) => {
        res.status(400).send(e);
    });
});

// GET todo by Id
app.get('/todos/:id', (req, res) => {
    let _id = req.params.id;
    if (_id) {
        if (!ObjectID.isValid(_id)) {
            // console.log('Invalid Id', _id);
            return res.status(404).send({});
        }

        Todo.findById(_id).then((todo) => {
            if (!todo) {
                // console.log("Todo not found");
                return res.status(404).send({});
            }
            res.status(200).send({ todo });
        }).catch((e) => {
            // console.log(e.message);
            return res.status(400).send({});
        });
    } else {
        res.status(404).send({});
    }
});


app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndDelete(id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.status(200).send({ todo });
    }).catch((e) => {
        // console.log(e.message);
        return res.status(400).send({});
    });
    
});


app.listen(PORT, () => {
    console.log('Server started successfully on port', PORT);
});

module.exports = { app };