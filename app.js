var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
const Hit = require(`${__dirname}/models/hitModel.js`)
const hnService = require(`${__dirname}/services/HnService.js`)
const timer =  10 * 1000

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


/*
*    Reset database
*

db.collections['hits'].drop( function(err) {
console.log('db dropped');
});
*/

/*
*    Verify  db records
*
*/

function verifyDb() {
  Hit.count({}).then(count => {
    console.log('Records  =====>', count)
    if (count == 0) {
      getInitHits()
    }
  })
  .catch(error => {
    console.log('error', error)
  })
}

/*
*    Set init records
*
*/

function getInitHits() {
  const query = 'nodejs'
  const hitsNumber = 1000
  const request = hnService.initHits(query, hitsNumber)

  request.then(hnArray => {
    const hitsArray =  JSON.parse(hnArray).hits
    Hit.create(hitsArray)
    console.log('Hits loaded . . .')
  })
  .catch(error => {
    console.log('error', error)
  })
}

/*
*    Refresh records
*
*/

function refreshHits() {
  console.log('Refreshing records . . .')

  Hit.find({}).sort({'created_at': -1}).limit(1).then(hit => {
    const query = 'nodejs'
    const hitsNumber = 1000
    var latestDb = Number(hit[0].created_at_i)
    var latestOa = 0
    if (latestDb > latestOa) {
      latestOa = latestDb
    }
    console.log('latestDb', latestDb)
    console.log('latestOa', latestOa)
    const request = hnService.newHits(query, hitsNumber, latestOa)
    console.log('Latest Hit =====>', latestOa)
    return request
  }).then(hnArray => {
    const hitsArray =  JSON.parse(hnArray).hits
    Hit.create(hitsArray)
    console.log('refreshed records . . .')
  }).catch(error => {
    console.log('error', error)
  })

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
*    Set mommentjs
*
*/

app.locals.moment = require('moment');

/*
*    Routes at app
*
*/

app.use('/', routes)
app.use('/hits', hits)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

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
