require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');


var app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());

// POST todos
app.post('/todos', authenticate, (req, res) => {

    var myTodo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    myTodo.save().then((result) => {
        res.send(result).status(200);
    }, (e) => {
        res.status(400).send(e);
    });

});

// GET all todos
app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((docs) => {
        res.send({ todos: docs });
    }).catch((e) => {
        res.status(400).send(e);
    });
});

// GET todo by Id
app.get('/todos/:id', authenticate, (req, res) => {
    let _id = req.params.id;
    if (_id) {
        if (!ObjectID.isValid(_id)) {
            // console.log('Invalid Id', _id);
            return res.status(404).send({});
        }

        Todo.findOne({ _id, creator: req.user_id }).then((todo) => {
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


app.delete('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findOneAndDelete({ _id: id, _creator: req.user._id }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.status(200).send({ todo });
    }).catch((e) => {
        // console.log(e.message);
        return res.status(400).send({});
    });

});

app.patch('/todos/:id', authenticate, (req, res) => {

    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    var updatedTodo = _.pick(req.body, ['text', 'completed']);

    if (_.isBoolean(updatedTodo.completed) && updatedTodo.completed) {
        updatedTodo.completedAt = new Date().getTime();
    } else {
        updatedTodo.completed = false;
        updatedTodo.completedAt = null;
    }

    Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set: updatedTodo }, { new: true }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.status(200).send({ todo });
    }).catch((e) => {
        return res.status(400).send({});
    });

});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        // console.log(e);
        res.status(400).send(e);
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((err) => {
        res.status(401).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })
});

app.listen(PORT, () => {
    console.log('Server started successfully on port', PORT);
});

module.exports = { app };