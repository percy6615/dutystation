const rateLimit = require("express-rate-limit");

const createAccountLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour window
	max: 5, // start blocking after 5 requests
	message: "Too many accounts created from this IP, please try again after an hour"
});

const postWrongDamnLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour window
	max: 5, // start blocking after 5 requests
	message: "Too many POST from this IP, please try again after an hour"
});

const allLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 1 min window
	max: 10, // start blocking after 5 requests
	message: "Too many times from this IP, please try again later"
});

module.exports = { createAccountLimiter, postWrongDamnLimiter, allLimiter }