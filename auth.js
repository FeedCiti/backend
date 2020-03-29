module.exports = (app, checkJwt) => {

    app.get("/", checkJwt, (req, res) => {
        res.status(200).send();
    });

    app.get('/profile', checkJwt, (req, res) => {
        res.send(JSON.stringify(req.user));
    });

}
