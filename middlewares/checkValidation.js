const { validationResult } = require('express-validator')
const { BadRequest } = require('http-errors')
const checkValidation = (req, res, next) => {
  const { errors } = validationResult(req)

  if (errors.length > 0) {
    const error = new BadRequest('Validation error')
    next(error)

    return
  }

  next()
}

module.exports = checkValidation
