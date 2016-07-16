var express = require('express');
var env = require('../env/' + process.env.NODE_ENV + '.js');
var mongoose = require('mongoose').createConnection(env.db);
var session   = require('express-session');
var passport  = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var path = require('path');

// passport setup

module.exports = function(app) {
	app.use(session({ secret: env.sessionSecret })); // session secret

	passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
	  done(null, obj);
	});

	var url;
	if (process.env.NODE_ENV === 'development') {
		url = "http://localhost:3000/auth/facebook/callback";
	}
	else {
		url = "/auth/facebook/callback"
	}

	passport.use(new FacebookStrategy({
	    clientID: 270860083277976,
	    clientSecret: "574d36e6c5e45f6235e663c3819320dc",
	    callbackURL: url,
	    enableProof: false
	  },
	  function(accessToken, refreshToken, profile, done) {
	  	console.log(profile);
	  	// User.findOne({ 'fb.id': profile.id }, function (err, user) {
	  	// 	if (err) {
	  	// 		return next(err);
	  	// 	}
	  	// 	else {
	  	// 		if (! user) {
	  	// 			var newUser = new User({
	  	// 				fb : profile,
	  	// 				accessToken : accessToken
	  	// 			});

	  	// 			newUser.save(function(err) {
	  	// 				if (err) {
	  	// 					console.log('ERROR SAVING NEW USER');
	  	// 				}
	  	// 			})

	  	// 		}
	  	// 	}
	  	// })

			process.nextTick(function (){
				return done(null, profile);
			});
	  }
	));

	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions

	require('../models/user');
	var User = mongoose.model('User');

	app.get('/', function(req, res, next) {
	  res.render('index');

	});

	app.get('/auth/facebook',
	  passport.authenticate('facebook', { scope: ['user_likes', 'user_friends'] }), function(req, res){

		}
	);

	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { failureRedirect: '/login'}), function(req, res) {
		res.redirect('/index');
	 }
	);

	app.get('/tinder', function(req, res) {
	  res.sendFile(path.resolve('frontend/tinder.html'));
	});

	app.get('/login', function(req, res) {
	  res.sendFile(path.resolve('frontend/login.html'));
	});

	app.get('/login_callback', function(req, res) {
		var token = req.query.access_token;
		// store token under email
		// https://www.eventbriteapi.com/v3/users/me/?token=SESXYS4X3FJ5LHZRWGKQ
		// get primary email
		// db[email_addr]........you konw what to do
	  res.sendFile(path.resolve('frontend/login.html'));
	})

}
