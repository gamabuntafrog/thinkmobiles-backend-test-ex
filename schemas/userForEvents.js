const {body} = require("express-validator");

const userForEventsSchema = [
    body('username').exists().isLength({min: 3, max: 16}),
    body('email').exists().isEmail(),
    body('firstName').exists().isLength({min: 3, max: 14}),
    body('lastName').exists().isLength({min: 3, max: 14}),
]



module.exports = userForEventsSchema;