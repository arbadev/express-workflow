var mongoose = require('mongoose')
var Schema   = mongoose.Schema

var hitSchema = new Schema({

module.exports = mongoose.model('hit', hitSchema)