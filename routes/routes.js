
var express = require('express');
var env = require('../env/' + process.env.NODE_ENV + '.js');
var mongoose = require('mongoose').createConnection(env.db);
var session   = require('express-session');
var passport  = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var path = require('path');
var urlencode = require('urlencode');

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
	    clientID: process.env.FB_ID,
	    clientSecret: process.env.FB_SECRET,
	    callbackURL: url,
	    enableProof: false
	  },
	  function(accessToken, refreshToken, profile, done) {
	  	console.log(profile);
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
	  	console.log(res);

		}
	);

	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { failureRedirect: '/login'}), function(req, res) {
		res.render('index');
	 }
	);

	app.get('/user/:email', function(req, res, next) {
		var email = urlencode.decode(req.params.email);
		User.findOne({ 'email' : email }, function(err, user) {
			console.log('finding user');
			console.log(user);
			if (err) {
				// return next(err);
			}

			else {
				if (! user) {
					var new_user = new User({
						email: email
					})
					new_user.save(function(err) {
						if (err) {
							console.log('Could not save new User with email', email);
						}
					})
				}
			}
		})
		res.sendFile(path.resolve('frontend/login.html'));
	})


	app.get('/tinder', function(req, res) {
	  res.sendFile(path.resolve('frontend/tinder.html'));
	});

	app.get('/login', function(req, res) {
	  res.sendFile(path.resolve('frontend/login.html'));
	});

	app.get('/login_callback', function(req, res) {
	  res.sendFile(path.resolve('frontend/login_callback.html'));
	})

}
