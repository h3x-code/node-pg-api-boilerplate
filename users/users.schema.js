const { checkSchema } = require("express-validator");

exports.registerSchema = {
	username: {
		escape: true,
		trim: true,
		isLength: {
			errorMessage: "Username should be at least 4 chars long and less than 20",
			options: { min: 4, max: 20 },
			bail: true, // Skip username unique validation (or any below)
		},
		isAlphanumeric: {
			options: ["fr-FR", { ignore: "-" }],
			errorMessage: "Username must only contains letters, numbers, and dash (-)",
			bail: true,
		},
		matches: {
			options: [/^[^-].*[^-]$/],
			errorMessage: "Username shouldd not start or end with a dash",
			bail: true,
		},
		custom: {
			options: async (value) => {
				const res = await global.db.query("SELECT COUNT(user_id) FROM users WHERE username=$1", [value]);
				if (res.rows[0].count > 0) {
					throw new Error("Username already taken");
				} else {
					return true;
				}
			},
		},
	},
	email: {
		trim: true,
		isEmail: {
			value: true,
			errorMessage: "Please provide a valid email",
			bail: true,
		},
		normalizeEmail: {
			options: { gmail_remove_dots: false },
		},
		custom: {
			options: async (value) => {
				const res = await global.db.query("SELECT COUNT(user_id) FROM users WHERE email=$1", [value]);
				if (res.rows[0].count > 0) {
					throw new Error("Email already taken");
				} else {
					return true;
				}
			},
		},
		escape: true,
	},
	password: {
		isStrongPassword: {
			errorMessage: "Password must be greater than 10 and contain at least one uppercase letter, one lowercase letter, and one number",
			options: {
				minLength: 10,
				maxLength: 128,
				minLowercase: 1,
				minUppercase: 1,
				minNumbers: 1,
			},
		},
		trim: true,
	},
};

exports.loginSchema = {
	identicator: {
		escape: true,
		trim: true,
		notEmpty: { value: true, errorMessage: "Field required", bail: true },
		custom: {
			options: async (value) => {
				const res = await global.db.query("SELECT COUNT(user_id) FROM users WHERE username=$1 OR email=$1", [value]);
				if (res.rows[0].count > 0) {
					return true;
				} else {
					throw new Error("Username / email does not exists.");
				}
			},
		},
	},
	password: {
		trim: true,
		notEmpty: { value: true, errorMessage: "Field required" },
	},
};

exports.refreshSchema = {
	Refresh: {
		in: ["headers"],
		trim: true,
		notEmpty: { value: true, errorMessage: "Refresh token required", bail: true },
		matches: {
			options: [/^Bearer .*$/],
			errorMessage: "Invalid token shape",
		},
	},
};
