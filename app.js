var dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const port = process.env.PORT;

const bodyParser = require('body-parser');
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true
});

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.JWT_URI
    }),

    audience: process.env.AUTH0_CLIENT_ID,
    issuer: process.env.JWT_ISSUER,
    algorithms: ['RS256']
});

require('./auth.js')(app, checkJwt);
require('./api.js')(app, mongoose, checkJwt);

const crypto = require('crypto');

app.post("/shutdown", (req, res) => {
    if(req.body.ref != 'refs/heads/master') {
        res.json({success: false});
        return;
    }

    var signature = crypto.createHmac('sha1', process.env.SHUTDOWN_TOKEN)
                          .update(JSON.stringify(req.body))
                          .digest('hex');
    if(signature != req.headers['x-hub-signature'].substring(5)) {
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
