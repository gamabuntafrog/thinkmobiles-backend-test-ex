const User = require('../../models/user')
const UserForEvents = require('../../models/userForEvents')
const UserEvent = require('../../models/userEvent')
const { NotFound } = require('http-errors')

const deleteUser = async (req, res) => {
  const {
    currentUserId,
    currentUser: { usersForEvents }
  } = req
  const { id: userId } = req.params

  if (!usersForEvents.find((id) => id == userId)) {
    throw new NotFound('User does not exist')
  }

  const userForEvents = await UserForEvents.findById(userId).lean()

  if (!userForEvents) {
    throw new NotFound('User does not exist')
  }

  const { events } = userForEvents

  await User.findByIdAndUpdate(currentUserId, {
    $pull: {
      usersForEvents: userId
    }
  })

  await UserForEvents.findByIdAndDelete(userId)

  console.log(events)

  await UserEvent.deleteMany({ _id: { $in: events } })

  res.status(204).send()
}

module.exports = deleteUser
