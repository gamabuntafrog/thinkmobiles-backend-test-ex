const paginationDBHelper = (query) => {
  const { page = 0, limit = 5 } = query

  const skip = page * limit
  const start = page * limit
  const end = page * limit + 5

  return { start, end, limit, skip }
}

module.exports = paginationDBHelper
