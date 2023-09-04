const {check} = require("express-validator");
const APIError = require("../../Helper/APIError");
const errorValidator = require("../errorValidator");

exports.addCouponValidation = [
	check("code")
		.notEmpty().withMessage("Coupon code is required")
		.isString().withMessage("Coupon code must be string")
		.isLength({min: 5}).withMessage("Too short coupon code, 5 characters at least")
		.isLength({max: 32}).withMessage("Too long coupon code, 50 characters at most"),

    check("discountPercentage")
        .notEmpty().withMessage("Any coupon must have discount ercentage.")
        .isNumeric().withMessage("Discount percentage must be a number")
        .toFloat()
		.isFloat({ min: 1, max: 100 }).withMessage("Discount percentage must be between 1.0 and 100"),

    check("expirationDate")
        .notEmpty().withMessage("Any coupon must have expiration date.")
        .matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4} (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/g).withMessage('The expiration date must be in this date format MM/DD/YYYY HH:MM:SS like 08/24/2023 18:09:00')
        .custom(value => {
            if(new Date(value) <= new Date()) {
                throw new APIError("The expiration date of the coupon must be after more than the time of creation.")
            }
            return true;
        }),

    check("usageLimit")
        .optional()
        .isInt({min: 1}).withMessage('Usage limit must be an integer number more than or equal to 1'),
        // .custom(value => {
        //     if(value < 1) {
        //         throw new APIError("The minimum usage limit must be one time at least")
        //     }
        //     return true;
        // }),
    
    errorValidator
]

exports.updateCouponValidation = [
	check("code")
		.optional()
        .isString().withMessage("Coupon code must be string")
		.isLength({min: 5}).withMessage("Too short coupon code, 5 characters at least")
		.isLength({max: 32}).withMessage("Too long coupon code, 50 characters at most"),

    check("discountPercentage")
        .optional()
        .isNumeric().withMessage("Discount percentage must be a number")
        .toFloat()
		.isFloat({ min: 1, max: 100 }).withMessage("Discount percentage must be between 1.0 and 100"),

    check("expirationDate")
        .optional()
        .isDate().withMessage('The expiration date must be in teh date format')
        .custom(value => {
            if(value > Date.now()) {
                throw new APIError("The expiration date of the coupon must be after more than the time of creation.")
            }
            return true;
        }),

    check("usageLimit")
        .optional()
        .isInt({min: 1}).withMessage('Usage limit must be an integer number more than or equal to 1'),
        // .custom(value => {
        //     if(value < 1) {
        //         throw new APIError("The minimum usage limit must be one time at least")
        //     }
        //     return true;
        // }),
    
    check("available")
        .optional()
        .isBoolean().withMessage("Available must be boolean"),

    check("deleted")
        .optional()
        .isBoolean().withMessage("Deleted must be boolean"),
		
	errorValidator,
]