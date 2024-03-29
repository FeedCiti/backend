module.exports = (mongoose) => {
    var Schema = mongoose.Schema;

    var postSchema = new Schema({
        user_email: String,
        user_image: String,
        first_name: String,
        lat: Number,
        lon: Number,
        message: String,
        date: Date,
        give_type: Number,
        anonymous: Boolean
    });

    var bankSchema = new Schema({
        name: String,
        phone: String,
        url: String,
        lat: Number,
        lon: Number,
        addr_1: String,
        addr_2: String,
        city: String,
        state: String,
        zip: String
    });

    return {
        Post: mongoose.model("Post", postSchema),
        Bank: mongoose.model("Food_Bank", bankSchema)
    }
}
