const UserForEvents = require("../../models/userForEvents");
const {NotFound} = require('http-errors')

const getUser = async (req, res) => {
    const {currentUserId} = req;
    const {id: userId} = req.params;

    const user = await UserForEvents.findOne({
        _id: userId,
        creator: currentUserId
    })

    if (!user) {
        throw new NotFound('User does not exist')
    }

    const {
        username,
        firstName,
        lastName,
        email,
        phoneNumber,
        _id
    } = user

    const formattedUser = {
        username,
        firstName,
        lastName,
        email,
        phoneNumber,
        _id
    }

    res.status(200).json({
        message: 'success',
        code: 200,
        data: {
            user: formattedUser
        }
    })
}

module.exports = getUser;