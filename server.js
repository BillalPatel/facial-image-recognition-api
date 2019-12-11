const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

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
    res.send('Landing page');
})

app.post('/signin', (req, res) => {
    if (req.body.email === db.users[0].email && req.body.password === db.users[0].password) {
        res.json('Successfully signed in');
    } else {
        res.status(400).json('Could not sign in');
    }
})

app.post('/register', (req, res) => {
    
})

// app.get('/', (req, res) => res.send('Hello World!'))