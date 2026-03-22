const mongoose = require('mongoose')


//Setting up the scehema
const prioritySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  }
}, {timestamps: true})

const Priority = mongoose.model('Priority', prioritySchema)

module.exports = Priority
