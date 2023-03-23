const UserForEvents = require("../../models/userForEvents");
const UserEvent = require("../../models/userEvent");
const {NotFound} = require('http-errors');

const getUserEvents = async (req, res) => {
    const {id} = req.params;

    const user = await UserForEvents.findById(id).populate('events')

    if (!user.events) {
        throw new NotFound('Events for this user does not exist');
    }

    const {events} = user;

    console.log(events)

    const formattedEvents = events.map((event) => {
        const {title, description, startDate, endDate, _id} = event

        return {title, description, startDate, endDate, _id}
    })

    res.status(200).json({
        message: 'success',
        code: 200,
        data: {
            events: formattedEvents
        }
    })
}

module.exports = getUserEvents;