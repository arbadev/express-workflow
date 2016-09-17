var express = require('express')
var router = express.Router()
var hitController = require('../controllers/hitController.js')
var bodyParser = require('body-parser')

// create application/json parser
var jsonParser = bodyParser.json()

/*
 * GET
 */
router.get('/', function (req, res) {
  hitController.list(req, res)
})

/*
 * GET
 */
router.get('/:id', jsonParser, function (req, res) {
    hitController.show(req, res)
})

/*
 * POST
 */
router.post('/', jsonParser, function (req, res) {
    hitController.create(req, res)
})

/*
 * DELETE
 */
router.delete('/:id', function (req, res) {
    hitController.remove(req, res)
})

module.exports = router
