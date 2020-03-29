module.exports = (app, mongoose) => {

    const { requiresAuth } = require("express-openid-connect");
    const { Post, Bank } = require("./schema.js")(mongoose);

    app.get('/api/banks', requiresAuth(), (req, res) => {
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

    app.get('/api/givings', requiresAuth(), (req, res) => {
        Post.find({})
        .exec()
        .then(posts => {
            res.status(200).json({
                data: posts
            });
        })
        .catch(err => {
            res.status(400).json({
                error: 'Could not retrieve posts'
            });
            console.log(err);
        })
    });

    app.post('/api/give', requiresAuth(), (req, res) => {
        const post = new Post({
            _id: mongoose.Types.ObjectId(),
            user_email: req.openid.user.email,
            user_image: req.openid.user.picture,
            first_name: req.openid.given_name, // TODO is this the right one?
            lat: req.body.lat,
            lon: req.body.lon,
            message: req.body.message,
            date: new Date().toISOString(), // TODO does this properly save in mongo?
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
