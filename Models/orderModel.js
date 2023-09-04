const mongoose = require("mongoose");
const AutoIncrement = require('../Config/autoIncrementInitialization');
const addressSchema = require("./addressModel");

const orderItems = mongoose.Schema(
    {
        product: {
            type: Number,
            ref: 'product',
            required: [true, 'Order items must have a product']
        },
        quantity: {
            type: Number,
            required: [true, 'Any product in order items must have a quantity']
        },
        color: {
            type: String,
            trim: true        
        }
    },
    {
        _id: false
    }
);

const orderSchema = mongoose.Schema(
    {
        _id: {
            type: mongoose.SchemaTypes.Number
        },
        user: {
            type: Number,
            ref: "users",
            required: [true, 'Any order must belong to a user']
        },
        orderItems: [orderItems],
        shippingAddress: {
            type: addressSchema,
            required: [true, 'Any order must have a shipping address'],
        },
        mobilePhone: {
            type: String,
            trim: true,
            required: [true, 'Any order must have a mobile phone']
        },
        totalOrderPrice: {
            type: Number,
        },
        coupon: {
            type: String,
            uppercase: true,        
        },
        discountPercentage: {
            type: Number,
            default: 0
        },
        shippingPrice: {
            type: Number,
            default: 0,
        },
        paymentMethodType: {
            type: String,
            enum: ['online', 'cash'],
            default: 'cash',
        },
        isPaid: {
            type: Boolean,
            required: [true, 'Any order has a paid status'],
            default: false
        },
        paidAt: {
            type: Date
        },
        orderStatus: {
            type: String,
            enum: ['processing', 'shipping', 'delivered'],
            lowercase: true,
            default: 'processing'
        },
        deliveredAt: {
            type: Date
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

orderSchema.plugin(AutoIncrement.plugin, {model: 'orders', startAt: 1,});

const orderModel = mongoose.model("orders", orderSchema);

module.exports = orderModel;