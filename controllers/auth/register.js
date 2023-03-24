
const bcrypt = require('bcryptjs')
const {Conflict} = require('http-errors')
const jwt = require("jsonwebtoken");
const User = require("../../models/user");



const register = async (req, res) => {
    const {password, username} = req.body
    console.log(req.body)
    const isUserExist = await User.findOne({
        $or: [
            {
                username: username,
            }
        ]
    })

    if (isUserExist) {
        throw new Conflict('User already exists')
    }

    const newUser = new User(req.body)
    newUser.setPassword(password)

    const payload = {
        id: newUser._id
    }

    const {SECRET_KEY} = process.env
    const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: '96h'
    })

    newUser.token = token

    await newUser.save()

    res.status(201).json({
        code: 201,
        status: 'success',
        data: {
            user: newUser,
            token: token
        }
    })
}

module.exports = register
