const {check} = require("express-validator");
const errorValidator = require("../errorValidator");
const productModel = require("../../Models/productModel");
const wishlistModel = require("../../Models/wishlistModel");

exports.addWishlistValidation = [
	check("product")
		.notEmpty().withMessage("Any wishlist must belong to a product")
		.isInt({min: 1}).withMessage("Product Id must be an integer more than or equal to 1")
		.custom(async (value) => {
			const product = await productModel.findById(value);
			if(product) {
                return true;
            }
			throw new Error("This Product doesn't exist");
		}),

	check("user")
		.notEmpty().withMessage("Any wishlist must create by a user")
		.isInt({min: 1}).withMessage("User Id must be an integer more than or equal to 1")
		.custom(async (value, {req}) => {
			const wishlist = await wishlistModel.find({user: req.body.user, product: req.body.product});
			if(wishlist.length > 0) {
				throw new Error("This User maked this product as a wishlist before");
			}
			return true;
		}),

	errorValidator
]