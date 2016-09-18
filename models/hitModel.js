var mongoose = require('mongoose')
var Schema   = mongoose.Schema

var hitSchema = new Schema({	'title' : String,	'url' : String,	'author' : String,	'points' : Number,	'story_text' : String,	'comment_text' : String,	'num_comments' : Number,	'story_id' : Number,	'story_title' : String,	'story_url' : String,	'parent_id' : Number,	'created_at_i' : Number,	'_tags' : Array,	'objectID' : String,	'_highlightResult' : Schema.Types.Mixed,	'created_at' : String});

module.exports = mongoose.model('hit', hitSchema)
