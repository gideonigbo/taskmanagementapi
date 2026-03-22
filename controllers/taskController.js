const { Tasksheet } = require("../schemas/taskSchema")
const { updateSearchIndex } = require("../schemas/userSchema")


//create a task for the first time on a new Task sheet
const createNewTask = async (req, res) => {
  const user = req.verifiedUser
  const { sheetTitle, taskname, description, status, priority, startTime, dueTime } = req.body

  let parsedStartTime = startTime ? new Date(startTime) : undefined
  let parsedDueTime = dueTime ? new Date(dueTime) : undefined

  try {

    //Handles if pasrsed date is null or undefined by returnin undefined or return date if valid
    if(isNaN(parsedStartTime?.getTime())) parsedStartTime = undefined
    if(isNaN(parsedDueTime?.getTime())) parsedDueTime = undefined

    if(!taskname || !dueTime) return res.status(400).json({mess: "Kindly ensure the fields: taskname, startTime, dueTime are not empty"})
    
    const newTask = new Tasksheet({
      userId: user._id,
      sheetTitle,
      tasks: [
        {
          taskTopic: taskname,
          description,
          status,
          priority,
          startTime: parsedStartTime,
          dueTime: parsedStartTime
        }
      ]
    })

    await newTask.save()
    res.status(200).json(newTask)
    
  } catch (error) {
    res.status(500).json(error.message)
  }
}



//create a task on an existing Task sheet
const addTask = async (req, res) => {
  const user = req.verifiedUser
  const { sheetId } = req.params
  const { taskname, description, status, priority, startTime, dueTime } = req.body

  let parsedStartTime = startTime ? new Date(startTime) : undefined
  let parsedDueTime = dueTime ? new Date(dueTime) : undefined

  try {

    //Handles if pasrsed date is null or undefined by returnin undefined or return date if valid
    if(isNaN(parsedStartTime?.getTime())) parsedStartTime = undefined
    if(isNaN(parsedDueTime?.getTime())) parsedDueTime = undefined

    if(!sheetId) return res.status(400).json({mess: 'All path values must be entered'})
    if(!taskname || !dueTime) return res.status(400).json({mess: "Kindly ensure the fields: taskname, startTime, dueTime are not empty"})

    console.log(sheetId)

    const taskSheet = await Tasksheet.findById(sheetId)
    if (!taskSheet) return res.status(400).json({mess: "Tasksheet ID is wrong/ can not be found in DB"})
    
    const tokenUserId = user._id.toString()
    const taskSheetUserId = taskSheet.userId.toString()

    if (tokenUserId !== taskSheetUserId) return res.status(400).json({mess: "You do not have permission to add a task to this taskSheet"})

    taskSheet.tasks.push({
      taskTopic: taskname,
      description,
      status,
      priority,
      startTime: parsedStartTime,
      dueTime: parsedDueTime
    })

    await taskSheet.save()
    res.status(200).json({mess:'New Task added Successfully'})
    
  } catch (error) {
    res.status(500).json(error.message)
  }
}



//Get all taskSheet for a user
const allTaskSheet = async (req, res) => {
  const user = req.verifiedUser
  try {
    const taskSheet = await Tasksheet.find({userId: user._id})
    //Populating to hide their ids and display well
      .populate('userId','-password -_id -otpIsvalid -passwordResetToen -passwordResetIsValid -lastpasswordResetTokenSent -passwordTokenverified')
      .populate('tasks.status', '-_id')
      .populate('tasks.priority', '-_id')

    if (!taskSheet) return res.status(400).json({mess: "User has not created any TaskSheet, hence any task"})
    res.status(200).json(taskSheet) 
  } catch (error) {
    res.status(500).json(error.message)
  }
}



//Get all taskSheet for a user
const getOneTaskSheet = async (req, res) => {
  const user = req.verifiedUser
  const sheetId = req.params

  try {
    if(!sheetId) return res.status(400).json({mess: 'All path values must be entered'})
    const taskSheet = await Tasksheet.findById(sheetId)
    //Populating to hide their ids and display well
      .populate('userId','-password -_id -otpIsvalid -passwordResetToen -passwordResetIsValid -lastpasswordResetTokenSent -passwordTokenverified')
      .populate('tasks.status', '-_id')
      .populate('tasks.priority', '-_id')
    
    const taskSheetUser = taskSheet.userId.toString()
    const tokenUser = user._id.toString()

    if(!taskSheet) return res.status(400).json({mess: 'TaskSheet does not exist/ can not be found in DB'})
    if (taskSheetUser !== tokenUser) return res.status(401).json({mess: 'You can not view this Task sheet/ do not have permission'})

    res.status(200).json(taskSheet) 
  } catch (error) {
    res.status(500).json(error.message)
  }
}



//Get a task by ID for a user
const getTaskById = async (req, res) => {
  const user = req.verifiedUser
  const { sheetId, taskId } = req.params

  try {
    if(!sheetId || !taskId) return res.status(400).json({mess: 'All path values must be entered'})
    const taskSheet = await Tasksheet.findById(sheetId)
    //Populating to hide their ids and display well
      .populate('userId','-password -_id -otpIsvalid -passwordResetToen -passwordResetIsValid -lastpasswordResetTokenSent -passwordTokenverified')
      .populate('tasks.status', '-_id')
      .populate('tasks.priority', '-_id')
    
    const taskSheetUser = taskSheet.userId.toString()
    const tokenUser = user._id.toString()

    if(!taskSheet) return res.status(400).json({mess: 'TaskSheet does not exist/ can not be found in DB'})
    if (taskSheetUser !== tokenUser) return res.status(401).json({mess: 'You can not view this Task sheet/ do not have permission'})

    const singleTask = taskSheet.tasks.find(item => item._id.toString() === taskId.toString())
    if (!singleTask) return res.status(400).json({mess: `Task with ID: ${taskId} can not be found in DB/ has been deleted`})

    res.status(200).json(singleTask)

  } catch (error) {
    res.status(500).json(error.message)
  }
}


//Delete a Tasksheet user
const deleteSheet = async (req, res) => {
  const user = req.verifiedUser
  const { sheetId } = req.params

  try {
    if(!sheetId) return res.status(400).json({mess: 'All path values must be entered'})
    const taskSheet = await Tasksheet.findBy(sheetId)
    //Populating to hide their ids and display well
      .populate('userId','-password -_id -otpIsvalid -passwordResetToen -passwordResetIsValid -lastpasswordResetTokenSent -passwordTokenverified')
      .populate('tasks.status', '-_id')
      .populate('tasks.priority', '-_id')
    
    const taskSheetUser = taskSheet.userId.toString()
    const tokenUser = user._id.toString()

    if(!taskSheet) return res.status(400).json({mess: 'TaskSheet does not exist/ has been deleted from the DB'})
    if (taskSheetUser !== tokenUser) return res.status(401).json({mess: 'You can not delete this Task sheet/ do not have permission to delete this task sheet'})
    taskSheet.tasks = []
    await taskSheet.delete()

    res.status(200).json({mess: 'Deleted!'})

  } catch (error) {
    res.status(500).json(error.message)
  }
}


//Delete a task from a Tasksheet user
const deleteTask = async (req, res) => {
  const user = req.verifiedUser
  const { sheetId, taskId } = req.params

  try {
    if(!sheetId || !taskId) return res.status(400).json({mess: 'All path values must be entered'})
    const taskSheet = await Tasksheet.findBy(sheetId)
    //Populating to hide their ids and display well
      .populate('userId','-password -_id -otpIsvalid -passwordResetToen -passwordResetIsValid -lastpasswordResetTokenSent -passwordTokenverified')
      .populate('tasks.status', '-_id')
      .populate('tasks.priority', '-_id')
    
    const taskSheetUser = taskSheet.userId.toString()
    const tokenUser = user._id.toString()

    if(!taskSheet) return res.status(400).json({mess: 'TaskSheet does not exist/ has been deleted from the DB'})
    if (taskSheetUser !== tokenUser) return res.status(401).json({mess: 'You can not delete this Task / do not have permission to delete this task'})

    const singleTask = taskSheet.tasks.find(item => item._id.toString() === taskId.toString())

    taskSheet.tasks.pull(singleTask)
    
    await taskSheet.save()

    res.status(200).json({mess: 'Task Deleted!'})

  } catch (error) {
    res.status(500).json(error.message)
  }
}



//Edit a task from a Tasksheet user
const editTask = async (req, res) => {
  const user = req.verifiedUser
  const { sheetId, taskId } = req.params
  const { taskname, description, status, priority, startTime, dueTime } = req.body

  let parsedStartTime = startTime ? new Date(startTime) : undefined
  let parsedDueTime = dueTime ? new Date(dueTime) : undefined

  try {

    //Handles if pasrsed date is null or undefined by returnin undefined or return date if valid
    if(isNaN(parsedStartTime?.getTime())) parsedStartTime = undefined
    if(isNaN(parsedDueTime?.getTime())) parsedDueTime = undefined

    if(!sheetId || !taskId) return res.status(400).json({mess: 'All path values must be entered'})

    const taskSheet = await Tasksheet.findBy(sheetId)
    //Populating to hide their ids and display well
      .populate('userId','-password -_id -otpIsvalid -passwordResetToen -passwordResetIsValid -lastpasswordResetTokenSent -passwordTokenverified')
      .populate('tasks.status', '-_id')
      .populate('tasks.priority', '-_id')
    
    const taskSheetUser = taskSheet.userId.toString()
    const tokenUser = user._id.toString()

    if(!taskSheet) return res.status(400).json({mess: 'TaskSheet does not exist/ has been deleted from the DB'})
    if (taskSheetUser !== tokenUser) return res.status(401).json({mess: 'You can not delete this Task / do not have permission to delete this task'})

    const singleTask = taskSheet.tasks.find(item => item._id.toString() === taskId.toString())
    if (taskTopic !== undefined) singleTask.taskTopic = taskname
    if (description !== undefined) singleTask.description = description
    if (status !== undefined) singleTask.status = status
    if (priority !== undefined) singleTask.priority = priority
    if (startTime !== undefined) singleTask.startTime = parsedStartTime
    if (dueTime !== undefined) singleTask.dueTime = parsedDueTime

    //Attachments can be added later, I want to be sure everything works jare
    
    await taskSheet.save()

    res.status(200).json(taskSheet.singleTask)

  } catch (error) {
    res.status(500).json(error.message)
  }
}



//Edit a Tasksheet user
const editTasksheet = async (req, res) => {
  const user = req.verifiedUser
  const { sheetId } = req.params
  const { sheetName } = req.body

  try {
    if(!sheetId) return res.status(400).json({mess: 'All path values must be entered'})
    if(!sheetTitle) return res.status(400).json({mess: 'All fields values must be entered'})

    const updates = {}
    updates.sheetTitle = sheetName
    const taskSheet = await Tasksheet.findByIdAndUpdate('sheetId', updates, {new: true})
    //Populating to hide their ids and display well
      .populate('userId','-password -_id -otpIsvalid -passwordResetToen -passwordResetIsValid -lastpasswordResetTokenSent -passwordTokenverified')
      .populate('tasks.status', '-_id')
      .populate('tasks.priority', '-_id')
    
    const taskSheetUser = taskSheet.userId.toString()
    const tokenUser = user._id.toString()

    if(!taskSheet) return res.status(400).json({mess: 'TaskSheet does not exist/ has been deleted from the DB'})
    if (taskSheetUser !== tokenUser) return res.status(401).json({mess: 'You can not updates this TaskSheet/ do not have permission to update this taskSheet'})

    
    await taskSheet.save()
    res.status(200).json(taskSheet)

  } catch (error) {
    res.status(500).json(error.message)
  }
}

module.exports = {
  createNewTask,
  addTask,
  allTaskSheet,
  getOneTaskSheet,
  getTaskById,
  deleteSheet,
  deleteTask,
  editTask,
  editTasksheet
}
