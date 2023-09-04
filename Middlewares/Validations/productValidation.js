const {check} = require("express-validator");
const errorValidator = require("../errorValidator");
const checkCategoryExistence = require("../../Shared/checkCategoryExistence");
const checkSubCategoryExistence = require("../../Shared/checkSubcategoryExistence");
const {addCategoryIdToRequestBody, addSubCategoriesToRequestBody} = require("../../Shared/addToRequestBody");

exports.addProductValidation = [
	check("title")
		.notEmpty().withMessage("Product title is required")
		.isString().withMessage("Product title must be string")
		.isLength({min: 3}).withMessage("Too short product title, 3 characters at least")
		.isLength({max: 50}).withMessage("Too long product title, 50 characters at most"),

	check("description")
		.notEmpty().withMessage("Product must have a description")
		.isString().withMessage("Product description must be string")
		.isLength({min: 20}).withMessage("Too short product description, must be 20 characters at least"),
	
	check("quantity")
		.notEmpty().withMessage("Product quantity must be")
		.isInt().withMessage("Product quantity must be an integer")
		.custom((value) => {
			if(value >= 0) {
				return true;
			}
			throw new Error("The quantity cannot be a negative number")
		}),
	
	check("sold")
		.customSanitizer(() => 0),

	check("price")
		.notEmpty().withMessage("Any product price must have a price")
		.isNumeric().withMessage("Product price must be a number")
		.toFloat()
		.custom((value) => {
			if(value >= 0 && value <= 200000) {
				return true;
			}
			throw new Error("The price must be between 0.0 and 200,000.0")
		}),
	
	check("discount")
		.optional()
		.isNumeric().withMessage("discount price must be a number")
		.toFloat()
		.custom((value, {req}) => {
			if(value >= 0) {
				if(req.body.price * (value / 100) <= req.body.price) {
					return true;
				}
				throw new Error("Discount can not be more than the price")
			}
			throw new Error("Discount can not be a negative number")
		}),
	
	check("colors")
		.optional()
		.isArray().withMessage("Colors must be an array of strings")
		.custom((value) => {
			if (!value.every((item) => typeof item === 'string')) {
				throw new Error('All elements in the colors array must be strings');
			}
			return true;
		}),

	check("imageCover")
		.notEmpty().withMessage("Any product must have an image as cover")
		.isURL().withMessage("Image cover must be URL"),
	
	check("images")
		.optional()
		.isArray().withMessage("Images must be an array of strings")
		.custom((value) => {
			if (!value.every((item) => typeof item === 'string')) {
				throw new Error('All elements in the images array must be strings');
			}
			return true;
		}),

	check("ratingsAverage")
		.optional()
		.isNumeric().withMessage("Rating average must be a number")
		.toFloat()
		.isFloat({ min: 1, max: 5 }).withMessage("Rating average must be between 1.0 and 5.0"),
	
		
	check("ratingsQuantity")
		.customSanitizer(() => 0),

	check("category")
		.notEmpty().withMessage("Any product must belong to a category")
		.isInt({min: 1}).withMessage("Category Id must be an integer more than or equal to 1")
		.custom(async (value) => {
			const result = await checkCategoryExistence(+value);
			if(result.success) {
                return true;
            }
			throw new Error(`This category doesn't exist: ${result.notFoundCategories}`);
		}),

	check("subCategories")
		.isArray({min: 1}).withMessage("Any product must belong to one subcategory at least")
		.customSanitizer((value) => Array.from(new Set(value)))
		.custom((value) => {
			if (!value.every((item) => typeof (+item) === 'number')) {
				throw new Error('All elements in the subCategories array must be numbers');
			}
			return true;
		})
		.custom(async (value, {req}) => {
			const result = await checkSubCategoryExistence(req, ...value);
			if(result.success) {
                return true;
            }
			throw new Error(`${result.notFoundSubCategories.length > 1 ? "These subcategories don't exist" : "This subcategory doesn't exist"}: ${result.notFoundSubCategories}`);
		})
		.custom(async (value, {req}) => {
			if(req.categoryId.length > 1) {
				throw new Error(`${req.body.subCategories.length > 1 ? "These subcategories don't" : "This subcategory doesn't"} belong to the same category`);
            }
			if(req.categoryId[0]._id !== +req.body.category) {
				throw new Error(`${req.body.subCategories.length > 1 ? "These subcategories don't" : "This subcategory doesn't"} belong to the category of Id = ${req.body.category}`);
			}
			return true;
			
		}),	

	check("brand")
		.optional()
		.isInt({min: 1}).withMessage("Brand Id must be an integer more than or equal to 1"),
	
	errorValidator
]

exports.updateProductValidation = [
	check("title")
		.optional()
		.isString().withMessage("Product title must be string")
		.isLength({min: 3}).withMessage("Too short product title, 3 characters at least")
		.isLength({max: 50}).withMessage("Too long product title, 50 characters at most"),
    
	check("description")
		.optional()
		.isString().withMessage("Product description must be string")
		.isLength({min: 20}).withMessage("Too short product description, must be 20 characters at least"),
	
	check("quantity")
		.optional()
		.isInt().withMessage("Product quantity must be an integer")
		.custom((value) => {
			if(value >= 0) {
				return true;
			}
			throw new Error("The quantity cannot be a negative number")
		}),
	
	check("sold")
		.optional()
		.isInt().withMessage("Sold number must be an integer number")
		.custom((value) => {
			if(value > 0) {
				return true;
			}
			throw new Error("Sold number cannot be a negative number")
		}),
	
	check("price")
		.optional()
		.isNumeric().withMessage("Product price must be a number")
		.toFloat()
		.custom((value) => {
			if(value >= 0 && value <= 200000) {
				return true;
			}
			throw new Error("The price must be between 0.0 and 200,000.0")
		}),
	
	check("discount")
		.optional()
		.isNumeric().withMessage("discount price must be a number")
		.toFloat()
		.custom((value, {req}) => {
			if(value >= 0) {
				if(req.body.price * (value / 100) <= req.body.price) {
					return true;
				}
				throw new Error("Discount can not be more than the price")
			}
			throw new Error("Discount can not be a negative number")
		}),
	
	check("colors")
		.optional()
		.isArray().withMessage("Colors must be an array of strings")
		.custom((value) => {
			if (!value.every((item) => typeof item === 'string')) {
				throw new Error('All elements in the colors array must be strings');
			}
			return true;
		}),

	check("imageCover")
		.optional()
		.isURL().withMessage("Image cover must be URL"),
	
	check("images")
		.optional()
		.isArray().withMessage("Images must be an array of strings")
		.custom((value) => {
			if (!value.every((item) => typeof item === 'string')) {
				throw new Error('All elements in the images array must be strings');
			}
			return true;
		}),

	check("ratingsAverage")
		.optional()
		.isNumeric().withMessage("Rating average must be a number")
		.toFloat()
		.isFloat({ min: 1, max: 5 }).withMessage("Rating average must be between 1.0 and 5.0"),
	
		
	check("ratingsQuantity")
		.optional()
		.isInt({ min: 1}).withMessage("Rating average must be a number and at least 1"),	

	check("category")
		.optional()
		.isInt({min: 1}).withMessage("Category Id must be an integer more than or equal to 1")
		.custom(async (value) => {
			const result = await checkCategoryExistence(+value);
			if(result.success) {
                return true;
            }
			throw new Error(`This category doesn't exist: ${result.notFoundCategories}`);
		})
		.custom(async (value, {req}) => {
			if(!req.body.subCategories) {
				await addSubCategoriesToRequestBody(req);
			}
			return true;
		}),
		
	check("subCategories")
		.optional()
		.isArray({min: 1}).withMessage("Any product must belong to one subcategory at least")
		.customSanitizer((value) => Array.from(new Set(value)))
		.custom((value) => {
			if (!value.every((item) => typeof (+item) === 'number')) {
				throw new Error('All elements in the subCategories array must be numbers');
			}
			return true;
		})
		.custom(async (value, {req}) => {
			const result = await checkSubCategoryExistence(req, ...value);
			if(result.success) {
                return true;
            }
			throw new Error(`${result.notFoundSubCategories.length > 1 ? "The subcategories don't exist" : "The subcategory doesn't exist"}: ${result.notFoundSubCategories}`);
		})
		.custom(async (value, {req}) => {
			if(!req.body.category) {
				await addCategoryIdToRequestBody(req);
			}
			if(req.categoryId.length > 1) {
				throw new Error(`${req.body.subCategories.length > 1 ? "The subcategories don't" : "The subcategory doesn't"} belong to the same category`);
            }
			if(req.categoryId[0]._id !== +req.body.category) {
				throw new Error(`${req.body.subCategories.length > 1 ? "The subcategories don't" : "The subcategory doesn't"} belong to the category of Id = ${req.body.category}`);
			}
			return true;
			
		}),

	check("brand")
		.optional()
		.isInt({min: 1}).withMessage("Brand Id must be an integer more than or equal to 1"),
	
	errorValidator
]