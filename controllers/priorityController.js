const Priority = require("../schemas/prioritySchema")

//Creating a new priority
const createPriority = async (req, res) => {
  try {
    const { name } = req.body
    if (!name) return res.status(401).json({mess: "Name filed can not be empty!"})

    const priority = await Priority.findOne({name})
    if (priority) return res.status(400).json({mess: "Priority already exist in the DB"})
   
    const newPriority = new Priority({name})
    await newPriority.save()

    res.status(200).json(newPriority);
    
  } catch (error) {
    res.status(500).json(error.message)
  }
}



//Getting all priorities
const allPriorities = async (req, res) => {
  try {
    const priorities = await Priority.find()
    if (!priorities) return res.status(400).json({mess: "No priority exist in the DB, Please contact Admin to add priorities"})

    res.status(200).json(priorities);
    
  } catch (error) {
    res.status(500).json(error.message)
  }
}



//Deleting a priorities
const deletePriority = async (req, res) => {
  try {
    const id = req.param
    if (!id) return res.status(401).json({mess: "Path ID param can not be empty!"})

    const priority = await Priority.findByIdAndDelete(id)
    if (!priority) return res.status(500).json({mess: `priority with ID: ${id} does not exist/ has been deleted.`})

    res.status(200).json({mess: `Priority (${id}) is now deleted`});
    
  } catch (error) {
    res.status(500).json(error.message)
  }
}

module.exports = {
  createPriority,
  allPriorities,
  deletePriority
}
