/*

USERNAME: chandra
PASSWORD: m9eEuzqvxFBj4zYr_FY5-A
postgresql://chandra:<ENTER-SQL-USER-PASSWORD>@free-tier14.aws-us-east-1.cockroachlabs.cloud:26257/StateFarm?sslmode=verify-full&options=--cluster%3Dpeewee-ermine-5397
*/

// create express app 
// connect the database

const express = require('express');
const app = express();
const { Client } = require('pg');
const bodyParser = require('body-parser');
// take requests and turn them into usable data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const connectionString = 'postgresql://chandra:m9eEuzqvxFBj4zYr_FY5-A@free-tier14.aws-us-east-1.cockroachlabs.cloud:26257/StateFarm?sslmode=verify-full&options=--cluster%3Dpeewee-ermine-5397';
(async() => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL || connectionString,
        application_name: 'StateFarm',
    });

    const statements = [
        `SELECT NOW() as now`,
    ];
    await client.connect();
    console.log('Connected to CockroachDB');
    client.query('SELECT NOW() as now', (err, res) => {
        if (err) throw err;
        for (let row of res.rows) {
            console.log(JSON.stringify(row));
        }
        client.end();
    });
});

// define a simple route
app.get('/', (req, res) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL || connectionString,
        application_name: 'StateFarm',
    });
    client.connect().then(() => {
        return client.query('SELECT NOW() as now');
    }).then(results => {
        res.send(results.rows[0]);
    }).catch(e => {
        console.error(e.stack);
        res.status(500).send('Error: ' + e.message);
    });
    // res.json({ "message": "Welcome to the application." });
});


// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});