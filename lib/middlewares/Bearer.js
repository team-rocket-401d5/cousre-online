'use strict';

const users = require('../models/collections/userCollection.js');

module.exports = (req, res, next) => {
	if (!req.headers.authorization) {
		next('UnAuthorized');
	} else {
		const token = req.headers.authorization.split(' ').pop();

		users
			.authenticateJWT(token)
			.then((user) => {
				req.user = user;
				console.log('u', user);
				next();
			})
			.catch((error) => {
				next('Invalid JWT');
			});
	}
};
