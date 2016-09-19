var express = require('express')
var router = express.Router()
const Hit = require('../models/hitModel.js')
const rp = require('request-promise')

/* GET home page. */
router.get('/', function(req, res, next) {

  var query = Hit.find({}, { skip: 10, limit: 5 }).select({'title':1, 'author':1, 'story_title':1, 'story_url':1, 'url':1, 'created_at':1})

  const promise = query.exec()
  promise.then(hits => {
    console.log('render  . . .')
    res.render('hn-feeds',
    {
      title: 'Express',
      hits: hits


    })
  })
  .catch(error => {
    console.log('error ', error)
  })

  const hits = [
    {title:'Cuentos selectos', author:'Andres'},
    {title:'Padre rico, padre pobre', author:'Marian'},
    {title:'El alquimista', author:'Shaco'}
  ]

})

module.exports = router
