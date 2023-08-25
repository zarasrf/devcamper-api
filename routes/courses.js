const express = require('express')
const {getCourses} = require ('../controllers/courses')
// const { createBootcamp } = require('../controllers/bootcamps')

const router = express.Router({ mergeParams: true })

router.route('/').get(getCourses)

module.exports = router
