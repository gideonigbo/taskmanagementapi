const mongoose = require('mongoose')


//Setting up the scehema
const statusSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  }
}, {timestamps: true})

const Status = mongoose.model('Status', statusSchema)

module.exports = Status

