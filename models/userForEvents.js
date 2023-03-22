const {Schema, model} = require('mongoose')

const userForEventsSchema = Schema({
    username: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    }
})

const UserForEvents = model('user', userForEventsSchema)

module.exports = UserForEvents
