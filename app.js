const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const request = require('request');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post('/', (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    const dob = req.body.dob;


    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                    DATE1: dob
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = 'https://us11.api.mailchimp.com/3.0/lists/5c978c4c80'
    const options = {
        method: 'POST',
        auth: 'auth:0ebab516256ee490eed7710668c0c660-us11'
    }

    const request1 = https.request(url, options, (response) => {

        if (response.statusCode === 200) {
            res.redirect('/sucess.html')
        } else {
            res.redirect('/failure.html')
        }

        response.on('data', (data) => {
            console.log(JSON.parse(data));
        })
    })
    
    request1.write(jsonData);
    request1.end();
})


app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
})


// API ID
// 0ebab516256ee490eed7710668c0c660-us11

// UNIQUE ID
// 5c978c4c80