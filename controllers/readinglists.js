const router = require('express').Router()
const {User, ReadingList}  = require('../models')
const {tokenExtractor} = require('../util/middleware')

router.post('/', async (req, res) => {
  const item = await ReadingList.create(req.body)
  res.json(item)
})

router.get('/', async (req, res) => {
  const readinglists = await ReadingList.findAll()
  res.json(readinglists)
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const readinglist = await ReadingList.findByPk(req.params.id)
    const user = await User.findByPk(req.decodedToken.id)
    if (readinglist) {
      if (user.id === readinglist.userId) {
        readinglist.read = req.body.read
        await readinglist.save()
        res.json(readinglist)
      } else {
        res.status(401).send("wrong user")
      }

    } else {
      res.status(404).end()
    }
} catch(error) {
    next(error)
}
} )

module.exports = router 