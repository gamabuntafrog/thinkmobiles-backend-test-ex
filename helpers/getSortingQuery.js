const getSortingQuery = (query) => {
  const { sortBy = null, variant = 'asc' } = query

  const formattedVariant = variant === 'asc' ? 1 : -1

  return { sortBy, variant: formattedVariant }
}

module.exports = getSortingQuery
