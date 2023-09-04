const mongoose = require("mongoose");
const AutoIncrement = require('../Config/autoIncrementInitialization');
const productModel = require('./productModel');

const reviewSchema = mongoose.Schema(
    {
        _id: {
            type: mongoose.SchemaTypes.Number
        },
        comment: {
            type: String,
            // required: [true, 'Any product must have a description'],
            minlength: [10, 'Too short comment, must be 10 characters at least'],
            maxlength: [2000, 'Too long comment, must be 2000 characters at most'],
        },
        rating: {
            type: Number,
            required: [true, 'Any review must have a rating'],
            min: [1, 'Rating must be above or equal to 1.0'],
            max: [5, 'Rating must be below or equal to 5.0'],
        },
        product: {
            type: Number,
            required: [true, 'Any review must belong to a product'],
            ref: 'products'
        },
        user: {
            type: Number,
            required: [true, 'Any review must be created by an user'],
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

reviewSchema.plugin(AutoIncrement.plugin, {model: 'reviews', startAt: 1});

reviewSchema.statics.calcAverageRatingsAndQuantity = async function(productId) {
    const result = await this.aggregate([
        {
            $match: { product: productId},
        },
        {
            $group: {
                _id: 'product',
                avgRatings: {$avg: '$rating'},
                ratingsQuantity: {$sum: 1},
            },
        },
    ]);

    if (result.length > 0) {
        await productModel.findByIdAndUpdate(productId, {
            ratingsAverage: result[0].avgRatings,
            ratingsQuantity: result[0].ratingsQuantity,
        });
    } 
    else {
        await productModel.findByIdAndUpdate(productId, {
            ratingsAverage: 0,
            ratingsQuantity: 0,
        });
    }
}

reviewSchema.pre(/^find/, function (next) {
    this.populate([
        {
            path: 'user',
            select: 'firstName lastName'
        }
    ])
    next();
})

reviewSchema.post('find', (docs, next) => {
    docs.forEach((doc) => {
        const userObj = {_id: doc.user._id, firstName: doc.user.firstName, lastName: doc.user.lastName}
        doc.user = userObj;
    });

    next();
});

reviewSchema.post('save' || 'findOneAndDelete', async function () {
    await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

const reviewModel = mongoose.model("reviews", reviewSchema);


module.exports = reviewModel;