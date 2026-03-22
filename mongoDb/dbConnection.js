const mongoose = require("mongoose")

const connectDb = async () => {
  try {
    console.log('connecting you to MongoDB...')
    console.log('...in just a few seconds!🤌🏻🤌🏻')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDb Connected!! 😍😍')
    
  } catch (error) {
    console.log(error)
  }
}

module.exports = connectDb
