const { auth: auth_config } = require("../config/env.config");
const jwt = require("jsonwebtoken");

const { Api401Error, ApiTokenExpiredError } = require("../errors/error.classes");

exports.authTokenValid = (req, res, next) => {
	if (req.get("Authorization").split(" ")[0] != "Bearer") throw new Api401Error("You are not authorized to access this ressource.");

	const token = req.get("Authorization").split(" ")[1];

	jwt.verify(token, auth_config.jwt_secret, function (err, decoded) {
		if (err) {
			if (err instanceof jwt.TokenExpiredError) throw new ApiTokenExpiredError();
			else throw new Api401Error("You are not authorized to access this ressource.");
		}
		req.decoded = decoded;

		next();
	});
};
