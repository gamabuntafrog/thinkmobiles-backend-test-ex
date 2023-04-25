const getPagesCount = (documentsLength, limit) => {
  const pages = Math.ceil(documentsLength / limit) || 1

  return pages
}

module.exports = getPagesCount
