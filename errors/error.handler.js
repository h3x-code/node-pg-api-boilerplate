const { BaseError } = require("./error.classes");

exports.logError = (error) => {
	console.error("ERROR: ", error);
};

exports.isOperationalError = (error) => {
	if (error instanceof BaseError) {
		return error.isOperational;
	}
	return false;
};
