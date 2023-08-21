const Bootcamp = require('../models/Bootcamp')

// @desc     Get all bootcamps
// @route    Get/api/v1/bootcamps
// acess     Public 
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({success: true, msg: 'Show all bootcamps  ' })
}

// @desc     Get single bootcamp
// @route    POST/api/v1/bootcamps/:id
// acess     Public 
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Show bootcamp ${req.params.id}` })
}

// @desc     Create new bootcamp
// @route    POST/api/v1/bootcamps
// acess     Private
exports.createBootcamp = async (req, res, next) => {
    
    try {
        const bootcamp = await Bootcamp.create(req.body)

    res.status(201).json({
        success:true,
        data:bootcamp

    })
    } catch (error) {
        res.status(400).json({ success: false})
    }
}

// @desc     update bootcamp
// @route    PUT/api/v1/bootcamps/:id
// acess     Private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Update bootcamp ${req.params.id}` })
}

// @desc     Delete bootcamp
// @route    DELETE/api/v1/bootcamps/:id
// acess     Private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Delete bootcamp ${req.params.id}`  })
}