const mongoose = require('mongoose');
const AutoIncrement = require('../Config/autoIncrementInitialization')

const couponSchema = mongoose.Schema(
    {
        _id:{
            type: mongoose.SchemaTypes.Number
        },
        code: {
            type: String,
            required: [true, 'Any coupon must have a code'],
            minLength: [5, 'Too short coupon code, must be 5 characters at least'],
            maxLength: [50, 'Too long coupon code, must be 50 characters at most'],
            uppercase: true,
            unique: true
        },
        discountPercentage: {
            type: Number,
            required: [true, 'Any coupon must have a discount percentage'],
            min: [1, "The minimum discount is 1%"],
            max: [100, "The minimum discount is 0%"],
        },
        expirationDate: {
            type: Date,
            required: [true, 'Any coupon must have a expiration date'],
        },
        usageLimit: {
            type: Number,
            min: [1, "The minimum usage limit must be one time at least"],
            default: null,
        },
        usedCount: {
            type: Number,
            default: 0,
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
        timestamps: true
    }
);

couponSchema.plugin(AutoIncrement.plugin, {model: 'coupons', startAt: 1});

const couponModel = mongoose.model('coupons', couponSchema);

module.exports = couponModel;