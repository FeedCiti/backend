module.exports = (app) => {

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

    app.get("/", checkJwt, (req, res) => {
        res.status(200).send();
    });

    app.get('/profile', checkJwt, (req, res) => {
        res.send(JSON.stringify(req.user));
    });

}
