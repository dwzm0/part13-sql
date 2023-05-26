const { User } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const errorHandler = (error, req, res, next) => {
    if (error.name==='SequelizeValidationError') {
      if (error.message.includes("year")) return res.status(400).send({error: 'The year is incorrect'}) 
      return res.status(400).send({error: error.message})
    } else if (error.name==="SequelizeDatabaseError") {
      return res.status(400).send(`Error: ${error.message}`)
    } 
    next(error)
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const userFinder = async (req, res, next) => {
  req.user = await User.findOne({where: {
      username: req.params.username
  }
  })
  next()
}



module.exports = { errorHandler, tokenExtractor, userFinder }