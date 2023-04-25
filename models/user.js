const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = Schema(
  {
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    token: {
      type: String,
      default: null
    },
    usersForEvents: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'user_for_events'
        }
      ],
      default: []
    }
  },
  {
    timestamps: true
  }
)

userSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

const User = model('user', userSchema)

module.exports = User
