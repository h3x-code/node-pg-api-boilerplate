const { auth: auth_config } = require("../config/env.config");

// Argon2 hashing algorythm for password
const argon2 = require("argon2");

// Get DB pool connection
const pool = require("../common/db.connection").pool;

var jwt = require("jsonwebtoken");

// Error classes
const { CryptographyError, DatabaseError, Api401Error, Api500Error } = require("../errors/error.classes");

// Functions
const generateAndSaveTokens = async (user) => {
	try {
		const payload = {
			...user,
		};
		authToken = jwt.sign(payload, auth_config.jwt_secret, { expiresIn: auth_config.jwt_expiration });
		refreshToken = jwt.sign(payload, auth_config.jwt_refresh_secret, { expiresIn: auth_config.jwt_refresh_expiration });

		const query = "UPDATE users SET refresh_token=$1 WHERE username=$2 and email=$3";

		await pool.query(query, [refreshToken, user.username, user.email]);

		return { authToken, refreshToken };
	} catch (error) {
		return new Api500Error("Error while autenticating");
	}
};

// Controllers
exports.login = async (req, res, next) => {
	// User already exist (see user.schema)
	const query = "UPDATE users SET last_login = NOW() WHERE username=$1 OR email=$1 RETURNING username, email, password";

	try {
		const { email, username, password } = (await pool.query(query, [req.body.identicator])).rows[0];
		const is_password_valid = await argon2.verify(password, req.body.password);

		if (is_password_valid) {
			const tokens = await generateAndSaveTokens({ username: username, email: email, ip: req.ip });
			res.status(200).json({ ...tokens });
		} else {
			next(new Api401Error("Bad password"));
		}
	} catch (error) {
		next(new Api500Error("Register failed"));
	}
};

exports.register = async (req, res, next) => {
	try {
		var hash = await argon2.hash(req.body.password);
	} catch (err) {
		next(new CryptographyError("Cryptography error, please contact website owner."));
	}

	const query = "INSERT INTO users (username, password, email, created_on, last_login) VALUES ($1, $2, $3, NOW(), NOW())";
	const user = [req.body.username, hash, req.body.email];

	try {
		const row = await pool.query(query, user);

		const tokens = await generateAndSaveTokens({ username: req.body.username, email: req.body.email, ip: req.ip });
		console.log("New account created: " + req.body.username);
		res.status(201).json({ ...tokens });
	} catch (err) {
		next(new DatabaseError("Register query failed, please contact website owner."));
	}
};

exports.refresh = (req, res, next) => {
	const token = req.get("Refresh").split(" ")[1];

	jwt.verify(token, auth_config.jwt_refresh_secret, async function (err, decoded) {
		try {
			if (err || !decoded.email || !decoded.username || !decoded.ip) throw new Error(); // Handled in catch()
			const query = "SELECT refresh_token FROM users WHERE username=$1 and email=$2 LIMIT 1";
			const db_token = (await pool.query(query, [decoded.username, decoded.email])).rows[0]?.refresh_token;

			if (token != db_token) throw new Error(); // Handled in catch()

			const generatedTokens = await generateAndSaveTokens({ email: decoded.email, username: decoded.username, ip: req.ip });

			res.json(generatedTokens);
		} catch (error) {
			next(new Api401Error("Invalid refresh token"));
		}
	});
};
