const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp')

// @desc     Get all bootcamps
// @route    Get/api/v1/bootcamps
// acess     Public 
exports.getBootcamps = asyncHandler(async (req, res, next) => {
        const bootcamps = await Bootcamp.find()

        res
        .status(200)
        .json({ success: true, count: bootcamps.length, data:bootcamps })
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

        res.status(200).json({ success: true, data: bootcamp })

})

// @desc     Create new bootcamp
// @route    POST/api/v1/bootcamps
// acess     Private
exports.createBootcamp =asyncHandler( async (req, res, next) => {
    

        const bootcamp = await Bootcamp.create(req.body)

    res.status(201).json({
        success: true,
        data: bootcamp
    })

})

// @desc     update bootcamp
// @route    PUT/api/v1/bootcamps/:id
// acess     Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        
        if (!bootcamp) {
            return next(
                new ErrorResponse(`Bootcam not found with id of ${req.params.id}`, 404))
        }
        

        res.status(200).json({ success: true, data: bootcamp})
})

// @desc     Delete bootcamp
// @route    DELETE/api/v1/bootcamps/:id
// acess     Private
exports.deleteBootcamp =asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        
        if (!bootcamp) {
            return next(
                new ErrorResponse(`Bootcam not found with id of ${req.params.id}`, 404))
        }
        res.status(200).json({ success: true, data: {} }) 
})
