const User = require("../../models/user");


const getUsers = async (req, res) => {
    const {currentUserId} = req;
    const sortBy = req.query.sortBy || null;
    const variant = req.query.variant || 'asc';
    const page = req.query.page || 0;
    const limit = 5;

    const start = (page * limit);
    const end = ((page * limit) + 5);

    const currentUser = await User.findById(currentUserId);
    const {usersForEvents: users} = await User.findById(currentUserId).populate({
        path: 'usersForEvents',
        options: {
            sort: {
                [sortBy]: variant
            }
        },
        populate: {
            path: 'events'
        }
    })

    let formattedUsers;

    if (sortBy === 'nextEventDate') {
        formattedUsers = users.map((user) => {
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
            .sort((a, b) => {
                if (!b.nextEventDate) {
                    return 1
                }
                if (!a.nextEventDate) {
                    return 1
                }

                return variant === 'asc' ? a.nextEventDate - b.nextEventDate : b.nextEventDate - a.nextEventDate;
            })
            .slice(start, end)
    } else {
        formattedUsers = users.slice(start, end).map((user) => {
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
    }

    const pages = Math.ceil(currentUser.usersForEvents.length / limit)

    res.status(200).json({
        message: 'success',
        code: 200,
        data: {
            pages: pages,
            users: formattedUsers
        }
    })
}

module.exports = getUsers;