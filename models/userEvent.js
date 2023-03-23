const {Schema, model} = require('mongoose')

const userEventSchema = Schema({
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

const UserEvent = model('userevent', userEventSchema)

module.exports = UserEvent;


