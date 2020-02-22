const express = require('express');
const bodyParser = require('body-parser');
const Clarifai = require('clarifai');
const cors = require('cors');
// const knex = require('knex');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 5000;
app.listen(port, () => console.log(`Express server started on port ${port}`));

// const database = knex({
//     client: 'pg',
//     connection: {
//         host : '127.0.0.1',
//         user : 'billalp',
//         password : '',
//         database : 'facial-recognition-db'
//   }
// });


var pg = require('pg');

var conString = 'postgres://cwsjnmgo:BhIrq134KifPB_SCa20W5orrjbtZZ_rd@rogue.db.elephantsql.com:5432/cwsjnmgo'
var client = new pg.Client(conString);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT NOW() AS "theTime"', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].theTime);
    // >> output: 2018-08-23T14:02:57.117Z
    client.end();
  });
});





database.select();

app.get('/profile/:email', (req, res) => {
    const {email} = req.params;

    database.select('*')
    .from('registered_users')
    .where('email', '=', email)
    .returning('name')
    .then(user => {
        return res.status(200).json(user[0].name);
    })
    .catch(() => res.status(404).json('User not found'));
});

app.post('/signin', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json('Form incomplete');
    }
    
    database('login_information')
      .where('email', '=', req.body.email)
      .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if (isValid === true) {
            return database('registered_users')
            .where('email', '=', req.body.email)
            .then(user => {
                res.status(200).json(user[0])
            })
            .catch(() => res.status(400).json('Unable to get user'))
        } else {
            res.status(400).json('Could not sign in');
        }
        })
    .catch(() => res.status(400).json('Could not sign in on this occasion'))
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10)
    
    if (!name || !email || !password) {
        return res.status(400).json('Form incomplete');
    }
    console.log(name, email, password);
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
            .insert(
                console.log('11'),{
                name: name,
                email: loginEmail[0],
                joined: new Date()
            })
            .then(user => {
                res.json(user[0]);
                console.log('1');
            })
        })
        .then(trans.commit)
        .then(res => {
            res.status(200).json('User registered successfully');
        })
        .catch(trans.rollback)
        .catch(() => res.status(400).json('Credentials are not in correct format'));
    })
    .catch(() => res.status(400).json('Invalid details submitted.'));
});

const clarifaiApp = new Clarifai.App({
    apiKey: 'd1cf986c507b4100aa06b7fec7935329'
});

app.post('/analyseImage', (req, res) => {
    clarifaiApp.models.predict(Clarifai.DEMOGRAPHICS_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('Image API failed'));
});
