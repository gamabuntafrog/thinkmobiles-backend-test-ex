const paginationHelper = require('../../helpers/paginationDBHelper')
const getPagesCount = require('../../helpers/getPagesCount')
const User = require('../../models/user')
const getSortingQuery = require('../../helpers/getSortingQuery')
const { Types } = require('mongoose')

const getUsers = async (req, res) => {
  const { currentUserId, query } = req

  const { sortBy, variant } = getSortingQuery(query)
  const { skip, limit } = paginationHelper(query)

  const sorting = {}

  if (sortBy) {
    sorting[sortBy] = variant
  }

  const match = {
    _id: new Types.ObjectId(currentUserId)
  }

  const firstStepsOfPipeline = [
    {
      $match: match
    },
    {
      $lookup: {
        from: 'user_for_events',
        localField: 'usersForEvents',
        foreignField: '_id',
        as: 'usersForEvents'
      }
    },
    {
      $unwind: {
        path: '$usersForEvents',
        preserveNullAndEmptyArrays: false
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
              newRoot: '$usersForEvents'
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
            $addFields: {
              nextEventDate: {
                $first: {
                  $filter: {
                    input: '$events.startDate',
                    as: 'startDate',
                    cond: {
                      $gte: ['$$startDate', new Date()]
                    }
                  }
                }
              }
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
              username: 1,
              firstName: 1,
              lastName: 1,
              email: 1,
              nextEventDate: 1,
              eventsCount: 1,
              phoneNumber: 1
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
        countOfNotFilteredDocuments: { $arrayElemAt: ['$countOfDocuments.count', 0] }
      }
    }
  ]

  const [{ documents, countOfNotFilteredDocuments }] = await User.aggregate(pipeline).exec()
  const pages = getPagesCount(countOfNotFilteredDocuments, limit)

  res.status(200).json({
    message: 'success',
    code: 200,
    data: {
      pages: pages,
      users: documents
    }
  })
}

module.exports = getUsers
