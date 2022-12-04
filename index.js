const config = require("./config/env.config");
const isProduction = process.env.NODE_ENV === "production";

// Create server
const express = require("express");
const app = express();

// Monitor in developpment
// if (!isProduction) app.use(require("express-status-monitor")());

// Optimization & security
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const origin = {
	origin: isProduction ? "https://www.example.com" : "*",
};
app.use(cors(origin));

app.use(compression());
app.use(helmet()); // Secure headers

const limiter = rateLimit(config.server.limiter);
app.use(limiter); // DoS attack and spam

// Connect to db
// require("./common/db.connection");
// Get DB pool connection
global.db = require("./common/db.connection").pool;

// Parse POST body
app.use(express.json());

// Import routers
const UsersRouter = require("./users/users.route");
app.use("/auth", UsersRouter);

// 404 Not Found
const { Api404Error } = require("./errors/error.classes");
app.use((req, res, next) => {
	throw new Api404Error(`Cannot ${req.method} ${req.url}`);
});

// Server error handling/logging
const { logErrorMiddleware, sendErrorMiddleware } = require("./errors/error.handler.middleware");
app.use(logErrorMiddleware);
app.use(sendErrorMiddleware);

// Uncaught error/promise handling
process.on("unhandledRejection", (error) => {
	throw error;
});
const { logError, isOperationalError } = require("./errors/error.handler");
process.on("uncaughtException", (error) => {
	logError(error);

	if (!isOperationalError(error)) {
		process.exit(1);
	}
});

// Listen
app.listen(config.server.port, function () {
	console.log("app listening at port %s", config.server.port);
});
