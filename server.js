const cookieParser = require("cookie-parser")
const express = require("express")
const connectDb = require("./mongoDb/dbConnection")
const priorityRouter = require("./routers/priorityRouter")
const statusRouter = require("./routers/statusRouter")
const otpVerifyRouter = require("./routers/otpRouter")
const userRouter = require("./routers/userRouter")
const authRouter = require("./routers/authRouter")
const taskRouter = require("./routers/taskRouter")
require('dotenv').config()

connectDb()
const port = process.env.PORT || 4000
const server = express()

//App-level middlewaresz
server.use(express.urlencoded({extended: true}))
server.use(express.json())
server.use(cookieParser())


//Routes
server.use('/api', priorityRouter)
server.use('/api', statusRouter)
server.use('/api', otpVerifyRouter)
server.use('/api', userRouter)
server.use('/api', authRouter)
server.use('/api', taskRouter)




server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`)
})
