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

const pg = require('pg');

const conString = 'postgres://cwsjnmgo:BhIrq134KifPB_SCa20W5orrjbtZZ_rd@rogue.db.elephantsql.com:5432/cwsjnmgo'

const database = new pg.Client(conString);
database.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  database.query('SELECT NOW() AS "theTime"', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    database.end();
  });
});

app.get('/profile/:email', (req, res) => {
    const { email } = req.params;

    database.query('SELECT * FROM registered_users WHERE email = billal@test.com')
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
    
    database.query('SELECT * FROM login_information WHERE email = billal@test.com')
    //  req.body.email)
      .then(data => {
          console.log('HELLO2');
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

app.post('/register', async (req, res) => {
    const pg = require('pg');
    const conString = 'postgres://cwsjnmgo:BhIrq134KifPB_SCa20W5orrjbtZZ_rd@rogue.db.elephantsql.com:5432/cwsjnmgo'
    const database = new pg.Client(conString);
    
    database.connect(async function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }

    //   await database.query('INSERT INTO login_records(email_address, password) VALUES(email_address, hashedPassword) RETURNING *')
    //   database.query('SELECT NOW() AS "theTime"', function(err, result) {
    //     if(err) {
    //       return console.error('error running query', err);
    //     }
    //     console.log(result.rows[0].theTime);
    //     // >> output: 2018-08-23T14:02:57.117Z
    //     // database.end();
    //   });
    // });



    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10)
    
    if (!name || !email || !password) {
        return res.status(400).json('Form incomplete');
    }
    const text = 'INSERT INTO registered_users(email, password) VALUES($1, $2) RETURNING *'
    const values = ['billal@gmail.com', hashedPassword]
    console.log('hashedPassword', hashedPassword);


    await database.query(text, values)
        .then(res => {
            // console.log('loginEmailssss', res.rows[0])
                // joined: new Date()
            res.status(201).json('User registered successfully')
            console.log('hi2')
        })
        // .catch(trans.rollback)
        // .catch(() => res.status(400).json('Credentials are not in correct format'))
    .catch((err) => 
        console.log(err),
        res.status(400).json('Invalid details submitted.'));
    });
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
