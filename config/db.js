const mongoose = require('mongoose')

const connectDB =async () => {
    const conn =await  mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        useUnifiedTopology: true
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)
}


module.exports = connectDB



// the code that chatGPT sujasted
// const mongoose = require('mongoose');

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });

//         mongoose.set('useCreateIndex', true);
//         mongoose.set('useFindAndModify', false);

//         console.log('MongoDB Connected...');
//     } catch (error) {
//         console.error(error.message);
//         process.exit(1); // Exit process with failure
//     }
// };

// module.exports = connectDB;
