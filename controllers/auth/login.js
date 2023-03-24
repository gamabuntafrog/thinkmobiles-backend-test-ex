const {BadRequest} = require('http-errors')
const jwt = require("jsonwebtoken")
const User = require("../../models/user");

const login = async (req, res) => {
    const {SECRET_KEY} = process.env

    const {username, password} = req.body
    const user = await User.findOne({username})

    if (!user || !user.comparePassword(password)) {
        throw new BadRequest('Username or password is wrong')
    }

    const payload = {
        id: user._id
    }

    const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: '7d'
    })

    user.token = token
    await user.save()

    res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            token
        }
    })
}

module.exports = login