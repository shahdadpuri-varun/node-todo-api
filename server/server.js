const express = require('express');
const bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');


var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    console.log(req.body);
    var myTodo = new Todo({
        text: req.body.text
    });

    myTodo.save().then((result) => {
        res.send(result).status(200);
    }, (e) => {
        res.status(400).send(e);
    });

});

app.get('/todos', (req, res) => {
    Todo.find().then((docs) => {
        res.send({ todos: docs });
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.listen('3000', () => {
    console.log('Server started successfully on port 3000');
});

module.exports = { app };