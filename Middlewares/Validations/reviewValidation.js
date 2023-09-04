const {param, check} = require("express-validator");
const errorValidator = require("../errorValidator");
const productModel = require("../../Models/productModel");
const reviewModel = require("../../Models/reviewModel");

exports.addReviewValidation = [
	check("comment")
		.optional()
		.isString().withMessage("Comment must be string")
		.isLength({min: 10}).withMessage("Too short comment, 10 characters at least")
		.isLength({max: 2000}).withMessage("Too long comment, 2000 characters at most"),

	check("rating")
		.notEmpty().withMessage("Any review must have rating")	
		.isNumeric().withMessage("Rating must be a number")
		.toFloat()
		.isFloat({ min: 1, max: 5 }).withMessage("Rating average must be between 1.0 and 5.0"),

	check("product")
		.notEmpty().withMessage("Any review must belong to a product")
		.isInt({min: 1}).withMessage("Product Id must be an integer more than or equal to 1")
		.custom(async (value) => {
			const product = await productModel.findById(value);
			if(product) {
                return true;
            }
			throw new Error("This Product doesn't exist");
		}),

	check("user")
		.notEmpty().withMessage("Any review must create by a user")
		.isInt({min: 1}).withMessage("User Id must be an integer more than or equal to 1")
		.custom(async (value, {req}) => {
			const review = await reviewModel.find({user: req.body.user, product: req.body.product});
			if(review.length > 0) {
				throw new Error("This User added review for this product before");
			}
			return true;
		}),

	errorValidator
]

exports.updateReviewValidation = [
	param("id")
		.custom(async (value, {req}) => {
			const review = await reviewModel.findById(value, {user: 1});
			if(!review) {
				throw new Error("This review is not exist");
			}
			if(review.user._id !== req.user.id) {
				throw new Error("This review dosen't belong to the current user");
			}
			return true;
		}),

	check("comment")
		.optional()
		.isString().withMessage("Comment must be string")
		.isLength({min: 10}).withMessage("Too short comment, 10 characters at least")
		.isLength({max: 2000}).withMessage("Too long comment, 2000 characters at most"),

	check("rating")
		.optional()
		.isNumeric().withMessage("Rating must be a number")
		.toFloat()
		.isFloat({ min: 1, max: 5 }).withMessage("Rating average must be between 1.0 and 5.0"),
	
	errorValidator
]