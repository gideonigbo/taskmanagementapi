const  express = require('express')
const adminMiddleware = require('../middlewares/adminMiddleware')
const { createPriority, allPriorities, deletePriority } = require('../controllers/priorityController')
const authMiddleware = require('../middlewares/authMiddleware')



const priorityRouter = express.Router()

priorityRouter

//Create a priority
  .post('/addPriority', adminMiddleware, createPriority)

//Get all priorities
  .get('/priorities', authMiddleware, allPriorities)

//Delete a priority
  .delete('/priorities/:id', adminMiddleware, deletePriority)

module.exports = priorityRouter
