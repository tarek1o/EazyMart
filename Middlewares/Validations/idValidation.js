const {check} = require("express-validator");
const errorValidator = require("../errorValidator");

exports.idValidation = [
	check('id')
		.isInt().withMessage('Invalid id format, must be integer'),
    errorValidator
]