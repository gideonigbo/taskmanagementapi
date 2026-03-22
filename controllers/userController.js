const bcrypt = require('bcrypt')
const { generateOtpToken, sendMail } = require('../lib/sendMail')
const User = require('../schemas/userSchema')


//Get All Users
const allUser = async (req, res) => {
  try {
    const users = await User.find().select("-password")
    if( users.length === 0) return res.status(200).json({message:"No user has been registered, register a user."})
    res.status(200).json({users})
  } catch (err) {
    res.status(500).json({mess: err.message})
  }
} 


//Get a user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({mess: `ID path field cannot be empty!`})
    } else {
      const user = await User.findById(id)
      if(!user) 
        return res.status(200).json({mess:`User with ID: ${id} can not be found.`})
      res.status(200).json({user})
    }    
  } catch (err) {
    res.status(500).json({mess: err.message})
  }
}


//Create a user
const createUser = async (req, res) => {
  const { username, email, password } = req.body
  const time = Date.now()

  try {
    if (!username || !email || !password) {
      return res.status(400).json({message:'All fields are required!'})
    } else {
      //Check if the email exists in the db
      const existingUser = await User.findOne({email})
      if (existingUser) { return res.status(404).json({mess: "User already registered, please proceed to login"})}

      //To ensure the password is hashed
      const hashedPwd = await bcrypt.hash(password, 10)

      //Generate Otp to be added for user creation
      const { otp, otpIsvalid} = generateOtpToken()

      const newUser = new User({ ...req.body, password: hashedPwd, otp, otpIsvalid, lastOtpSent: time})
      
      await newUser.save()

      //Trying to send a mail to the newly registered user
      try {
        const mailObj = {
          mailFrom: `TaskBoy ${process.env.TASK_EMAIL}`,
          mailTo: email,
          subject: 'TaskBoy OTP Verification',
          body: `
            <h3> Welcome to <strong>BlogBook </strong>, ${username}</h3>
            <p> Please find your OTP: ${otp}, proceed to verify, Do not share with anyonw</p>
            <p> Please do not reply to this email. </p>
          `
        }

        const info = sendMail(mailObj)
        console.log(info)
      } catch (error) {
        console.log(`Sending Message-User controller- ${error.message}`)
      }

      res.status(200).json({mess: "New user created successfully!. OTP sent to registered mail"}) 
    }
    
  } catch (err) {
    res.status(500).json({mess: err.message})
  }
}


//Delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({mess: `ID path field cannot be empty!`})
    } else {
      const user = await User.findByIdAndDelete(id)
      if(!user) 
        return res.status(200).json({mess:`User with ID: ${id} has been deleted /cannot be found.`})
      res.status(200).json({mess: 'Deleted..'})
    }    
  } catch (err) {
    res.status(500).json({mess: err.message})
  }
}

//Update user details
const updateUser = async (req, res) => {
  try {
    const { username, email , password } = req.body
    const { id } = req.params
    if (!id || !username || !email || !password ) {
      return res.status(400).json({mess: `All fields including ID path field and  cannot be empty!`})
    } else {
      const user = await User.findByIdAndUpdate(
        id,
        {username, email, password},
        {new: true}
      )
      if(!user) 
        return res.status(200).json({mess:`User with ID: ${id} cannot be found.`})
      res.status(200).json({user})
    }    
  } catch (err) {
    res.status(500).json({mess: err.message})
  }
}


module.exports = {
  allUser,
  getUserById,
  createUser,
  deleteUser,
  updateUser
}
