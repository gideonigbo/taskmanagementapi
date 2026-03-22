const  express = require('express')
const adminMiddleware = require('../middlewares/adminMiddleware')
const { createUser, allUser, getUserById, updateUser, deleteUser } = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')



const userRouter = express.Router()

userRouter

//Create a user
  .post('/register', createUser)

//Get all users
  .get('/users', adminMiddleware, allUser)

//Get a User
  .get('/user/:id', adminMiddleware, getUserById)
  
//Update a user details
  .put('/user/:id', authMiddleware, updateUser)

//Delete a user
  .delete('/user/:id', authMiddleware, deleteUser)

module.exports = userRouter
