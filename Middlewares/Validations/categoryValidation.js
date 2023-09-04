const {check} = require("express-validator");
const errorValidator = require("../errorValidator");

exports.addCategoryValidation = [
	check("name")
		.notEmpty().withMessage("Category name is required")
		.isString().withMessage("Category Name must be string")
		.isLength({min: 3}).withMessage("Too short category name, 3 characters at least")
		.isLength({max: 32}).withMessage("Too long category name, 32 characters at most"),

    errorValidator
]

exports.updateCategoryValidation = [
	check("name")
		.optional()
		.isString().withMessage("Name must be string")
		.isLength({min: 3}).withMessage("Too short category name, 3 characters at least")
		.isLength({max: 32}).withMessage("Too long category name, 32 characters at most"),

		check("available")
		.optional()
		.isBoolean().withMessage("Available must be boolean"),

		check("deleted")
		.optional()
		.isBoolean().withMessage("Deleted must be boolean"),
		
	errorValidator,
]