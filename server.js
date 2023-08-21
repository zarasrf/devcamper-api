const express = require ('express')
const dotenv =require('dotenv')
const morgan = require ('morgan')
const colors = require ('colors')
const connectDB = require('./config/db')


// load env vars 
dotenv.config({ path: './config/config.env'})

// connect to database
connectDB()

// route files
const bootcamps = require ('./routes/bootcamps')

const app = express()

// Body parser
app.use(express.json())

// dev logging middleware 
if (process.env.NODE_ENV === 'development')
app.use(morgan('dev'))

// mount routers
app.use('/api/v1/bootcamps', bootcamps)

const PORT = process.env.PORT || 5000

 const server = app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
)

// handel unhandel promise rejections
process.on ('unhandleRejection',(err, promise) =>{
    console.log(`Error: ${err.message}`.red)

    // close the server & exit process
    server.close(() => process.exit(1))
})