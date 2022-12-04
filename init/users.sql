CREATE TABLE users (
	user_id serial PRIMARY KEY,
	username VARCHAR ( 50 ) UNIQUE NOT NULL,
	password TEXT NOT NULL,
	email VARCHAR ( 255 ) UNIQUE NOT NULL,
	refresh_token TEXT,
	created_on TIMESTAMP NOT NULL,
    last_login TIMESTAMP
);