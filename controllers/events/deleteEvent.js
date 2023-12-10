const UserEvent = require('../../models/userEvent')
const UserForEvents = require('../../models/userForEvents')
const { NotFound } = require('http-errors')

const deleteEvent = async (req, res) => {
  const { currentUserId } = req
  const { userId, eventId } = req.params

  const user = await UserForEvents.findById(userId).lean()

  if (!user || user?.creator?.toString() !== currentUserId.toString()) {
    throw new NotFound('User does not exist')
  }

  const event = await UserEvent.findById(eventId)

  if (!user.events.find((id) => id == eventId)) {
    throw new NotFound('Event does not exist')
  }

  await UserEvent.findByIdAndDelete(eventId)

  await UserForEvents.findByIdAndUpdate(userId, {
    $pull: {
      events: event._id
    },
    $inc: {
      eventsCount: -1
    }
  }).lean()

  res.status(204).send()
}

module.exports = deleteEvent
