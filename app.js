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
const greeting = require('./intents/greetings');
const newCustomer = require('./intents/newCustomer');
const nearestServices = require('./intents/nearestService');
const { urlencoded } = require('body-parser');
const userInfo = require('./intents/userInfo');
const claimInfo = require('./intents/claimInfo');
const accountsid = "ACc4a63a657767760afa9196f056c01634";
const authToken = "32c4c9044dded03fa6aca6b66af7a7d3";
let twilioNumber = "whatsapp:+14155238886";
const userNumber = "whatsapp:+12098347810";
const twilio = require('twilio')(accountsid, authToken);
const axios = require('axios').default;
const luis_url = "https://statefarmbot.cognitiveservices.azure.com/luis/prediction/v3.0/apps/5820bfd2-8701-48f3-9fac-fd70f143b909/slots/staging/predict?verbose=true&show-all-intents=true&log=true&subscription-key=adfd882aeb7e44c4b1f5c61abc9afb46&query=";
const { getData, addData } = require('./database/db');
let currentTopIntent = "";
let currentTopEntity = "";

// take requests and turn them into usable data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const connectionString = 'postgresql://chandra:m9eEuzqvxFBj4zYr_FY5-A@free-tier14.aws-us-east-1.cockroachlabs.cloud:26257/StateFarm?sslmode=verify-full&options=--cluster%3Dpeewee-ermine-5397';
(async() => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL || connectionString,
        application_name: 'StateFarm',
    });
    /*
    create table users (
    user_id int(10) unsigned NOT NULL AUTO_INCREMENT,  
    user_name varchar(255) NOT NULL,
    phonenumber int(10) NOT NULL, 
    address varchar(255) NOT NULL
    PRIMARY KEY (user_id));
    */
    const statements = [
        `
        CREATE TABLE IF NOT EXISTS users (
            user_id int(10) unsigned NOT NULL AUTO_INCREMENT,
            user_name varchar(255) NOT NULL,
            phonenumber int(10) NOT NULL,
            address varchar(255) NOT NULL,
            PRIMARY KEY (user_id)
        );
        `
    ];
    await client.connect();
    console.log('Connected to CockroachDB');
    for (const statement of statements) {
        await client.query(statement);
    }
    await client.end();
});

const sendMessage = (message, sender, receiver) => {
    twilio.messages.create({
            body: message,
            from: sender,
            to: receiver
        }).then((message) => console.log(message.sid))
        .then(message => console.log(message.sid))
        .catch(err => console.log(err));
}

// define a simple route
app.get('/', (req, res) => {
    sendMessage("Hello World", "+13029244234", "+12098347810");
    res.json({ "message": "Welcome to the application." });
});

app.post('/webhook', (req, res) => {
    // console.log(req.body);
    let msg = req.body.Body;
    let from = req.body.From;
    if (!from.includes("whatsapp")) {
        twilioNumber = "+13029244234";
    } else {
        twilioNumber = "whatsapp:+14155238886";
    }
    console.log(twilioNumber);

    if (currentTopIntent == "CreateTicket") {
        let issue = msg;
        if (issue.toLowerCase() != "cancel") {
            let user_id = from.split(":")[1];
            let ticket_id = Math.floor(Math.random() * 100000);
            let ticket = {
                "ticketId": ticket_id,
                "ticketType": "Complaint",
                "ticketStatus": "Open",
                "ticketDescription": issue,
                "RaisedOn": new Date(),
                "ticketUserId": user_id
            };
            // db['tickets'].push(ticket);
            addData('tickets', ticket);
            sendMessage(`Your ticket has been created. Your ticket id is ${ticket_id}.`, twilioNumber, from);
            currentTopIntent = "";
        } else {
            sendMessage("Your ticket has been cancelled.", twilioNumber, from);
            currentTopIntent = "";
        }
    } else if (currentTopIntent == "GetTicket") {
        let ticket_id = msg;
        let ticket = getData('tickets').filter(ticket => ticket.ticketId == ticket_id)[0];
        if (ticket) {
            let message = `\nYour ticket status is ${ticket.ticketStatus}.\n`;
            message += `Issue: ${ticket.ticketDescription}\n`;
            message += `Raised on: ${ticket.RaisedOn}\n`;
            message += `Ticket Type: ${ticket.ticketType}\n`;
            sendMessage(`${message}`, twilioNumber, from);
            currentTopIntent = "";
        } else {
            sendMessage(`Ticket not found.`, twilioNumber, from);
            currentTopIntent = "";
        }
    } else {
        axios.get(luis_url + `${encodeURIComponent(msg)}`)
            .then((response) => JSON.parse(JSON.stringify(response.data)))
            .then(function(response) {
                console.log(JSON.stringify(response.prediction.entities));
                let topIntent = response.prediction.topIntent;
                console.log(topIntent);
                if (topIntent == "Greetings") {
                    sendMessage(greeting(), twilioNumber, `${from}`);
                } else if (topIntent == "None") {
                    sendMessage("Sorry, I didn't get that. Please try again.", twilioNumber, from);
                } else if (topIntent == "newCustomer" || topIntent == "planDescription") {
                    sendMessage(newCustomer(), twilioNumber, from);
                } else if (topIntent == "userInfo") {
                    let topEntity = response.prediction.entities.infoType[0];
                    currentTopEntity = topEntity;
                    console.log(topEntity);
                    console.log(userInfo(topEntity, from.split(":")[1]));
                    sendMessage(userInfo(topEntity, from.split(":")[1]), twilioNumber, from);
                } else if (topIntent == "CreateTicket") {
                    currentTopIntent = "CreateTicket";
                    sendMessage("Please enter your issue or CANCEL to exit.", twilioNumber, from);
                } else if (topIntent == "GetTicket") {
                    currentTopIntent = "GetTicket";
                    if (response.prediction.entities.ticket == undefined) {
                        sendMessage("Enter your ticket ID or enter CANCEL to exit.", twilioNumber, from);
                    } else {

                        let ticket_id = response.prediction.entities.ticket[0];
                        let ticket = getData('tickets').filter(ticket => ticket.ticketId == ticket_id)[0];
                        if (ticket) {
                            let message = `\nYour ticket status is ${ticket.ticketStatus}.\n`;
                            message += `Issue: ${ticket.ticketDescription}\n`;
                            message += `Raised on: ${ticket.RaisedOn}\n`;
                            message += `Ticket Type: ${ticket.ticketType}\n`;
                            sendMessage(`${message}`, twilioNumber, from);
                        } else {
                            sendMessage(`Ticket not found.`, twilioNumber, from);
                        }
                    }
                } else if (topIntent == "ClaimInfo") {
                    sendMessage(claimInfo(from.split(":")[1]), twilioNumber, from);
                } else if (topIntent == "NearestServices") {
                    let serviceType = response.prediction.entities.LocationType[0];
                    let location = response.prediction.entities.ZipCode[0];
                    sendMessage(nearestServices(serviceType, location, from.split(":")[1]), twilioNumber, from);
                } else {
                    sendMessage(`
*_Banking contact information and FAQs_*\n
Vehicle loan inquiries\n

*Loan Services*
866-207-9079 
M-F 6 a.m.-11 p.m. CT, Sat 8 a.m.-8 p.m. CT, Sun 8 a.m.-6 p.m. CT
Vehicle Loan Help Center
Credit card inquiries - U.S. Bank

*Consumer*
833-728-0344
*Business*
833-728-0345
Deposit account inquiries - U.S. Bank

*Inquiries:*

Copies of account documents (statements, checks, tax forms, account forms, etc.)
Account balances
U.S. Bank online issues
Apple Pay (Debit card)
Historical deposit account inquiries
Checking, savings, money market, CDs, IRAs, and ESAs 
(includes deposit accounts closed prior to 10/9/2020)
U.S. Bank - 24/7
Consumer
800-890-2233
Business
800-688-7119
*Health Savings Accounts (HSAs)*

HSA was in an open status on 7/30/2020 - HSA Bank
800-357-6246
HSA was in a closed status before 7/30/2020 - State Farm
Go to statefarm.com/bankfaq
Benefit Management Account (BMA)

*Life Company ASC*
800-631-4545
M-F 8 a.m. - 4:15 p.m. CT

*Home loan inquiries*
Refer to the Notice of Servicing Transfer letter received in the mail. If the letter is unavailable, call:
866-227-4384
M-F 7:30 a.m.-10 p.m. CT, Sat 7:30 a.m.-4 p.m. CT. Closed Sun
Home equity loans/​Home equity line inquiries

*Account closed or paid off as of 12/10/2020 - FIS*
855-204-8733
M-F 6 a.m.-11 p.m. CT, Sat 8 a.m.-8 p.m. CT, Sun 8 a.m.-6 p.m. CT
Account was open as of 12/11/2020 - Specialized Loan Services, LLC
800-315-4757
M-F 7 a.m.-7 p.m. CT
Technical support regarding online/mobile issues

1-888-559-1922
                    `, twilioNumber, from);
                }
            })
            .catch(function(error) {
                console.log(error);
            });
        res.send('Hello World!');
    }
});

app.post('/callback', (req, res) => {
    console.log(req.body);
    res.send('Hello World!');
});

// listen for requests
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is listening on port 3000");
});