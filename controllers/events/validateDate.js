const UserForEvents = require("../../models/userForEvents");
const {NotFound, Conflict} = require('http-errors');
const validateDateForUserEvent = require("../../middlewares/validateDateForUserEvent");


const validateDate = async (req, res) => {

    const {userId} = req.params;
    const {startDate, endDate} = req.body;

    await validateDateForUserEvent(userId, {startDate, endDate})

    res.status(200).json({
        message: 'success',
        code: 200,
    })
}

module.exports = validateDate