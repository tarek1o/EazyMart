const {check} = require("express-validator");
const errorValidator = require("../errorValidator")
const checkCategoryExistence = require("../../Shared/checkCategoryExistence");

exports.addSubCategoryValidation = [
	check("name")
		.notEmpty().withMessage("SubCategory name is required")
		.isString().withMessage("SubCategory Name must be string")
		.isLength({min: 2}).withMessage("Too short SubCategory name, 2 characters at least")
		.isLength({max: 32}).withMessage("Too long SubCategory name, 32 characters at most"),
	
	check("category")
		.notEmpty().withMessage("SubCatgory must belong to parent category")
		.isInt({min: 1}).withMessage("Category Id must be an integer more than or equal to 1")
				.custom(async (value) => {
			const result = await checkCategoryExistence(value);
			if(result.success) {
                return true;
            }
			throw new Error(`This category doesn't exist: ${result.notFoundCategories}`);
		}),

    errorValidator
]

exports.updateSubCategoryValidation = [
	check("name")
		.optional()
		.isString().withMessage("SubCategory Name must be string")
		.isLength({min: 2}).withMessage("Too short SubCategory name, 2 characters at least")
		.isLength({max: 32}).withMessage("Too long SubCategory name, 32 characters at most"),

	check("category")
		.optional()
		.isInt({min: 1}).withMessage("Category Id must be an integer more than or equal to 1")
				.custom(async (value) => {
			const result = await checkCategoryExistence(value);
			if(result.success) {
                return true;
            }
			throw new Error(`This category doesn't exist: ${result.notFoundCategories}`);
		}),
		
	check("available")
		.optional()
		.isBoolean().withMessage("Available must be boolean"),

	check("deleted")
		.optional()
		.isBoolean().withMessage("Deleted must be boolean"),
		
	errorValidator,
]