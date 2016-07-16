var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var UserSchema = new Schema({
	email: String,
	fb: {type: Object, default: null},
	eb_events: {type: Array, default: []},
	fb_events: {type: Array, default: []}, 
	settings: {type: Object, default: {}}
}, { 
	minimize: false
});

var User = mongoose.model('User', UserSchema);