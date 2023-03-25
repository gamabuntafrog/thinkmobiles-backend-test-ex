const {Schema, model} = require('mongoose')

function isMyFieldRequired(fieldName) {
    return function () {
        return typeof this[fieldName] === 'string' ? false : true
    }
}

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
        required: isMyFieldRequired('description')
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


