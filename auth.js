const jwtSecret = 'secret';
const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');

require('./passport');

let generateJWTToken = (user) => {
	return jwt.sign(user, jwtSecret, {
		subject: user.Username,
		expiresIn: '7d',
		algorithm: 'HS256',
	});
};

/**
 * Route loggin in user.
 * @name post/login
 * @function
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 * @returns {JSON} - user data
 */
module.exports = (router) => {
	router.post('/login', (req, res) => {
		passport.authenticate('local', { session: false }, (error, user, info) => {
			if (error || !user) {
				return res
					.status(400)
					.json({ message: 'Something is not right', user: user });
			}
			req.login(user, { session: false }, (error) => {
				if (error) {
					res.send(error);
				}
				let token = generateJWTToken(user.toJSON());
				return res.json({ user, token });
			});
		})(req, res);
	});
};
