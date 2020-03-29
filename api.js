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
    app.get('/api/givings', (req, res) => {
        Post.find({}).sort([['date', -1]]).limit(10)
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
     * All of the user's givings
     */
    app.get('/api/mygivings', checkJwt, (req, res) => {
        Post.find({'user_email': req.user.email})
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
    app.get('/api/givingsEmail', checkJwt, (req, res) => {
        Post.find({'user_email': req.query.email})
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
            user_email: req.user.email,
            user_image: req.user.picture,
            first_name: req.user.name.substr(0, req.user.name.indexOf(' ')),
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


    app.get('/api/nearby', checkJwt, (req, res) => {
        var lat = parseFloat(req.query.lat);
        var lon = parseFloat(req.query.lon);
        var dis = parseFloat(req.query.dis) * 1.609344;

        const PI = 3.141592653589793;
        const earthRadius = 6378;

        var upperLat = lat + (dis / earthRadius) * (180 / PI);
        var lowerLat = lat - (dis / earthRadius) * (180 / PI);
        var upperLon = lon + (dis / earthRadius) * (180 / PI) / Math.cos(lat * PI / 180);
        var lowerLon = lon - (dis / earthRadius) * (180 / PI) / Math.cos(lat * PI / 180);

        var getBanks = (posts) => {
            Bank.find({'lat': {$gte: lowerLat, $lte: upperLat}, 'lon': {$gte: lowerLon, $lte: upperLon}})
            .exec()
            .then(banks => {
                res.status(200).json({
                    posts: posts,
                    banks: banks
                });
            })
            .catch(err => {
                res.status(400).json({
                    error: 'Could not retrieve banks' // TODO
                });
                console.log(err);
            });
        }

        Post.find({'lat': {$gte: lowerLat, $lte: upperLat}, 'lon': {$gte: lowerLon, $lte: upperLon}})
        .exec()
        .then(posts => getBanks(posts))
        .catch(err => {
            res.status(400).json({
                error: 'Could not retrieve posts' // TODO
            });
            console.log(err);
        });
    });
}
