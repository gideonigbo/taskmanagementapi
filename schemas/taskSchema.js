const mongoose = require('mongoose')

//Setting up the Task item schema
const taskItemSchema = new mongoose.Schema({
  taskTopic:  {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    ref: "Status",
    default: undefined,
    set: v => (v === "" ? undefined : v)
  },
  priority: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    ref: "Priority",
    default: undefined,
    set: v => (v === "" ? undefined : v)
  },
  startTime: {
    type: Date,
    set: v => (v === "" ? undefined : v),
    default: undefined
  },
  dueTime: Date,
  attachments: String

}, {timestamp: true})


//Setting up the Task schema
const taskSheetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    ref: "user"
  },
  sheetTitle: {
    type: String,
    default: "Untitled Task Sheet",
    set: v => (v === "" ? undefined : v)
  },
  tasks: [
    taskItemSchema
  ]

}, {timestamp: true})

const Tasksheet = mongoose.model('Tasksheet', taskSheetSchema)

module.exports = {
  Tasksheet
}
