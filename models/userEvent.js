const {Schema, model} = require('mongoose')

const userEventSchema = Schema({
    to: {
        type: Schema.Types.ObjectId,
        ref: 'user_for_events'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Schema.Types.Date,
        required: true
    },
    endDate: {
        type: Schema.Types.Date,
        required: true
    }
})

const UserEvent = model('user_event', userEventSchema)

module.exports = UserEvent;


