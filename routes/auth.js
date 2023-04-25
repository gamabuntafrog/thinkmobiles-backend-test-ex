const express = require('express')
const ctrlWrapper = require('../middlewares/ctrlWrapper')
const register = require('../controllers/auth/register')
const login = require('../controllers/auth/login')
const getCurrent = require('../controllers/auth/getCurrent')
const auth = require('../middlewares/auth')
const logout = require('../controllers/auth/logout')
const checkValidation = require('../middlewares/checkValidation')
const userSchema = require('../schemas/user')

const router = express.Router()

router.post('/register', ...userSchema, checkValidation, ctrlWrapper(register))

router.post('/login', ...userSchema, checkValidation, ctrlWrapper(login))

router.post('/logout', ctrlWrapper(logout))

router.get('/current', ctrlWrapper(auth), ctrlWrapper(getCurrent))

module.exports = router
