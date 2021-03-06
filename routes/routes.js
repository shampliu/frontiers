
var express = require('express');
var env = require('../env/' + process.env.NODE_ENV + '.js');
var mongoose = require('mongoose').createConnection(env.db);
var session   = require('express-session');
// var passport  = require('passport');
// var FacebookStrategy = require('passport-facebook').Strategy;
var path = require('path');
const MongoStore = require('connect-mongo')(session);
var store = new MongoStore({ url: 'mongodb://localhost/frontiers' });

// passport setup

module.exports = function(app) {
	app.use(
	  session({
	  	cookie: {
		    path    : '/',
		    httpOnly: false,
		    maxAge  : 24*60*60*1000
		  },
		  store:  store,
		  secret: env.sessionSecret
		})
	); // session secret


	// passport.serializeUser(function(user, done) {
	//   done(null, user);
	// });

	// passport.deserializeUser(function(obj, done) {
	//   done(null, obj);
	// });

	// var url;
	// if (process.env.NODE_ENV === 'development') {
	// 	url = "http://localhost:3000/auth/facebook/callback";
	// }
	// else {
	// 	url = "/auth/facebook/callback"
	// }

	// passport.use(new FacebookStrategy({
	//     clientID: process.env.FB_ID,
	//     clientSecret: process.env.FB_SECRET,
	//     callbackURL: url,
	//     enableProof: false
	//   },
	//   function(accessToken, refreshToken, profile, done) {
	//   	console.log(profile);
	// 		process.nextTick(function (){
	// 			return done(null, profile);
	// 		});
	//   }
	// ));

	// app.use(passport.initialize());
	// app.use(passport.session()); // persistent login sessions

	require('../models/user');
	var User = mongoose.model('User');

	function login_required(req, res, next) {
		console.log('session',req.session.user);
		console.log(req.path);

		if (!req.session.user) {
			res.redirect('/login');
		} else {
			next();
		}
	}


	app.use('/', function(req, res, next) {
		console.log('session',req.session.user);
		console.log(req.path);

		if (!req.session.user && req.path === '/') {
			res.redirect('/login');
		} else {
			next();
		}
	});
	app.get('/', function(req, res) {
		res.sendFile(path.resolve('frontend/landing.html'));
	});

	app.get('/login', function(req, res) {
		res.sendFile(path.resolve('frontend/login.html'));
	})

	// app.get('/', function(req, res, next) {
	// 	if (req.session.user) {
	// 		res.sendFile(path.resolve('frontend/landing.html'));
	// 		next();
	// 	}
	//   else {
	//   	res.sendFile(path.resolve('frontend/login.html'));
	//   	next();
	//   }

	// });

	// app.get('/auth/facebook',
	//   passport.authenticate('facebook', { scope: ['user_friends'] }), function(req, res){
	//   	console.log(res);

	// 	}
	// );

	// app.get('/auth/facebook/callback',
	//   passport.authenticate('facebook', { failureRedirect: '/login'}), function(req, res) {
	// 	res.render('login');
	//  }
	// );

	app.get('/user/:email', function(req, res) {
		var email = req.params.email;
		User.findOne({ 'email' : email }, function(err, user) {
			if (err) {
				// return next(err);
			} else {
				if (!user) {
					var new_user = new User({
						email: email
					})
					new_user.save(function(err) {
						if (err) {
							console.log('Could not save new User with email', email);
						}
					})
				}
				req.session.user = user || new_user;
			}
			res.send('hello there')
			// res.sendFile(path.resolve('frontend/login.html'));
		})

	})

	app.use('/user/save/:event', login_required);
	app.get('/user/save/:event', function(req, res, next) {
		var user = req.session.user;
		if (user) {
			User.findOne({ email: user.email }, function(err, u) {
				if (u) {
					var event_id = req.params.event;
					u.events.push(event_id);
					u.save();
				}
			})
		}
	});

	app.use('/events', login_required);
	app.get('/events', function(req, res, next) {
		console.log('yes');
		var user = req.session.user;
		if (user) {
			User.findOne({ email: user.email }, function(err, u) {
				if (u) {
					console.log(u.events);
					res.json(u.events);
				}
			})
		}
	});

	app.get('/logout', function(req, res) {
		delete req.session.user;
		res.redirect('/login');
	});

	app.use('/tinder', login_required);
	app.get('/tinder', function(req, res) {
	  res.sendFile(path.resolve('frontend/tinder.html'));
	});

	app.use('/landing', login_required);
	app.get('/landing', function(req, res) {
	  res.sendFile(path.resolve('frontend/landing.html'));
	});

	app.get('/login_callback', function(req, res) {
	  res.sendFile(path.resolve('frontend/login_callback.html'));
	});

	app.use('/saved-event', login_required);
	app.get('/saved-events', function(req, res) {
	  res.sendFile(path.resolve('frontend/saved_events.html'));
	});

}
