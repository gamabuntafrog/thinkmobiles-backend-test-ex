const {body} = require("express-validator");

const userSchema = [
    body('username').exists().isLength({min: 3, max: 16}),
    body('password').exists().isLength({min: 3, max: 30})
]

module.exports = userSchema;