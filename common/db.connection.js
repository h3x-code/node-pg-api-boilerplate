const { Pool } = require("pg");
const config = require("../config/env.config");
const { DatabaseError } = require("../errors/error.classes");

console.log("Connecting to db ...");

const pool = new Pool({
	user: config.database.user,
	host: config.database.host,
	database: config.database.database,
	password: config.database.password,
	port: config.database.port,
});

pool.on("error", (err, client) => {
	throw new DatabaseError(err.message, err, false);
});

// Test connection
pool.query("SELECT NOW()", (err, res) => {
	if (err) throw new DatabaseError("Database connection failed, please check credentials in config filee and retry", err, false);
});

// Check required tables
pool.query("SELECT * FROM users LIMIT 0", (err, res) => {
	if (err) throw new DatabaseError("You must run the init sql script to create tables needed", {}, false);
});

module.exports = { pool };
