const { sendMail, generateOtpToken } = require("../lib/sendMail");
const User = require("../schemas/userSchema");

const otpVerify = async (req, res) => {
  const { otp, email } = req.body

  try {
    const user = await User.findOne({email}).select("-password")
    if (!user) return res.status(401).json({mess: "user not found"})
    if (user.verified) return res.status(400).json({mess: 'User already verified'})

    if (user.otp && user.otp !== otp || !user.otp) return res.status(400).json({mess: "Invalid OTP"})
    if (user.otpIsvalid < Date.now) return res.status(400).json({mess: "OTP has expired"})

    user.verified = true
    user.otpIsvalid = undefined
    user.otp = undefined

    await user.save()
    res.status(200).json({mess: "User is now verified. Proceed to login"})

  } catch (error) {
    console.log(error)
  }
}

const otpResend = async (req, res) => {
  const { email } = req.body
  const time = Date.now()
  try {
    const user = await User.findOne({email}).select("-password")
    if (!user) return res.status(401).json({mess: "user not found"})
    if (user.verified) return res.status(400).json({mess: 'User already verified'})
    if (time - user.lastOtpSent < 5 * 60 * 1000 ) return res.status(400).json({mess: "Please wait for 5 minutes before resending"})
    
    const { otp, otpIsvalid } = generateOtpToken()

    user.otp = otp
    user.otpIsvalid = otpIsvalid
    user.lastOtpSent = time

    await user.save();

    //Trying to resendsend a mail to the newly registered user
    try {
      const mailObj = {
        mailFrom: `BlogBook ${process.env.BLOGBOOK_EMAIL}`,
        mailTo: email,
        subject: "BlogBook OTP Verification",
        body: `
            <h3> Hi ${user.username}</h3>
            <p> Please find your new OTP: ${otp}, proceed to verify, Do not share with anyone</p>
            <p> Please do not reply to this email. </p>
          `,
      };

      const info = sendMail(mailObj);
      console.log(info);
    } catch (error) {
      console.log(`Sending Message-User controller- ${error.message}`);
    }
    res.status(200).json({mess: "New OTP sent to registered mail"}) 
  
  } catch (error) {
    console.log(error)
  }
}


module.exports = {
  otpVerify,
  otpResend
}
