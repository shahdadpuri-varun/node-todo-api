const request = require('supertest');
const expect = require('expect');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo'
}]

beforeEach((done) => {
    Todo.deleteMany({})
        .then(() => {
            return Todo.insertMany(todos)
        }).then(() => done());;
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'This is a new Test Todo';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, response) => {
                if (err) {
                    return done(err);
                }
                // Find all Todos and check for the newly added one.
                // All todos are deleted before each test.
                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

    it('should not create todos with invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then((docs) => {
                    expect(docs.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('/GET todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('/GET todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if to do not found', (done) => {
        request(app)
            .get(`/todos/${(new ObjectID()).toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get(`/todos/1234`)
            .expect(404)
            .end(done);
    });

});


describe('/DELETE /todo/:id', () => {

    let id = todos[0]._id.toHexString();

    it('should delete a todo', (done) => {

        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(id);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(res.body.todo._id).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404 is todo is not found', (done) => {

        request(app)
            .delete(`/todos/${(new ObjectID()).toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 is object id is invalid', (done) => {

        request(app)
            .delete(`/todos/1234`)
            .expect(404)
            .end(done);
    });
});

describe('/PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var id = todos[0]._id.toHexString();
        var body = {};
        body.text = 'Updated the todo';
        body.completed = true;
        
        request(app)
            .patch(`/todos/${id}`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(body.text);
                expect(res.body.todo.completed).toBeA('boolean').toBeTruthy();
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var id = todos[1]._id.toHexString();
        var text = 'Upated text from test case'
        request(app)
            .patch(`/todos/${id}`)
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBeA('boolean').toBeFalsy();
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    })
});