const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const Clarifai = require('clarifai');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 5000;
app.listen(port, () => console.log(`Express server started on port ${port}`));

const pg = require('pg');
const conString = 'postgres://cwsjnmgo:BhIrq134KifPB_SCa20W5orrjbtZZ_rd@rogue.db.elephantsql.com:5432/cwsjnmgo'
const database = new pg.Client(conString);

app.post('/signin', async (req, res) => {
    // database.connect(async (error, results) => {
    await database.connect();
    //     if (error) {
    //       return console.error('could not connect to database', error);
    //     }
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json('Form incomplete');
    }

    queryObject = {
        text: 'SELECT * FROM registered_users WHERE email = $1',
        // values: [email]
        values: ['billal@gmail.com']
    };
    
    await database.query(queryObject, async (error, results) => {
        if (error) {
            res.status(400).json('Invalid details submitted.')
        } else {
            console.log('oijjfojofi', results.rows[0]);
            res.status(200).json(results.rows[0]);
    //         // const isValid = bcrypt.compareSync(req.body.password, results[0].hash)
    //         // results.password);

    //         // if (isValid === true) {
    //             console.log('trueeee');
    //             //         return database('registered_users')
    //             //         .where('email', '=', req.body.email)
    //             //         .then(user => {
    //             //             res.status(200).json(user[0])
    //             //         })
    //             //         .catch(() => res.status(400).json('Unable to get user'))
    //             //     } else {
    //             //         res.status(400).json('Could not sign in');
        }
        // await database.end();
    });
        
    //     })
    // .catch(() => res.status(400).json('Could not sign in on this occasion'))
});

app.get('/profile/:email', async (req, res) => {
    // await database.connect();
    // (async (error, results) => {
        // if (error) {
        //   return console.error('could not connect to database', error);
        // }
        const { email } = req.params;

        queryObject = {
            text: 'SELECT * FROM registered_users WHERE email = $1',
            // values: [email]
            values: ['billal@gmail.com']
        };
  
        await database.query(queryObject, async (error, results) => {
            if (error) {
                res.status(404).json('User not found');
            } else {
                // console.log(results[0])
                res.status(200).json(results.rows[0].name);
                // await console.log('resultsresultsresults', results.rows[0]);
            // res.status(200).json(results.name);
            }
            await database.end();
        });
    // });
});

app.post('/register', async (req, res) => {
    database.connect(async (error, results) => {
      if (error) {
        return console.error('could not connect to database', error);
      }

        const { name, email, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10)
        
        if (!name || !email || !password) {
            return res.status(400).json('Form incomplete');
        }

        queryObject = {
            text: 'INSERT INTO registered_users(name, email, password, joined_date) VALUES($1, $2, $3, $4) RETURNING *',
            values: [name, email, hashedPassword, new Date()]
        };

        await database.query(queryObject, async (error, results) => {
            if (error) {
                res.status(400).json('Invalid details submitted.')
            }

            res.status(201).json('User registered successfully');
            await database.end();
        });
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
