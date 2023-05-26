const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./reading_lists')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList })

Session.belongsTo(User)
User.hasMany(Session)

module.exports = {
    Blog, User, ReadingList, Session
  }