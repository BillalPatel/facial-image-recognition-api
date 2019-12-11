const express = require('express');

const app = express();
const port = 5000;
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

app.listen(port, () => console.log(`Express server started on port ${port}`));

app.get('/', (req, res) => {
    res.send('landing');
})

app.post('/signin', (req, res) => {
    res.json('post');
})

// app.get('/', (req, res) => res.send('Hello World!'))