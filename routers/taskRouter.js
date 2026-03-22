const  express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { createNewTask, addTask, allTaskSheet, getOneTaskSheet, getTaskById, deleteSheet, deleteTask, editTask, editTasksheet } = require('../controllers/taskController')


const taskRouter = express.Router()

taskRouter

//create a task for the first time on a new Task sheet
  .post('/newTask', authMiddleware, createNewTask)

//Create a task on an existing sheet
  .post('/tasksheet/:sheetId/addtask', authMiddleware, addTask)

//Get all tasksheets for a user
  .get('/tasksheets', authMiddleware, allTaskSheet)

//Get all tasks in a sheet for a user
  .get('/tasksheets/:sheetId/tasks', authMiddleware, getOneTaskSheet)

//Get task by ID for a user
  .get('/tasksheets/:sheetId/:taskId', authMiddleware, getTaskById)

//Delete a Task Sheet on an existing sheet
  .delete('/tasksheet/:sheetId', authMiddleware, deleteSheet)

//Delete a Task from a TaskSheet
  .delete('/tasksheet/:sheetId/:taskId', authMiddleware, deleteTask)

//Edit a Task in a Tasksheet i.e any field
  .put('/tasksheet/:sheetId/:taskId', authMiddleware, editTask)

//Edit a Tasksheet 
  .put('/tasksheet/:sheetId/:taskId', authMiddleware, editTasksheet)

module.exports = taskRouter
