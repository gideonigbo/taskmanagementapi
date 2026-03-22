const  express = require('express')
const adminMiddleware = require('../middlewares/adminMiddleware')
const { createStatus, allStatuses, deleteStatus } = require('../controllers/statusController')
const authMiddleware = require('../middlewares/authMiddleware')



const statusRouter = express.Router()

statusRouter

//Create a status
  .post('/addStatus', adminMiddleware, createStatus)

//Get all priorities
  .get('/statuses', authMiddleware, allStatuses)

//Delete a priority
  .delete('/statuses/:id', adminMiddleware, deleteStatus)

module.exports = statusRouter
