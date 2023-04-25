const UserForEvents = require('../../models/userForEvents')
const { NotFound } = require('http-errors')

const getUser = async (req, res) => {
  const { currentUserId } = req
  const { id: userId } = req.params

  const user = await UserForEvents.findOne({
    _id: userId,
    creator: currentUserId
  })
    .select(['username', 'firstName', 'lastName', 'email', 'phoneNumber'])
    .lean()

  if (!user) {
    throw new NotFound('User does not exist')
  }

  res.status(200).json({
    message: 'success',
    code: 200,
    data: {
      user
    }
  })
}

module.exports = getUser
