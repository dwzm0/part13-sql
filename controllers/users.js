const router = require('express').Router()
const { User, Blog, Readinglist } = require('../models')
const  { userFinder } = require('../util/middleware')


router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  let user 
  if (req.query.read) {
     user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } ,
      include:[
        {
          model: Blog,
          as: 'readings',
          attributes: { exclude: ['userId', 'createdAt', 'updatedAt']},
          through: {
            attributes: ['id', 'read'],
            where: {
              read: req.query.read === "true"
            }
          },
          
        },
      ],
    })
  } else {
     user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } ,
      include:[
        {
          model: Blog,
          as: 'readings',
          attributes: { exclude: ['userId', 'createdAt', 'updatedAt']},
          through: {
            attributes: ['id', 'read'],
          },
        },
      ],
    })
  }
    if (user) {
      res.json(user)
    } else {
      res.status(404).end()
    }  
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    next(error)
  }
})

router.put('/:username', userFinder, async (req, res, next) => {
    try {
        if (req.user) {
            req.user.username = req.body.username
            await req.user.save()
            res.json(req.user)
        } else {
          res.status(404).end()
        }
    } catch(error) {
        next(error)
    }
})

module.exports = router