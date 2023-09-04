const {check} = require("express-validator");
const errorValidator = require("../errorValidator");
const APIError = require("../../Helper/APIError");
const couponModel = require("../../Models/couponModel");
const userModel = require("../../Models/userModel");

exports.addOrderValidation = [
    check("user")
        .notEmpty().withMessage("Any review must create by a user")
        .isInt({min: 1}).withMessage("User Id must be an integer more than or equal to 1"),

    check("orderItems")
        .notEmpty().withMessage("Any order must have products")
        .isArray({min: 1}).withMessage("Order items must have one product at least"),

    check("shippingAddress")
        .notEmpty().withMessage("Any order must have a shipping address")
        .isInt({min: 1}).withMessage("Shipping address must be an interger number more than or equal to 1")
        .custom(async (value, {req}) => {
            // const user = await userModel.findById(req.user.id, {addresses: true});
            const user = await userModel.findById(req.body.user, {addresses: true});
            const addressIndex = user.addresses.find((address) => address._id === value)
            if(!addressIndex) {
                throw new APIError("This address does not exist for this user", 404);
            }
            req.shippingAddress = addressIndex;
        }),

    check("mobilePhone")
        .notEmpty().withMessage("Any order must have a mobile phone number")
        .isMobilePhone("any").withMessage("Invalid Mobile Phone"),

    check("coupon")
        .optional()
        .isString().withMessage("coupon must be a string")
        .toUpperCase()
        .custom(async (value) => {
            const coupon = await couponModel.findOne({code: value})
            if(!coupon) {
                throw new APIError("This coupon does not exist")
            }
            if(coupon.expirationDate < new Date() || coupon.usageLimit < coupon.usedCount + 1) {                
                throw new APIError("Expired coupon")
            }
        }),

    check("paymentMethodType")
        .optional()
        .trim()
        .toLowerCase()
        .isIn("cash", "online").withMessage("Payment method can only be cash or online"),

    errorValidator
]