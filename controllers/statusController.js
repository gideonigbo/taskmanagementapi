const Status = require("../schemas/statusSchema")


//Creating a new Status
const createStatus = async (req, res) => {
  try {
    const { name } = req.body
    if (!name) return res.status(401).json({mess: "Name field can not be empty!"})

    const status = await Status.findOne({name})
    if (status) return res.status(400).json({mess: "Status already exist in the DB"})
   
    const newStatus = new Status({name})
    await newStatus.save()

    res.status(200).json(newStatus);
    
  } catch (error) {
    res.status(500).json(error.message)
  }
}



//Getting all Statuses
const allStatuses = async (req, res) => {
  try {
    const statuses = await Status.find()
    if (!statuses) return res.status(400).json({mess: "No status exist in the DB, Please contact Admin to add statuses"})

    res.status(200).json(statuses);
    
  } catch (error) {
    res.status(500).json(error.message)
  }
}



//Deleting a Status
const deleteStatus = async (req, res) => {
  try {
    const id = req.param
    if (!id) return res.status(401).json({mess: "Path ID param can not be empty!"})

    const status = await Status.findByIdAndDelete(id)
    if (!status) return res.status(500).json({mess: `Status with ID: ${id} does not exist/ has been deleted.`})

    res.status(200).json({mess: `Status (${id}) is now deleted`});
    
  } catch (error) {
    res.status(500).json(error.message)
  }
}


module.exports = {
  createStatus,
  allStatuses,
  deleteStatus
}
