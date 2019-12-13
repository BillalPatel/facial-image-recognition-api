const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
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
    .catch(() => res.status(404).json('User not found'));
})

app.post('/signin', (req, res) => {
    database('login_information')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        
        if (isValid === true) {
            return database('registered_users')
            .where('email', '=', req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(() => res.status(400).json('Unable to get user'))
        } else {
            res.status(400).json('Could not sign in')
        }
        })
    .catch(() => res.status(400).json('Could not sign in this time'))
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10)
    
    database.transaction(trans => {
        trans.insert({
            hash: hashedPassword,
            email: email
        })
        .into('login_information')
        .returning('email')
        .then(loginEmail => {
            return trans('registered_users')
            .returning('*')
            .insert({
                name: name,
                email: loginEmail[0],
                joined: new Date()
            })
            .then(user => {
                res.json(user[0]);
            })
        })
        .then(trans.commit)
        .then(res => {
            res.json('User registered successfully');
        })
        .catch(trans.rollback)
        .catch(() => res.status(400).json('Invalid details submitted'));
    })
    .catch(() => res.status(400).json('Invalid details submitted'));
})