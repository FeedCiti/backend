var dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const port = process.env.PORT;

require('./auth.js')(app);

const crypto = require('crypto');

app.post("/shutdown", (req, res) => {
    if(req.ref != 'refs/heads/master') {
        res.json({success: false});
        return;
    }

    var signature = crypto.createHmac('sha1', process.env.SHUTDOWN_TOKEN)
                          .update(req)
                          .digest('hex');
    console.log(signature);
    console.log(req.headers.X-Hub-Signature);
    if(signature != req.headers.X-Hub-Signature) {
        res.json({success: false});
        return;
    }

    process.exit(0);
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
