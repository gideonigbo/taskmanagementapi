const jwt = require('jsonwebtoken')
const User = require('../schemas/userSchema')


const authMiddleware = async (req, res, next) => {

  //Getting access to the token as it contains the user ID and secrets, the id is then use to check on the datatbase if they are registered.
  const token = req.cookies.token
  const jwtSecret = process.env.JWT_SECRET

  if(!token) {
    return res.status(401).json({mess: 'Please login to continue'})
  }

  try {
    const verifiedToken = jwt.verify(token, jwtSecret)
    if (!verifiedToken) {
      return res.status(403).json({mess: 'Secret is Invalid'})
    }

    const user = await User.findById(verifiedToken.id).select("-password")
    if (!user) {
      return res.status(401).json({mess: 'Invalid ID'})
    }
    
    req.verifiedUser = user

    next()

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
  
}


module.exports = authMiddleware
