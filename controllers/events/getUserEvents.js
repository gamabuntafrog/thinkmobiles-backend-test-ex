const UserForEvents = require("../../models/userForEvents");
const UserEvent = require("../../models/userEvent");
const {NotFound} = require('http-errors');

const getUserEvents = async (req, res) => {
    const {currentUserId} = req;
    const {id} = req.params;

    const sortBy = req.query.sortBy || null;
    const variant = req.query.variant || 'asc';
    const page = req.query.page || 0;
    const limit = 5;

    const start = (page * limit);
    const end = ((page * limit) + 5);

    const user = await UserForEvents.findById(id)
        .populate({
            path: 'events',
            options: {
                sort: {
                    [sortBy]: variant
                }
            },
        })


    if (!user?.events || user?.creator?.toString() !== currentUserId.toString()) {
        throw new NotFound('Events for this user does not exist');
    }

    const formattedEvents = user.events.slice(start, end).map((event) => {
        const {title, description, startDate, endDate, _id} = event

        return {title, description, startDate, endDate, _id}
    })

    const {events: notPopulatedEvents} = await UserForEvents.findById(id)

    const pages = Math.ceil(notPopulatedEvents.length / limit)


    res.status(200).json({
        message: 'success',
        code: 200,
        data: {
            pages: pages,
            events: formattedEvents
        }
    })
}

module.exports = getUserEvents;