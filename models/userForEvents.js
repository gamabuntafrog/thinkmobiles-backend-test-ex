const {Schema, model} = require('mongoose')

const userForEventsSchema = Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
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
    },
    events: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'user_event'
        }],
    },
    eventsCount: {
        type: Number,
        default: 0,
    }
})

const UserForEvents = model('user_for_events', userForEventsSchema)

module.exports = UserForEvents
