module.exports = (app, mongoose, checkJwt) => {

    const { Post, Bank } = require("./schema.js")(mongoose);

    /**
     * GET
     * All food bank information
     */
    app.get('/api/banks', checkJwt, (req, res) => {
        Bank.find({})
        .exec()
        .then(banks => {
            res.status(200).json({
                data: banks
            });
        })
        .catch(err => {
            res.status(400).json({
                error: 'Could not retrieve banks'
            });
            console.log(err);
        })
    });

    /**
     * GET
     * All givings
     */
    app.get('/api/givings', checkJwt, (req, res) => {
        Post.find({})
        .exec()
        .then(posts => {
            res.status(200).json({
                data: posts
            });
        })
        .catch(err => {
            res.status(400).json({
                error: 'Could not retrieve posts' // TODO
            });
            console.log(err);
        })
    });

    /**
     * GET
     * Top 10 givers all time
     */
    app.get('/api/topgivings', checkJwt, (req, res) => {
        Post.aggregate([
            { $unwind : "$user_email" },
            { $group : { _id : "$user_email" , number : { $sum : 1 } } },
            { $sort : { number : -1 } },
            { $limit : 10 }
        ])
        .exec()
        .then(posts => {
            res.status(200).json({
                data: posts
            });
        })
        .catch(err => {
            res.status(400).json({
                error: 'Could not retrieve posts' // TODO
            });
            console.log(err);
        })
    });

    /**
     * GET
     * Givings by specified email
     */
    app.get('/api/givings/:email', checkJwt, (req, res) => {
        Post.find({'user_email': req.params.email})
        .exec()
        .then(posts => {
            res.status(200).json({
                data: posts
            });
        })
        .catch(err => {
            res.status(400).json({
                error: 'Could not retrieve posts' // TODO
            });
            console.log(err);
        })
    });

    /**
     * POST
     * Create a 'giving'
     */
    app.post('/api/give', checkJwt, (req, res) => {
        const post = new Post({
            _id: mongoose.Types.ObjectId(),
            user_email: req.openid.user.email,
            user_image: req.openid.user.picture,
            first_name: req.openid.name.substr(0, req.openid.name.indexOf(' ')),
            lat: req.body.lat,
            lon: req.body.lon,
            message: req.body.message,
            date: new Date().toISOString(),
            give_type: req.body.give_type,
            anonymous: req.body.anonymous
        });

        post.save()
        .then(result => {
            res.status(200).json({
                post: [post]
            });
        })
        .catch(err => {
            res.status(400).json({
                error: 'The post was not created.' // TODO
            })
            console.log(err);
        });
    });
}
