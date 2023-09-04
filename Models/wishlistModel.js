const mongoose = require("mongoose");
const AutoIncrement = require('../Config/autoIncrementInitialization');

const wishlistSchema = mongoose.Schema(
    {
        _id: {
            type: mongoose.SchemaTypes.Number
        },
        product: {
            type: Number,
            required: [true, 'Any wishlist must belong to a product'],
            ref: 'products'
        },
        user: {
            type: Number,
            required: [true, 'Any wishlist must be created by an user'],
            ref: 'users'
        },
        available: {
            type: Boolean,
            default: true
        },
        deleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
)

wishlistSchema.plugin(AutoIncrement.plugin, {model: 'wishlists', startAt: 1});

wishlistSchema.pre(/^find/, function (next) {
    this.populate([
        {
            path: 'product',
            select: 'title description price imageCover ratingsAverage'
        }
    ])
    next();
})

wishlistSchema.post('find', (docs, next) => {
    docs.forEach((doc) => {
        const productObj = {_id: doc.product._id, title: doc.product.title, description: doc.product.description, price: doc.product.price, imageCover: doc.product.imageCover, ratingsAverage: doc.product.ratingsAverage}
        doc.product = productObj;
    });

    next();
});

const wishlistModel = mongoose.model("wishlists", wishlistSchema);

module.exports = wishlistModel;