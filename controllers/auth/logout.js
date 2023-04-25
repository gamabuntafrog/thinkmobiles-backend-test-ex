const User = require('../../models/user')

const logout = async (req, res) => {
  const { currentUserId } = req

  await User.findByIdAndUpdate(currentUserId, {
    token: null
  })

  res.status(204).json()
}

module.exports = logout
