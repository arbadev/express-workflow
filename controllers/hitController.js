var hitModel = require('../models/hitModel.js');
var mongoose = require('mongoose');
var assert = require('assert')
mongoose.Promise = require('bluebird');

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
    console.log('hitController.list');
    const query = hitModel.find();
    assert.equal(query.exec().constructor, require('bluebird'));
    const promise = query.exec();

    promise.then(hits => {
      return res.status(201).json(hits);
    })
    .catch(error => {
      console.log.error('error ', error)
    });

    return promise;
  },

  /**
  * hitController.show()
  */
  show: function (req, res) {
    var id = req.params.id;
    hitModel.findOne({_id: id}, function (err, hit) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting hit.',
          error: err
        });
      }
      if (!hit) {
        return res.status(404).json({
          message: 'No such hit'
        });
      }
      return res.json(hit);
    });
  },

  /**
  * hitController.create()
  */
  create: function (req, res) {
    console.log('hitController.create');
    var hit = new hitModel({      title : req.body.title,      url : req.body.url,      author : req.body.author,      points : req.body.points,      story_text : req.body.story_text,      comment_text : req.body.comment_text,      num_comments : req.body.num_comments,      story_id : req.body.story_id,      story_title : req.body.story_title,      story_url : req.body.story_url,      parent_id : req.body.parent_id,      created_at_i : req.body.created_at_i,      _tags : req.body._tags,      objectID : req.body.objectID,      _highlightResult : req.body._highlightResult
    });

    console.log('before hit');

    hit.save();
    return res.status(201).json(hit);
    console.log('after hit');

  },

  /**
  * hitController.update()
  */
  update: function (req, res) {
    var id = req.params.id;
    hitModel.findOne({_id: id}, function (err, hit) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting hit',
          error: err
        });
      }
      if (!hit) {
        return res.status(404).json({
          message: 'No such hit'
        });
      }

      hit.created_at = req.body.created_at ? req.body.created_at : hit.created_at;      hit.title = req.body.title ? req.body.title : hit.title;      hit.url = req.body.url ? req.body.url : hit.url;      hit.author = req.body.author ? req.body.author : hit.author;      hit.points = req.body.points ? req.body.points : hit.points;      hit.story_text = req.body.story_text ? req.body.story_text : hit.story_text;      hit.comment_text = req.body.comment_text ? req.body.comment_text : hit.comment_text;      hit.num_comments = req.body.num_comments ? req.body.num_comments : hit.num_comments;      hit.story_id = req.body.story_id ? req.body.story_id : hit.story_id;      hit.story_title = req.body.story_title ? req.body.story_title : hit.story_title;      hit.story_url = req.body.story_url ? req.body.story_url : hit.story_url;      hit.parent_id = req.body.parent_id ? req.body.parent_id : hit.parent_id;      hit.created_at_i = req.body.created_at_i ? req.body.created_at_i : hit.created_at_i;      hit._tags = req.body._tags ? req.body._tags : hit._tags;      hit.objectID = req.body.objectID ? req.body.objectID : hit.objectID;      hit._highlightResult = req.body._highlightResult ? req.body._highlightResult : hit._highlightResult;
      hit.save(function (err, hit) {
        if (err) {
          return res.status(500).json({
            message: 'Error when updating hit.',
            error: err
          });
        }

        return res.json(hit);
      });
    });
  },

  /**
  * hitController.remove()
  */
  remove: function (req, res) {
    var id = req.params.id;
    hitModel.findByIdAndRemove(id, function (err, hit) {
      if (err) {
        return res.status(500).json({
          message: 'Error when deleting the hit.',
          error: err
        });
      }
      return res.status(204).json();
    });
  }
};
