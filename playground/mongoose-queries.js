const { ObjectId } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');

var id = '5bf4928c4a311a08a3381d96';

if (!ObjectId.isValid(id)) {
    console.log('Id is not valid', id);
}

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });

Todo.findById(id).then((todo) => {
    if (!todo) {
       return console.log("No Todo found with id", id);
    }
    console.log('Todo By Id', todo);
}).catch((e) => console.log(e.message));