var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var UserSchema = new Schema({
	email: String
}, { 
	minimize: false
});

var User = mongoose.model('User', UserSchema);