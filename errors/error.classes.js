const httpStatusCodes = {
	OK: 200,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	NOT_FOUND: 404,
	INTERNAL_SERVER: 500,
};

class BaseError extends Error {
	constructor(name, message, body, statusCode, isOperational, stack = false) {
		super(message);

		this.name = name;
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		this.body = body;
		if (stack) Error.captureStackTrace(this);
		else this.stack = null;
	}
}

class Api400Error extends BaseError {
	constructor(message, body = undefined) {
		super("Bad request", message, body, httpStatusCodes.BAD_REQUEST, true);
	}
}

class Api401Error extends BaseError {
	constructor(message, body = undefined) {
		super("Unauthorized", message, body, httpStatusCodes.UNAUTHORIZED, true);
	}
}

class Api404Error extends BaseError {
	constructor(message, body = undefined) {
		super("Not found", message, body, httpStatusCodes.NOT_FOUND, true);
	}
}

class Api500Error extends BaseError {
	constructor(message, body = undefined, isOperational = true) {
		super("Internal server error", message, body, httpStatusCodes.INTERNAL_SERVER, isOperational);
	}
}

class DatabaseError extends Api500Error {
	constructor(message, body = undefined, isOperational = true) {
		super("Database error", { message: message, ...body }, isOperational);
	}
}

class CryptographyError extends Api500Error {
	constructor(message, body = undefined) {
		super("Cryptography error", { message: message, ...body }, false);
	}
}

class ApiTokenExpiredError extends Api401Error {
	constructor() {
		super("Token expired", { flag: "TOKEN_EXPIRED" });
	}
}
module.exports = { httpStatusCodes, BaseError, DatabaseError, CryptographyError, Api400Error, Api401Error, Api404Error, Api500Error, ApiTokenExpiredError };
