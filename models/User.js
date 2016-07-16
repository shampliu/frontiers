var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var UserSchema = new Schema({
	email: String,
	fb: Object,
	eb_events: Array,
	fb_events: Array, 
	settings: Object
}, { 
	minimize: false
});

var User = mongoose.model('User', UserSchema);