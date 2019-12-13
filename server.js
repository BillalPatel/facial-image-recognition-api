const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const shortid = require('shortid');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 5000;
app.listen(port, () => console.log(`Express server started on port ${port}`));

const database = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : 'billalp',
        password : '',
        database : 'facial-recognition-db'
  }
});

database.select()

const db = {
    users: [
        {
            id: 1,
            name: 'Bill',
            email: '1',
            password: '1',
            joined: new Date().getDate
        },
        {
            id: 2,
            name: 'Bob',
            email: 'bob@bob.com',
            password: 'password2',
            joined: new Date().getDate
        }
    ]
}

app.get('/', (req, res) => {
    res.send(db.users);
})

app.get('/users', (req, res) => {
    res.send(db.users);
})

app.get('/profile/:email', (req, res) => {
    const {email} = req.params;

    database.select('*')
    .from('registered_users').where({
        email: email
    })
    .then(user => {
        found = true;
        return res.status(200).json(user[0].name);
    })
    .catch(err => res.status(404).json('User not found'));
})

app.post('/signin', (req, res) => {
    const {email, password} = req.body;
    // bcrypt.compare(password, hash, function(err, res) {
        if (email === db.users[0].email && password === db.users[0].password) {
            res.json('Successfully signed in');
        } else {
            res.status(400).json('Could not sign in');
        }  
    // })
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    // bcrypt.hash(password, 10, function(err, hash) {
        database('registered_users')
        .returning('*')
        .insert({
            name: name,
            email: email,
            joined: new Date()
        })
        // .then(user => {
        //     user.json(user[0]);
        // })
        .then(response => {
            res.json('User registered successfully');
            // res.json(response);
        })
        .catch(err => res.status(400).json('Invalid details submitted'))
    // });
})