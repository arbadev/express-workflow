var hitModel = require('../models/hitModel.js')
var mongoose = require('mongoose')
var assert = require('assert')
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
    const query = hitModel.find()
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
    const query = hitModel.findOne(criteria)
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
  * hitController.create()
  */
  create: function (req, res) {
    console.log('hitController.create')
    const hit = new hitModel({      title : req.body.title,      url : req.body.url,      author : req.body.author,      points : req.body.points,      story_text : req.body.story_text,      comment_text : req.body.comment_text,      num_comments : req.body.num_comments,      story_id : req.body.story_id,      story_title : req.body.story_title,      story_url : req.body.story_url,      parent_id : req.body.parent_id,      created_at_i : req.body.created_at_i,      _tags : req.body._tags,      objectID : req.body.objectID,      _highlightResult : req.body._highlightResult
    })

    hit.save()
    return res.status(201).json(hit)
  },

  /**
  * hitController.remove()
  */
  remove: function (req, res) {
    console.log('hitController.remove')
    const id = req.params.id
    const query = hitModel.findByIdAndRemove(id)
    assert.equal(query.exec().constructor, global.Promise)
    const promise = query.exec()
    console.log(promise)
    promise.then(removedHit => {
      console.log(removedHit);
      return res.status(201).json(removedHit)
    })
    .catch(error => {
      return res.status(400).json(removedHit)
      console.log.error('error ', error)
    })
  }
}
