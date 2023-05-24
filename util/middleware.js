const errorHandler = (error, req, res, next) => {
    if (error.name==='SequelizeValidationError') {
      return res.status(400).send({error: error.message})
    } else if (error.name==="SequelizeDatabaseError") {
      return res.status(400).send(`Error: ${error.message}`)
    } 
    next(error)
}


module.exports = { errorHandler }