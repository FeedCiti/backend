var dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const port = process.env.PORT;

const https = require('https');
const fs = require('fs');

const key = fs.readFileSync('./localhost-key.pem');
const cert = fs.readFileSync('./localhost.pem');

require('./auth.js')(app)

app.get("/shutdown", (req, res) => {
    console.log(req);
});

https.createServer({key, cert}, app).listen(port, () => {
  console.log(`Listening on https://localhost:${port}`);
});
