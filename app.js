var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
const Hit = require(`${__dirname}/models/hitModel.js`)
const LastHit = require(`${__dirname}/models/lastHitModel.js`)
const hnService = require(`${__dirname}/services/HnService.js`)
const timer =  60 * 1000

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
*/

// db.collections['lasthits'].drop( function(err) {
// console.log('db dropped');
// });
//
//
// db.collections['hits'].drop( function(err) {
// console.log('db dropped');
// });


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
  hnService.initHits(query, hitsNumber).then(hnArray => {
    const hitsArray =  JSON.parse(hnArray).hits
    const lastHit = {
      created_at_i:hitsArray[0].created_at_i
    }
    /*
    // Promise.all([Hit.create(hitsArray), LastHit.create(lastHit)])
        .then(results => console.log('algo'))
        .catch(err => console.log(err))
    */
    Hit.create(hitsArray)
    LastHit.create(lastHit).then(hit => {
      console.log("si se hizo", hit);
    }).catch(err => {
      console.log("error");
    })
    console.log('los hits hits',hitsArray[0].created_at_i);
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
  const query = 'nodejs'
  const hitsNumber = 1000

  LastHit.find({}).then(hits => {
    console.log('hits --------', hits);
    const hit =  hits[0].created_at_i
    console.log('el hit hit',hit);
    return hnService.newHits(query, hitsNumber, hit)
  })
  .then(hnArray => {
    const hitsArray =  JSON.parse(hnArray).hits
    Hit.create(hitsArray)
    if (Array.isArray(hitsArray) && hitsArray.length) {
      LastHit.update({}, {$set:hitsArray[0]})
    }
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
