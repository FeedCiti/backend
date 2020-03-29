module.exports = () => {
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

    return checkJwt;
}