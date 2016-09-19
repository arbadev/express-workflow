var mongoose = require('mongoose')
var Schema   = mongoose.Schema

var lastHitSchema = new Schema({
	created_at_i : Number
});

module.exports = mongoose.model('lastHit', lastHitSchema)
