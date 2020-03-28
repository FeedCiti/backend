module.exports = (app) => {

    const { auth, requiresAuth } = require("express-openid-connect");

    const config = {
        required: false,
        auth0Logout: true,
        baseURL: process.env.BASE_URL,
        issuerBaseURL: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        appSessionSecret: process.env.SESSION_SECRET
    };

    app.use(auth(config));

    app.get("/", (req, res) => {
        res.send(req.isAuthenticated() ? "Logged in" : "Logged out");
    });

    app.get('/profile', requiresAuth(), (req, res) => {
        res.send(JSON.stringify(req.openid.user));
    });

}
