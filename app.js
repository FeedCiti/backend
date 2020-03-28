var dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const port = process.env.PORT;

require('./auth.js')(app);

app.post("/shutdown", (req, res) => {
    console.log(req);
});

if(process.env.ENV == 'production') {
    app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
} else {
    const https = require('https');
    const fs = require('fs');
    const key = fs.readFileSync('./localhost-key.pem');
    const cert = fs.readFileSync('./localhost.pem');
    https.createServer({key, cert}, app).listen(port, () => console.log(`Listening on https://localhost:${port}`));
}
