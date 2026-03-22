const  express = require('express')
const { signIn, resetRequest, validationPasswordOtp, resetPassword } = require('../controllers/authController')


const authRouter = express.Router()

authRouter

//login a user
  .post('/user/login', signIn)

//reset a user's password
  .post('/password/resetReq', resetRequest)

//reset a user's password
  .post('/password/validate', validationPasswordOtp)

//reset a user's password
  .post('/password/reset', resetPassword)

module.exports = authRouter
