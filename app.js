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
const accountsid = "ACc4a63a657767760afa9196f056c01634";
const authToken = "32f9e3b54db408d811a61ba7e536c3b4";
const twilioNumber = "+13029244234";
const twilio = require('twilio')(accountsid, authToken);



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
    twilio.messages.create({
        body: 'Hello from Node',
        to: 'whatsapp:+12098347810',
        from: "whatsapp:+14155238886"
    }).then((message) => console.log(message.sid));

    res.json({ "message": "Welcome to the application." });
});

app.post('/webhook', (req, res) => {
    // console.log(req.body);
    let msg = req.body.Body;
    let from = req.body.From;

    res.send('Hello World!');
});


// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});