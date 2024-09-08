const twilio = require('twilio');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const toPhoneNumber = '+919696179380';

const client = require("twilio")(accountSid, authToken);


app.post('/', (req, res) => {
    const response = new twilio.twiml.VoiceResponse();

    response.say({
        voice: 'alice',
        language: 'en-US'
    }, 'Hello, I am speaking Mr. Santosh. Your CV matches our job requirements, and you are interested. Press 1 for an interview link, and press 2 to disconnect the call. Thank you.');

    const gather = response.gather({
        numDigits: 1,
        action: '/handle-keypress', 
        method: 'POST'
    });

    gather.say({
        voice: 'alice',
        language: 'en-US'
    }, 'Please make a selection.');

    res.type('text/xml');
    res.send(response.toString());
});


app.post('/handle-keypress', (req, res) => {
    const response = new twilio.twiml.VoiceResponse();
    const selectedOption = req.body.Digits;
    const callerNumber = req.body.From; 

    if (selectedOption === '1') {
        response.say('Thank you for your interest. We will send you a personalized interview link shortly.');


        client.messages.create({
            body: 'Here is your personalized interview link: https://v.personaliz.ai/?id=9b697c1a&uid=fe141702f66c760d85ab&mode=test',
            from: twilioPhoneNumber,
            to: callerNumber,
        })
        .then(message => console.log(`Interview link sent. Message SID: ${message.sid}`))
        .catch(err => console.error('Error sending SMS:', err));

        response.hangup();
    } else if (selectedOption === '2') {
        response.say('Thank you. The call will now disconnect.');
        response.hangup();
    } else {
        response.say('Invalid option. Goodbye.');
        response.hangup();
    }

    res.type('text/xml');
    res.send(response.toString());
});

app.get('/make-call', (req, res) => {
    client.calls.create({
        url: "http://demo.twilio.com/docs/voice.xml",
        to: toPhoneNumber,
        from: twilioPhoneNumber,
    })
    .then(call => {
        console.log(`Call initiated. Call SID: ${call.sid}`);
        res.send('Call initiated');
    })
    .catch(err => {
        console.error('Error initiating call:', err);
        res.status(500).send('Failed to initiate call');
    });
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
