const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { generateOtpToken, sendMail } = require('../lib/sendMail')
const User = require('../schemas/userSchema')


//Auth a sign IN
const signIn = async (req, res) => {

  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({mess: "Please provide all fields!"})
    } else {
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(404).json({mess:"User not found. Please register to continue"})
      }
      //Check Password if its correct.
      const checkPwd = await bcrypt.compare(password, user.password)
      if (!checkPwd) return res.status(400).json({mess:"Wrong email or password. Please try again"})
      if (!user.verified) return res.status(400).json({mess:"Please verify your account!"})


      //Generating JWT for Client
      const getToken = (id) => {
        return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: "30m"})
      }

      //Invoking JWT
      const token = getToken(user.id)

      return res
        .cookie('token', token, {httpOnly: true, sameSite: 'strict'})
        .status(200)
        .json({mess: 'Logged in successfully, proceed to make a post.'})
      
    }

  } catch (err) {
    res.status(500).json({mess: err.message})
  }
}


//User forget Password
const resetRequest = async (req, res) => {
  const { email } = req.body
  const time = Date.now()

  if(!email) return res.status(401).json({mess: "email field must be entered"})
  try {
    const user = await User.findOne({email})
    if(!user) return res.status(400).json({mess: 'Account not found. Please contact support or try again'})
    if (time - user.lastpasswordResetTokenSent < 5 * 60 * 1000 ) return res.status(400).json({mess: "Please wait for 5 minutes before resending"})

    
    const { passwordResetToken, otpIsValid } = generateOtpToken()
    user.passwordResetToken = passwordResetToken
    user.passwordResetIsValid = otpIsValid
    user.lastpasswordResetTokenSent = time

    await user.save()

    //Send mail to user with password Token
    try {
      const mailObj = {
        mailFrom: `TaskBoy ${process.env.TASK_EMAIL}`,
        mailTo: email,
        subject: "TaskBoy Password Reset",
        body: `
          <h3> Hi ${user.username}</h3>
          <p> Please find your password reset Token: ${passwordResetToken}, proceed to verify, Do not share with anyone</p>
          <p> Please do not reply to this email. </p>
        `
      };

      const info = sendMail(mailObj);
      console.log(info);
    } catch (error) {
      console.log(`Sending Message-User controller- ${error.message}`);
    }

    res.status(200).json({mess: "New Token sent to registered mail"}) 
  } catch (error) {
    console.log(error)
  }
}


//verify reset password OTP
const validationPasswordOtp = async (req, res) => {
  const { resetToken , email } = req.body

  try {
    const user = await User.findOne({email}).select("-password")
    if (!user) return res.status(401).json({mess: "user not found"})
    if (user.passwordTokenverified) return res.status(400).json({mess: 'User password reset Token already validated'})
    if (user.passwordResetToken !== resetToken && user.passwordResetIsValid < Date.now ()) return res.status(400).json({mess: 'Wrong OTP or has expired'})

    user.passwordTokenverified = true
    user.passwordResetIsValid = undefined
    user.passwordResetToken = undefined

    await user.save()
    res.status(200).json({mess:'Access granted to change password'})
  } catch (error) {
    console.log(error)
  }
}


//verify reset password OTP
const resetPassword = async (req, res) => {
  const { newPassword, email } = req.body

  try {
    const user = await User.findOne({email}).select("-password")
    if (!user.passwordTokenverified) return res.status(400).json({mess: 'User password reset Token not validated'})

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    await user.save()
    
    res.status(200).json({mess:'Password Changed Successfully'})
  } catch (error) {
    console.log(error)
  }
}


//Auth a logOut 

const signOut = async (req, res) => {
  //Getting access to the token as it contains the user ID and secrets, the id is then use to check on the datatbase if they are registered.
  const token = req.cookies.token
  try {
    if (!token) return res.status(404).json({mess:'Already logged out. Please login'}); // Already logged out

    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'Strict'
    })
    res.status(200).json({mess: 'Logged Out!'})
  } catch (error) {
      res.status(500).json({message: error.message});
  }
}



module.exports = {
  signIn,
  signOut,
  resetRequest,
  validationPasswordOtp,
  resetPassword
}
