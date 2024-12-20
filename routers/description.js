const express = require('express')

const router = express.Router()

const posts = require('../data/posts');

const descriptionController = require('../controlles/descriptionController.js')


router.get('/', descriptionController.index)


module.exports = router

