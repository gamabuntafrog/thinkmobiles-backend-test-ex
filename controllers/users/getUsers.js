const UserForEvents = require("../../models/userForEvents");
const {validationResult} = require("express-validator");


const getUsers = async (req, res) => {

    const users = await UserForEvents.find().populate('events')

    const formattedUsers = users.map((user) => {
        const {username, firstName, lastName, email, phoneNumber, _id, events, eventsCount} = user
        const nextEventDate = events.find(({startDate}) => startDate >= Date.now())?.startDate || null

        return {
            username,
            firstName,
            lastName,
            email,
            phoneNumber,
            _id,
            nextEventDate,
            eventsCount
        }
    })

    res.status(200).json({
        message: 'success',
        code: 200,
        data: {
            users: formattedUsers
        }
    })
}

module.exports = getUsers;