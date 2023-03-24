const {NotFound, Conflict} = require('http-errors');
const UserForEvents = require("../models/userForEvents");


const validateDateForUserEvent = async (userId, body) => {
    const {startDate, endDate} = body;

    const user = await UserForEvents.findById(userId).populate('events')

    if (!user.events) {
        throw new NotFound('Events for this user does not exist');
    }

    const isValidDate = user.events.every((el) => {
        return new Date(startDate) < el.startDate && new Date(endDate) < el.startDate || new Date(startDate) > el.endDate && new Date(endDate) > el.endDate
    })

    if (!isValidDate) {
        throw new Conflict('You can’t create event for this time')
    }

    return true;
}

module.exports = validateDateForUserEvent