const  express = require('express')
const { otpVerify, otpResend } = require('../controllers/otpController')


const otpVerifyRouter = express.Router()

otpVerifyRouter
//Enter OTP

  .post('/verify-otp', otpVerify)
  .post('/resendOTP', otpResend)


module.exports = otpVerifyRouter
