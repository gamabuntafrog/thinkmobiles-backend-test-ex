const UserForEvents = require('../../models/userForEvents')
const UserEvent = require('../../models/userEvent')
const { NotFound } = require('http-errors')
const paginationDBHelper = require('../../helpers/paginationDBHelper')
const getSortingQuery = require('../../helpers/getSortingQuery')
const { Types } = require('mongoose')
const getPagesCount = require('../../helpers/getPagesCount')

const getUserEvents = async (req, res) => {
  const { currentUserId } = req
  const { id } = req.params

  const { skip, limit } = paginationDBHelper(req.query)
  const { variant, sortBy } = getSortingQuery(req.query)

  const sorting = {}

  if (sortBy) {
    sorting[sortBy] = variant
  }

  const firstStepsOfPipeline = [
    {
      $match: {
        _id: new Types.ObjectId(id)
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
      $unwind: {
        path: '$events',
        preserveNullAndEmptyArrays: true
      }
    }
  ]

  const pipeline = [
    {
      $facet: {
        documents: [
          ...firstStepsOfPipeline,
          {
            $replaceRoot: {
              newRoot: '$events'
            }
          },
          ...(sortBy
            ? [
                {
                  $sort: sorting
                }
              ]
            : []),
          {
            $skip: skip
          },
          {
            $limit: limit
          },
          {
            $project: {
              title: 1,
              description: 1,
              startDate: 1,
              endDate: 1
            }
          }
        ],
        countOfDocuments: [
          ...firstStepsOfPipeline,
          {
            $count: 'count'
          }
        ]
      }
    },
    {
      $project: {
        documents: 1,
        countOfDocuments: { $first: '$countOfDocuments.count' }
      }
    }
  ]

  const [{ countOfDocuments, documents }] = await UserForEvents.aggregate(pipeline).exec()

  // if (!user?.events || user?.creator?.toString() !== currentUserId.toString()) {
  //     throw new NotFound('Events for this user does not exist');
  // }

  const pages = getPagesCount(countOfDocuments, limit)

  res.status(200).json({
    message: 'success',
    code: 200,
    data: {
      pages: pages,
      events: documents
    }
  })
}

module.exports = getUserEvents
