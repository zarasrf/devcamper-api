const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required:[true, 'Please add a course title']
    },
    description: {
        type: String,
        required: ['Please add a description']
    },
    weeks: {
        type: String,
        required: [true,'Please add number of week']
    },
    tuition: {
        type: Number,
        required: [true,'Please add a tuition']
    },
    minimumSkill: {
        type: String,
        required: [true,'Please add a minimum skill'],
        enum: ['beginner', 'intermediate','asvanced']
    },
    scholorshipAvalable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp:{
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required:true
    },
})

module.exports = mongoose.model('Course', CourseSchema)