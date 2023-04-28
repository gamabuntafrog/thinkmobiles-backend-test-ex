const paginationHelper = require('../../helpers/paginationDBHelper')
const getPagesCount = require('../../helpers/getPagesCount')
const User = require('../../models/user')
const getSortingQuery = require('../../helpers/getSortingQuery')
const { Types } = require('mongoose')
const UserForEvents = require('../../models/userForEvents')

// Зробити матч перед facet DONE
// Зробити addFields після сортування якщо воно не по цьому полю DONE
// Поставити limit для nextEventDate DONE

// створити декілька агрегацій
// зробити пошук по полю creator

const addNextEventDateField = {
  $addFields: {
    nextEventDate: {
      $ifNull: [
        {
          $first: '$events.startDate'
        },
        null
      ]
    }
  }
}

const pipelineOfGettingAndSortingUsersForEvents = (sortBy, sorting, skip, limit) => [
  {
    $lookup: {
      from: 'user_events',
      localField: 'events',
      foreignField: '_id',
      as: 'events',
      pipeline: [
        { $match: { $expr: { $gte: ['$startDate', new Date()] } } },
        { $limit: 1 },
        { $project: { startDate: 1, endDate: 1 } }
      ]
    }
  },
  ...(sortBy
    ? [
        ...(sortBy === 'nextEventDate' ? [addNextEventDateField] : []),
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
  ...(sortBy !== 'nextEventDate' ? [addNextEventDateField] : []),
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
]

const getUsersByCreator = async (req, res) => {
  const { currentUserId, query } = req

  const { sortBy, variant } = getSortingQuery(query)
  const { skip, limit } = paginationHelper(query)

  const sorting = {}

  if (sortBy) {
    sorting[sortBy] = variant
  }

  const { usersForEvents } = await User.findById(currentUserId).lean()

  const match = {
    _id: {
      $in: usersForEvents
    }
  }

  const pipeline = [
    { $match: match },
    {
      $facet: {
        countOfNotFilteredDocuments: [
          {
            $count: 'count'
          }
        ],
        documents: [...pipelineOfGettingAndSortingUsersForEvents(sortBy, sorting, skip, limit)]
      }
    },
    {
      $project: {
        countOfNotFilteredDocuments: { $first: '$countOfNotFilteredDocuments.count' },
        documents: 1
      }
    }
  ]

  const [{ documents, countOfNotFilteredDocuments }] = await UserForEvents.aggregate(
    pipeline
  ).exec()

  const pages = getPagesCount(countOfNotFilteredDocuments, limit)

  res.status(200).json({
    message: 'success',
    code: 200,
    data: {
      pages: pages,
      users: documents
      // cursor: cursor
    }
  })
}

// getUsersSecond
// Робить всі операції по сортуванню фільтрації та створенню полів в sub-pipeline який знаходиться в середині $lookup

const getUsersSecond = async (req, res) => {
  // return await getUsersByCreator(req, res)

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

  const pipeline = [
    { $match: match },
    {
      $lookup: {
        from: 'user_for_events',
        localField: 'usersForEvents',
        foreignField: '_id',
        as: 'usersForEvents',
        pipeline: [
          {
            $facet: {
              countOfNotFilteredDocuments: [{ $count: 'count' }],
              documents: [
                ...pipelineOfGettingAndSortingUsersForEvents(sortBy, sorting, skip, limit)
              ]
            }
          },
          {
            $project: {
              countOfNotFilteredDocuments: { $first: '$countOfNotFilteredDocuments.count' },
              documents: 1
            }
          }
        ]
      }
    },
    {
      $project: {
        usersForEvents: { $first: '$usersForEvents' }
      }
    }
  ]

  const [
    {
      usersForEvents: { documents, countOfNotFilteredDocuments }
    }
  ] = await User.aggregate(pipeline).exec()
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

const getUsers = async (req, res) => {
  // return await getUsersSecond(req, res)

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

  const pipeline = [
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
    },
    {
      $facet: {
        documents: [
          {
            $replaceRoot: {
              newRoot: '$usersForEvents'
            }
          },
          ...pipelineOfGettingAndSortingUsersForEvents(sortBy, sorting, skip, limit)
        ],
        countOfDocuments: [
          {
            $count: 'count'
          }
        ]
      }
    },
    {
      $project: {
        documents: 1,
        countOfNotFilteredDocuments: { $first: '$countOfDocuments.count' }
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
