const UserForEvents = require("../../models/userForEvents");
const {NotFound, Conflict} = require('http-errors')

const addUser = async (req, res) => {
    const {username, firstName, lastName, email, phoneNumber} = req.body;

    const users = await UserForEvents.find({
        email,
        username
    })

    if (users.length > 0) {
        throw new Conflict('User already exists')
    }

    await UserForEvents.create({
        username,
        firstName,
        lastName,
        email,
        phoneNumber
    })

    res.status(201).json({
        message: 'success',
        code: 201,
    })
}

module.exports = addUser