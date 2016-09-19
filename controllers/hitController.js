const Hit = require('../models/hitModel.js')
const mongoose = require('mongoose')
const assert = require('assert')
const hnService = require('../services/HnService.js')
mongoose.Promise = global.Promise

/**
* hitController.js
*
* @description :: Server-side logic for managing hits.
*/
module.exports = {

  /**
  * hitController.list()
  */
  list: function (req, res) {
    console.log('hitController.list')
    const query = Hit.find()
    assert.equal(query.exec().constructor, global.Promise)
    const promise = query.exec()

    promise.then(hits => {
      return res.status(201).json(hits)
    })
    .catch(error => {
      console.log.error('error ', error)
    })
  },

  /**
  * hitController.show()
  */
  show: function (req, res) {
    console.log('hitController.show')
    const id = req.params.id
    const criteria = {_id: id}
    console.log('id: ', id)
    const query = Hit.findOne(criteria)
    assert.equal(query.exec().constructor, global.Promise)
    const promise = query.exec()

    promise.then(hit => {
      return res.status(201).json(hit)
    })
    .catch(error => {
      return res.status(400).json(hit)
      console.log.error('error ', error)
    })
  },

  /**
  * hitController.remove()
  */
  remove: function (req, res) {
    console.log('hitController.remove')
    const id = req.params.id
    const query = Hit.findByIdAndRemove(id)
    assert.equal(query.exec().constructor, global.Promise)
    const promise = query.exec()
    promise.then(removedHit => {
      console.log(removedHit);
      return res.status(200).json(removedHit)
    })
    .catch(error => {
      return res.status(400).json(removedHit)
      console.log.error('error ', error)
    })
  }
}
