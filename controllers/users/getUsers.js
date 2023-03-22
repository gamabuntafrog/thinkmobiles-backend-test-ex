const UserForEvents = require("../../models/userForEvents");


const getUsers = async (req, res) => {

    const users = await UserForEvents.find()



    const formattedUsers = users.map((user) => {
        const {username, firstName, lastName, email, phoneNumber, _id} = user

        return {
            username,
            firstName,
            lastName,
            email,
            phoneNumber,
            _id
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