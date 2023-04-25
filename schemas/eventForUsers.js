const { body } = require('express-validator')

const eventForUsersSchema = [
  body('title').exists().isLength({ min: 3, max: 30 }),
  body('description').exists().isLength({ max: 60 }),
  body('startDate')
    .exists()
    .custom((value, { req }) => {
      return new Date(value) < new Date(req.body.endDate)
    }),
  body('endDate')
    .exists()
    .custom((value, { req }) => {
      return new Date(value) > new Date(req.body.startDate)
    })
]

module.exports = eventForUsersSchema
