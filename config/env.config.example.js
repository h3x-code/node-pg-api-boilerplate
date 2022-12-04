module.exports = {
	server: {
		port: 3000,
		// DoS protection
		limiter: {
			windowMs: 1 * 60 * 1000, // 1 minute
			max: 30, // 30 requests,
		},
	},
	auth: {
		jwt_secret: "myS33!!creeeT",
		jwt_expiration: "1h",
		jwt_refresh_secret: "myS33creeeTR//fre$$s",
		jwt_refresh_expiration: 60 * 60 * 24 * 7, // 7j
	},
	database: {
		user: "",
		host: "localhost",
		database: "",
		password: "",
		port: 5432,
	},
};
