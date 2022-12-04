const { logError } = require("./error.handler");

exports.logErrorMiddleware = (err, req, res, next) => {
	logError(err);
	next(err);
};
exports.sendErrorMiddleware = (err, req, res, next) => {
	res.status(err.statusCode || 500).json({
		error: {
			type: err.name,
			message: err.message,
			body: err.body,
		},
	});
};
