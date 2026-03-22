const nodemailer = require('nodemailer')
const crypto = require('crypto')


const generateOtpToken = () => {
  return {
    otp: Math.floor(10000 + Math.random() * 90000).toString(),
    otpIsvalid: new Date(Date.now() + (30 * 60 * 1000)),
    passwordResetToken: crypto.randomBytes(3).toString('hex') //To be used during password reset as it will be sent encrypted a 3 x 2 random token

  }
}

const sendMail = async ({ mailFrom, mailTo, subject, body }) => {
  try {
    //Verify the App
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.TASK_EMAIL,
        pass: process.env.EMAIL_PASSKEY
      }
    })

    //Verify if transporter is ready
    let verifyTransporter = transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }});

    //Now send the email
    const info = await transporter.sendMail({
      from: mailFrom,
      to: mailTo,
      subject,
      html: body
    })
    console.log(`Email sent successfully to ${mailTo} at ${Date(Date.now())}`)
      return info

  } catch (error) {
    console.log(error.message)
  }
}


module.exports = {
  generateOtpToken,
  sendMail
}

