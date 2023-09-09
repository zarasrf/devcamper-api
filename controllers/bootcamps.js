const path = require ('path')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
// const geocoder = require('../utils/geocoder')
const Bootcamp = require('../models/Bootcamp')
const Course = require('../models/Course') //aded

// @desc     Get all bootcamps
// @route    GET/api/v1/bootcamps
// acess     Public 
exports.getBootcamps = asyncHandler(async (req, res, next) => {
        res.status(200).json(res.advancedResults)
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
    // Add user to req.body
    req.body.user = req.user.id

    // Checked for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne ({ user: req.user.id })

    // If the user is not an admin, they can only add one bootcamp
    if(publishedBootcamp  && req.user.role !== 'admin') {
        return next(new ErrorResponse(`The user${req.user.id} has already published a bootcamp`, 400))
    }

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
        let bootcamp = await Bootcamp.findById(req.params.id)
        
        if (!bootcamp) {
            return next(
                new ErrorResponse(`Bootcam not found with id of ${req.params.id}`, 404))
        }

        // bootcamp.remove()
        // Make sure  user is bootcamp owner
        if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(
                new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401))
        } 


        // the code that chartgpt suggest and that worked
        bootcamp = await Bootcamp.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true
        })


        // bradtraversy code that didn't worked for me
        // bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true
        // })

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

        // Make sure  user is bootcamp owner
        if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(
                new ErrorResponse(`User ${req.params.id} is not authorized to delete this bootcamp`, 401))
        }

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
    // const loc = await geocoder.geocode(zipcode)
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
// @desc     Upload photo for bootcamp
// @route    PUT/api/v1/bootcamps/:id/photo
// acess     Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcam not found with id of ${req.params.id}`, 404))
    }

    // Make sure  user is bootcamp owner
        if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(
                new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401))
        } 

    if(!req.files){
        return next(
            new ErrorResponse(`Please upload a file`, 400))

    }
    const file = req.files.file

    // Make sure the image is a photo
    if(!file.mimetype.startsWith('image')){
       return next( new ErrorResponse(`Please upload an image file ${req.params.id}`, 400))  
    }

    // Check filesize
    if(file.size > process.env.MAX_FILE_UPLOAD){
        return next( new ErrorResponse(`Please upload an image LESS THAN  ${process.env.MAX_FILE_UPLOAD}`, 400))  
    }

    // Create custom filename 
    file.name = `photo_${bootcamp._id} ${path.parse(file.name).ext}`

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            console.log(err)
            return next( new ErrorResponse(`Problem with file upload`, 500)) 
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })

        res.status(200).json({
            success: true,
            data: file.name

        })
    })

})

    




