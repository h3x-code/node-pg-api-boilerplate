const { validationResult, checkSchema } = require("express-validator");
const { Api400Error } = require("../errors/error.classes");

const customValidationResult = validationResult.withDefaults({
	formatter: (error) => {
		return {
			param: error.param,
			msg: error.msg,
		};
	},
});

exports.validateRequest = (schema) => {
	return [
		checkSchema(schema),
		(req, res, next) => {
			const errors = customValidationResult(req);
			if (!errors.isEmpty()) {
				throw new Api400Error("Please check these fields before continue", errors.array());
			}
			next();
		},
	];
};
