const {check} = require("express-validator");
const errorValidator = require("../errorValidator");

exports.addBrandValidation = [
	check("name")
		.notEmpty().withMessage("Brand name is required")
		.isString().withMessage("Brand Name must be string")
		.isLength({min: 3}).withMessage("Too short Brand name, 3 characters at least")
		.isLength({max: 32}).withMessage("Too long Brand name, 32 characters at most"),
		
    errorValidator
]

exports.updateBrandValidation = [
	check("name")
		.optional()
		.isString().withMessage("Name must be string")
		.isLength({min: 3}).withMessage("Too short Brand name, 3 characters at least")
		.isLength({max: 32}).withMessage("Too long Brand name, 32 characters at most"),

		check("available")
		.optional()
		.isBoolean().withMessage("Available must be boolean"),

		check("deleted")
		.optional()
		.isBoolean().withMessage("Deleted must be boolean"),
		
	errorValidator,
]