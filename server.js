const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 5000;

app.listen(port, () => console.log(`Express server started on port ${port}`));

const db = {
    users: [
        {
            id: 1,
            name: 'Bill',
            email: 'bill@bill.com',
            password: 'password1',
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

app.get('/profile/:id', (req, res, next) => {
    const {id} = req.params;
    let found = false;

    db.users.forEach(user => {
        if (user.id.toString() === id) {
            found = true;
            return res.json(user);        
        }        
    })
    if (!found) {
        return res.status(404).json('User not found');
    }
})

app.post('/signin', (req, res) => {
    if (req.body.email === db.users[0].email && req.body.password === db.users[0].password) {
        res.json('Successfully signed in');
    } else {
        res.status(400).json('Could not sign in');
    }
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    bcrypt.hash(password, 10, function(err, hash) {
        db.users.push({
            id: shortid.generate(),
            name: name,
            email: email,
            password: hash,
            joined: new Date()
        })
    });
    res.status(200).json('User registered successfully');
})