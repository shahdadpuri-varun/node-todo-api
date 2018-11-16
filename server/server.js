var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });

var Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

var newTodo = new Todo({
    text: 'Fix the laptop',
    completed: true,
    completedAt: 1283749
});

newTodo.save().then((doc) => {
    console.log('Saved the todo', JSON.stringify(doc, undefined, 2));
}, (err) => {
    console.log("Unable to add ToDo", err);
});