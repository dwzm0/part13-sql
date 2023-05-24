const router = require('express').Router()


const {tokenExtractor} = require('../util/middleware')
const { Blog, User } = require('../models')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
  }

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: ['name', 'username']
    }
    })
    res.json(blogs)
  })
  
router.post('/', tokenExtractor, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)
        const blog = await Blog.create({...req.body, userId: user.id, date: new Date()})
        res.json(blog)
    } catch(error) {
        next(error)
    }
})

router.get('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        res.json(req.blog)
    } else {
        res.status(404).end()
    }
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
        const user = await User.findByPk(req.decodedToken.id)
        if (req.blog) {
            if (req.blog.userId === user.id) {
                await req.blog.destroy()
                res.status(200).end()
            }else {
                res.status(204).end()
            }  
        }
})

router.put('/:id', blogFinder, async (req, res, next) => {
    try {
        if (req.blog) {
            req.blog.likes = req.body.likes
            await req.blog.save()
            res.json(req.blog)
          } else {
            res.status(404).end()
          }
    } catch(error) {
        next(error)
    }
})
  

  
module.exports = router