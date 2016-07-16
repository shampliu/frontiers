var express = require('express');
var router = express.Router();
var env = require('../env/' + process.env.NODE_ENV + '.js');
var mongoose = require('mongoose').createConnection(env.db);


require('../models/user');
var User = mongoose.model('User');

router.get('/', function(req, res, next) {
  res.render('index', { test : "enf"} );

});

module.exports = router;
