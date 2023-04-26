const { NotFound, Conflict } = require('http-errors')
const UserForEvents = require('../models/userForEvents')
const { Types } = require('mongoose')

const validateDateForUserEvent = async (userId, body) => {
  const { startDate, endDate } = body

  const pipeline = [
    {
      $match: {
        _id: new Types.ObjectId(userId)
      }
    },
    {
      $lookup: {
        from: 'user_events',
        localField: 'events',
        foreignField: '_id',
        as: 'events'
      }
    },
    {
      $project: {
        isValidDate: {
          $allElementsTrue: {
            $map: {
              input: '$events',
              in: {
                $or: [
                  {
                    $and: [
                      { $lt: [new Date(startDate), '$$this.startDate'] },
                      { $lt: [new Date(endDate), '$$this.startDate'] }
                    ]
                  },
                  {
                    $and: [
                      { $gt: [new Date(startDate), '$$this.endDate'] },
                      { $gt: [new Date(endDate), '$$this.endDate'] }
                    ]
                  }
                ]
              }
            }
          }
        }
      }
    }
  ]

  const [{ isValidDate }] = await UserForEvents.aggregate(pipeline).exec()

  if (!isValidDate) {
    throw new Conflict('You can’t create event for this time')
  }

  return true
}

module.exports = validateDateForUserEvent
