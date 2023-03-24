const UserEvent = require("../../models/userEvent");
const UserForEvents = require("../../models/userForEvents");
const validateDateForUserEvent = require("../../middlewares/validateDateForUserEvent");
const {NotFound} = require("http-errors");


const addEvent = async (req, res) => {
    const {currentUserId} = req;
    const {userId} = req.params;
    const {title, description, startDate, endDate} = req.body

    await validateDateForUserEvent(userId, {startDate, endDate})

    const user = await UserForEvents.findById(userId)

    if (!user || user?.creator?.toString() !== currentUserId.toString()) {
        throw new NotFound('User does not exist')
    }

    const event = await UserEvent.create({
        title,
        description,
        startDate,
        endDate
    })

    await UserForEvents.findByIdAndUpdate(userId,{
        $push: {
            events: event._id
        },
        $inc: {
            eventsCount: 1
        }
    })

    res.status(201).json({
        message: 'success',
        code: 201,
    })
}

module.exports = addEvent;