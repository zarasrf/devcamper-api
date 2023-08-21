const Bootcamp = require('../models/Bootcamp')

// @desc     Get all bootcamps
// @route    Get/api/v1/bootcamps
// acess     Public 
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find()

        res
        .status(200)
        .json({ success: true, count: bootcamps.length, data:bootcamps })
        
    } catch (err) {
        res.status(400).json({ success: false })
    }
}

// @desc     Get single bootcamp
// @route    POST/api/v1/bootcamps/:id
// acess     Public 
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id)

        if(!bootcamp) {
            res.status(400).json({ success: false })
        }
        return res.status(200).json({ success: true, data: bootcamp })
    } catch (err) {
        res.status(400).json({ success: false })
    }
}

// @desc     Create new bootcamp
// @route    POST/api/v1/bootcamps
// acess     Private
exports.createBootcamp = async (req, res, next) => {
    
    try {
        const bootcamp = await Bootcamp.create(req.body)

    res.status(201).json({
        success: true,
        data: bootcamp
    })
    } catch (err) {
        res.status(400).json({ success: false})
    }
}

// @desc     update bootcamp
// @route    PUT/api/v1/bootcamps/:id
// acess     Private
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        
        if (!bootcamp) {
            return res.status(400).json({ success: false })
        }

        res.status(200).json({ success: true, data: bootcamp})
    } catch (err) {
        res.status(400).json({ success: false })
    }
}

// @desc     Delete bootcamp
// @route    DELETE/api/v1/bootcamps/:id
// acess     Private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        
        if (!bootcamp) {
            return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: {} }) 
    } catch (err) {
        res.status(400).json({ success: false })
    }

}
