const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const Bootcamp = require('../models/Bootcamp')
const Course = require('../models/Course') //aded

// @desc     Get all bootcamps
// @route    Get/api/v1/bootcamps
// acess     Public 
exports.getBootcamps = asyncHandler(async (req, res, next) => {
        let query

        // copy req.query
        const reqQuery = { ...req.query }

        // fields to exclude
        const removeFields = ['select','sort','page','limit']

        // Loop over removeFields and delete them nfrom reqQuery
        removeFields.forEach(param => delete reqQuery[param]) 

        // create query string
        let queryStr = JSON.stringify(reqQuery)

        // create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

        // finding resource
        query = Bootcamp.find(JSON.parse(queryStr)).populate('courses')

        // select fields
        if(req.query.select) {
            const fields = req.query.select.split(',').join(' ')
            query = query.select(fields)
        }

        // sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt')
        }

        // pagination 
        const page = parseInt(req.query.page, 10) || 1
        const limit = parseInt(req.query.limit, 10) || 25
        const startIndex = ( page -1 ) * limit
        const endIndex = page * limit
        const total = await Bootcamp.countDocuments()

        query = query.skip(startIndex).limit(limit)

        // executing query
        const bootcamps = await query

        // pagination result 
        const pagination = {}

        if(endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }

        if(startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }

        // if (bootcamps.length === 0) {
        //     return next(new ErrorResponse(`bootcamp not found with id of Object`, 404));
        // }

        res
        .status(200)
        .json({ success: true, count: bootcamps.length, pagination, data:bootcamps })
})

// @desc     Get single bootcamp
// @route    POST/api/v1/bootcamps/:id
// acess     Public 
exports.getBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id)

        if(!bootcamp) {
            return next(
                new ErrorResponse(`Bootcam not found with id of ${req.params.id}`, 404))
        }

        res
        .status(200)
        .json({ success: true, data: bootcamp })

})

// @desc     Create new bootcamp
// @route    POST/api/v1/bootcamps
// acess     Private
exports.createBootcamp =asyncHandler( async (req, res, next) => {
    

        const bootcamp = await Bootcamp.create(req.body)

    res
    .status(201)
    .json({
        success: true,
        data: bootcamp
    })

})

// @desc     update bootcamp
// @route    PUT/api/v1/bootcamps/:id
// acess     Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id,{
            new: true,
            runValidators: true
        })
        
        if (!bootcamp) {
            return next(
                new ErrorResponse(`Bootcam not found with id of ${req.params.id}`, 404))
        }

        bootcamp.remove()
        

        res
        .status(200)
        .json({ success: true, data: bootcamp})
})

// @desc     Delete bootcamp
// @route    DELETE/api/v1/bootcamps/:id
// acess     Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id)
        
        if (!bootcamp) {
            return next(
                new ErrorResponse(`Bootcam not found with id of ${req.params.id}`, 404))
        }

        await Course .deleteMany({ bootcamp: bootcamp._id})
        bootcamp.deleteOne()

        // bootcamp.remove() 
        
        res
        .status(200)
        .json({ success: true, data: {} }) 
})

// @desc     get bootcamp whitin a darius
// @route    GET/api/v1/bootcamps/radius/:zipcode/:distance
// acess     Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode)
    const lat = loc[0].latitude
    const lng = loc[0].longitude

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [ [ lng,lat ], radius ] } }
    })

    res
    .status(200)
    .json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
})



