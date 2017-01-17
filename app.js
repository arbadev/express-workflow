var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

/*
* Mongodb
*
*/
mongoose.connect('mongodb://localhost/nodeTask')
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Connected  =====> nodeTask Captains DB')
  console.log('Listening on port =====> 3000')
})


// Reset the database
// db.collections['lasthits', 'hits'].drop(() => { console.log('db dropped') })


// /**
// * @method verifyDb
// * @description Count the number of collections in 'Hit', and populate if
// * its empty
// * @author Andres Barradas
// */
// function verifyDb() {
//   Hit.count({})
//     .then(count => count == 0 ? getInitHits() : Promise.resolve())
//     .catch(err => console.log)
// }


/*
*    Routes import
*
*/
var routes = require('./routes/index')
// var hits = require('./routes/hits')

var app = express()



/*
*    Routes at app
*
*/
app.use('/', routes)
// app.use('/hits', hits)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// Moment setup
app.locals.moment = require('moment')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
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
