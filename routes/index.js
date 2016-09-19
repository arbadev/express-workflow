const express = require('express')
const router = express.Router()
const Hit = require('../models/hitModel.js')

/* GET home page. */
router.get('/', function(req, res, next) {

  const selectAttributes = {
    title: 1,
    author: 1,
    story_title: 1,
    story_url: 1,
    url: 1,
    created_at: 1
  }
  const query = Hit.find({}).select(selectAttributes)

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

})

module.exports = router
