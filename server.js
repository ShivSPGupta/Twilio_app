const twilio = require('twilio');
const express = require('express');
const bodyParser = require('body-parser');
const { configDotenv } = require('dotenv');
configDotenv();

// Twilio credentials
const accountSid = 'ACa73a4a28b0f7f49daeb524cc4c8d0553';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN' ;
const twilioPhoneNumber = 'YOUR_TWILIO_PHONE_NUMBER' || '+13525475206';

const client = twilio(accountSid, authToken);
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Endpoint to handle call response
app.post('/ivr-response', (req, res) => {
    const response = new twilio.twiml.VoiceResponse();
    
    // Get user input from the call
    const selectedOption = req.body.Digits;
    
    if (selectedOption === '1') {
        response.say('Thank you for your interest. We will send you a personalized interview link shortly.');
        // Send a personalized SMS with the interview link
        client.messages.create({
            body: 'Here is your personalized interview link: https://v.personaliz.ai/?id=9b697c1a&uid=fe141702f66c760d85ab&mode=test',
            from: twilioPhoneNumber,
            to: req.body.Caller, // Use the caller's phone number
        })
        .then(message => console.log(`Interview link sent. Message SID: ${message.sid}`))
        .catch(err => console.error('Error sending SMS:', err));
    } else {
        response.say('Thank you. Goodbye.');
    }

    res.type('text/xml');
    res.send(response.toString());
});

// Endpoint to make the call
app.get('/make-call', (req, res) => {

    const toNewPhoneNumber = '+919696179380';
    toNewPhoneNumber = toPhoneNumber
    const toPhoneNumber = req.query.to;

    client.calls.create({
        url: "https://onedrive.live.com/?authkey=%21AEm9E0JuXEPP2EE&id=6D834994D9580DCB%21245717&cid=6D834994D9580DCB&parId=root&parQt=sharedby&o=OneUp",
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

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
