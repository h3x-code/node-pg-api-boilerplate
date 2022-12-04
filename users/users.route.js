// Init router
const express = require("express");
const router = express.Router();

// Validation
const { validateRequest } = require("../common/validation.middleware");

// Token check
const AuthMiddleware = require("../common/auth.middleware");

// Controllers
const UsersController = require("./users.controller");

// Schemas
const { registerSchema, loginSchema, refreshSchema } = require("./users.schema");
const { checkSchema, validationResult } = require("express-validator");

// Routes initialization
router.post("/register", validateRequest(registerSchema), UsersController.register);

router.post("/login", validateRequest(loginSchema), UsersController.login);

router.post("/refresh", validateRequest(refreshSchema), UsersController.refresh);

// // Token protected route
router.post("/private", AuthMiddleware.authTokenValid, (req, res) => {
	res.send("Authorized !");
});

// Export router
module.exports = router;
