const UserEvent = require("../../models/userEvent");
const UserForEvents = require("../../models/userForEvents");


const addEvent = async (req, res) => {
    const {id} = req.params;
    const {title, description, startDate, endDate} = req.body

    const event = await UserEvent.create({
        title,
        description,
        startDate,
        endDate
    })

    await UserForEvents.findByIdAndUpdate(id,{
        $push: {
            events: event._id
        }
    })

    res.status(201).json({
        message: 'success',
        code: 201,
    })
}

module.exports = addEvent;