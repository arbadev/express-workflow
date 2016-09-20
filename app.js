var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
const Hit = require(`${__dirname}/models/hitModel.js`)
const LastHit = require(`${__dirname}/models/lastHitModel.js`)
const FeedService = require(`${__dirname}/services/FeedService.js`)
const timer =  30 * 1000

/*
* Mongodb
*
*/
mongoose.connect('mongodb://localhost/nodeTask')
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Connected  =====> nodeTask DB')
  verifyDb()
  setTimeout(refreshHits, timer)
});


// Reset the database
// db.collections['lasthits', 'hits'].drop(() => { console.log('db dropped') })


/**
* @method verifyDb
* @description Count the number of collections in 'Hit', and populate if
* its empty
* @author Andres Barradas
*/
function verifyDb() {
  Hit.count({})
    .then(count => count == 0 ? getInitHits() : Promise.resolve())
    .catch(err => console.log)
}

/**
* @method getInitHits
* @description Consume FeedService 'initHits' method that returns Hits, set
* the first 'lastHit' value into LastHit model and create the collections in
* Hit model
* @author Andres Barradas
*/
function getInitHits() {
  FeedService.initHits()
    .then(feeds => {
      const { hits } = feeds
      const [lastHit] = hits
      const { created_at_i } = lastHit
      return Promise.all([Hit.create(hits), LastHit.create({ created_at_i })])
    })
    .then(([hits, lastHit]) => console.log('Hits initialised'))
    .catch(err => console.log('error', err))
}

/**
* @method refreshHits
* @description Find the lastHit value into LastHit model and then find the
* latest hits on Hacker News with newHits FeedService newHits method and finally
* call 'setTimeout' with timer and looping it with refreshHits
* @author Andres Barradas
*/
function refreshHits() {
  LastHit.find({})
    .then(lastHits => {
      const [ lastHit ] = lastHits
      const { created_at_i } =  lastHit
      return FeedService.newHits(created_at_i)
    })
    .then(feeds => {
      const { hits } = feeds
      const [lastHit] = hits
      const promises = [Hit.create(hits)]
      if (Array.isArray(hits) && hits.length) {
        promises.push(LastHit.update({}, { $set: lastHit }))
      }
      Promise.all(promises).then(() => console.log('Records refreshed'))
    })
    .catch(err => console.log('error', err))
    setTimeout(refreshHits, timer)
}

/*
*    Routes import
*
*/
var routes = require('./routes/index')
var hits = require('./routes/hits')

var app = express();



/*
*    Routes at app
*
*/
app.use('/', routes)
app.use('/hits', hits)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// Moment setup
app.locals.moment = require('moment');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})


module.exports = app
