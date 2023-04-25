const UserForEvents = require('../../models/userForEvents')
const { BadRequest, Conflict } = require('http-errors')
const User = require('../../models/user')

const addUser = async (req, res) => {
  const { currentUserId } = req
  const { username, firstName, lastName, email, phoneNumber } = req.body

  const isUserExists = await UserForEvents.findOne({
    email,
    username
  }).lean()

  if (isUserExists) {
    throw new Conflict('User already exists')
  }

  const user = await UserForEvents.create({
    username,
    firstName,
    lastName,
    email,
    phoneNumber,
    creator: currentUserId
  })

  await User.findByIdAndUpdate(currentUserId, {
    $push: {
      usersForEvents: user._id
    }
  }).lean()

  res.status(201).json({
    message: 'success',
    code: 201
  })
}

module.exports = addUser
