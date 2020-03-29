module.exports = (app, mongoose) => {

    const { requiresAuth } = require("express-openid-connect");

    var Schema = mongoose.Schema;

    var postSchema = new Schema({
        user_email: String,
        user_image: String,
        first_name: String,
        lat: Number,
        lon: Number,
        message: String,
        date: Date,
        give_type: String,
        anonymous: Boolean
    });

    var Post = mongoose.model("Post", postSchema);

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
            date: Date.now().toISOString(), // TODO does this properly save in mongo?
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
